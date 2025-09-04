import { doc, getDoc, setDoc } from 'firebase/firestore'
import { appFireStore } from "../firebase/config.js"
import { useSelector } from 'react-redux'

const useAcc = () => {
  const db = appFireStore;
  //redux 전역변수
  const studentSelectedList = useSelector(({ studentSelected }) => studentSelected);
  const activitySelectedList = useSelector(({ activitySelected }) => activitySelected);
  const user = useSelector(({ user }) => user);
  //★★★4. 활동 누가 함수
  const makeAccWithSelectedActi = async () => {
    const newActiList = [];
    const promises = activitySelectedList.map(async ({ value: actiId }) => {
      const actiDoc = doc(db, "activities", actiId);             //id로 활동 acti 참조
      const actiSnapshot = await getDoc(actiDoc);                //데이터 통신
      const acti = actiSnapshot.data();
      const assignedDate = new Date().toISOString().split("T")[0];
      let { byte, monImg, studentDoneList, subjDetail, subject, monster, quizInfo,
        particiList, particiSIdList, likedCount, isPrivate, isHomework, createdTime, record, ...rest } = acti;   //불필요 속성 제거
      //랜덤문구 체크
      if (acti.extraRecordList?.length > 0) {
        const randomIndex = Math.floor(Math.random() * acti.extraRecordList.length);
        record = acti.extraRecordList[randomIndex];
      };
      newActiList.push({ id: actiSnapshot.id, record, ...rest, assignedDate });
    })
    await Promise.all(promises).catch((error) => {
      alert(`관리자에게 문의하세요(useAcc_04),${error}`);
      console.log(error)
    });
    return { newActiList };
  }
  //★★ 활동 기록 누가
  const makeAccRec = (list) => {
    if (list.length > 0) {
      return list.reduce((acc, cur) => acc.concat(" ", cur.record), '') //리턴 값이 초기값으로 대입됨.
    } else { return '' }
  }
  //★★★중복 제거: 반복형 활동(250607 수정)
  const makeUniqueList = (list) => {
    return list.reduce((acc, cur) => {
      const isRepeated = acc.findIndex(({ id }) => id === cur.id) === -1 //배열에서 조건을 충족하는 index를 반환, 없을 경우 -1 반환; 
      if (isRepeated) { acc.push(cur); }  //중복 없음
      else {                              //중복 발견
        //새 활동 반복형 타입?
        if (cur.repeatInfoList?.length > 0) {
          const accRepeated = acc.find(({ id }) => id === cur.id);
          //기존 활동 반복형 타입?
          if (accRepeated.repeatInfoList?.length > 0) {
            let repeatTimes = accRepeated.repeatTimes || 1;
            repeatTimes = repeatTimes + 1;
            const ascendingList = accRepeated.repeatInfoList.sort((a, b) => a.times - b.times);
            ascendingList.forEach(item => { if (item.times <= repeatTimes) cur.record = item.record; });
            cur = { ...cur, repeatTimes }
          }
        }
        acc = acc.filter(({ id }) => id !== cur.id);           //이전 삭제 
        acc.push(cur);                                         //새로 덮기
      }
      return acc;
    }, [])
  }
  //★★★★ 1. 핵심 로직(250208 간소화)
  const writeAccDataOnDB = async (classId) => {
    const promises = studentSelectedList.map(async ({ value: petId }) => {
      const petRef = doc(appFireStore, "classRooms", classId, "students", petId);
      const petDoc = await getDoc(petRef);
      const curList = petDoc.data().actList;                                            //기존 활동
      const { newActiList } = await makeAccWithSelectedActi();                          //신규 활동
      const actiList = [...(curList || []), ...newActiList];                            //기존+신규
      const uniqueList = makeUniqueList(actiList);                                      //중복 제거
      setDoc(petRef, { actList: uniqueList, accRecord: makeAccRec(uniqueList) }, { merge: true });
    })
    try {
      await Promise.all(promises)
    } catch (error) {
      console.log(error)
      alert(`관리자에게 문의하세요(useAcc_01),${error}`);
    }
  }
  //★★★★ 2. 담임반 누가기록
  const writeHomeAccOnDB = async (classId, type) => {
    const typeList = `${type}List`;
    const typeAccRecord = `${type}AccRecord`;
    try {
      await Promise.all(
        studentSelectedList.map(async ({ value }) => {             //선택된 모든 학생에게서 아래 작업 반복
          const id = value //id 참조
          const petRef = doc(appFireStore, "classRooms", classId, "students", id);
          const pet = await getDoc(petRef);
          const curActiList = pet.data()[typeList] || [];            // 선택 학생의 '기존 활동'
          const { newActiList } = await makeAccWithSelectedActi();   // 선택한 활동의 누가 배열, 누가 기록 반환
          const actiList = [...curActiList, ...newActiList];         // 기존 활동들과 새로운 활동을 합치기.
          const uniqueList = makeUniqueList(actiList);
          setDoc(petRef, { [typeList]: uniqueList, [typeAccRecord]: makeAccRec(uniqueList) }, { merge: true });
        }))
    } catch (error) {
      console.log(error)
      alert(`관리자에게 문의하세요(useAcc_02),${error}`);
    }
  }
  //★★★★ 3. 수행 관리 입력하기: 수정(250515)
  const writePerfRecDataOnDB = async (studentList, classId, selectedPerf, perfRecord) => {
    const promises = studentList.map(async (student, index) => {
      const assignedDate = new Date().toISOString().split("T")[0];
      const madeBy = user.name;
      let newActiList = student.actList || [];                                                                         //기존 list 없으면 []
      if (perfRecord[index] !== '') {
        newActiList = newActiList.filter(({ id }) => { return id !== selectedPerf.id });                               //기존에 같은 수행평가를 입력했다면 제거
        newActiList.push({ ...selectedPerf, record: perfRecord[index], assignedDate, madeBy });                        //성취도에 맞게 문구 변경    
      }
      const newAcc = makeAccRec(newActiList);                                                                          //누가 기록 생성하기    
      const updatedStudent = { ...student, actList: newActiList, accRecord: newAcc };                                  //학생 업데이트
      //DB 통신
      const petDoc = doc(appFireStore, "classRooms", classId, "students", student.id);                                 //학생 DB ref
      await setDoc(petDoc, updatedStudent, { merge: true });
    })
    await Promise.all(promises).catch((error) => {
      alert(`관리자에게 문의하세요(useAcc_03),${error}`);
      console.log(error);
    })
  }
  //★★★ 4. 선택 활동 삭제 로직(250904)
  const delActiDataOnDB = async (classId) => {
    const promises = studentSelectedList.map(async ({ value: petId }) => {
      const petRef = doc(appFireStore, "classRooms", classId, "students", petId);
      const petDoc = await getDoc(petRef);
      const curList = petDoc.data().actList;                                            //기존 활동
      let deleted
      activitySelectedList.forEach((acti) => { deleted = curList.filter((item) => item.id !== acti.value); });
      setDoc(petRef, { actList: deleted, accRecord: makeAccRec(deleted) }, { merge: true });
    });
    try { await Promise.all(promises) }
    catch (error) {
      console.log(error)
      alert(`관리자에게 문의하세요(useAcc_04),${error}`);
    }
  }
  return { makeAccRec, makeAccWithSelectedActi, writeAccDataOnDB, writePerfRecDataOnDB, writeHomeAccOnDB, delActiDataOnDB }
}

export default useAcc