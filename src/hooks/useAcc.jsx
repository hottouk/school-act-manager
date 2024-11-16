import { doc, getDoc, setDoc } from 'firebase/firestore'
import { appFireStore } from "../firebase/config.js"
import { useSelector } from 'react-redux'

const useAcc = () => {
  const db = appFireStore
  //redux 전역변수
  const studentSelectedList = useSelector(({ studentSelected }) => { return studentSelected })
  const activitySelectedList = useSelector(({ activitySelected }) => { return activitySelected })

  //★★★ 활동 누가 함수: 선택 활동을 누적하여 반환한다.
  const makeAccWithSelectedActi = async () => {
    let newActiList = []
    await Promise.all( //Promise.All을 사용하면 모든 Promise가 반환될 때까지 기다린다. 캐시에서 해도 될듯한 작업 코딩.
      activitySelectedList.map(async ({ value }) => { //선택된 모든 활동에서 아래 작업 반복
        let actiId = value                           //id 참조
        let actiRef = doc(db, "activities", actiId); //id로 활동 acti 참조
        let actiSnap = getDoc(actiRef);              //데이터 통신
        await actiSnap.then((snapshot) => {
          let acti = snapshot.data();
          if (acti.extraRecordList && acti.extraRecordList.length > 1) {                       //extra가 있으면 랜덤문구
            let randomIndex = Math.floor(Math.random() * acti.extraRecordList.length);
            acti.record = acti.extraRecordList[randomIndex]
          }
          newActiList.push({ id: snapshot.id, ...acti });
        })
        return null
      }))
    return { newActiList }
  }

  //★★ 활동 기록 누가 함수: 누가 기록을 누적하여 반환한다.
  const makeAccRec = (list) => {
    if (list.length > 0) {
      return list.reduce((acc, cur) => acc.concat(" ", cur.record), '') //리턴 값이 초기값으로 대입됨.
    } else { return '' }
  }

  //중복 제거
  const makeUniqueList = (list) => {
    return list.reduce((acc, cur) => {
      if (acc.findIndex(({ id }) => id === cur.id) === -1) {  //배열에서 조건을 충족하는 index를 반환, 없을 경우 -1 반환; 
        acc.push(cur);
      } else {
        acc = acc.filter(({ id }) => id !== cur.id)           //이전꺼 지우고 
        acc.push(cur);                                        //새로 덮어 씌우기
      }
      return acc;
    }, [])
  }

  //★★★★ 핵심 로직 //todo 코드 간결화 하기
  const writeAccDataOnDB = async (classId) => {
    studentSelectedList.map(({ value }) => { //선택된 모든 학생에게서 아래 작업 반복 
      let studentId = value //id 참조
      let petRef = doc(appFireStore, "classRooms", classId, "students", studentId); //id로 학생 data 위치 참조
      getDoc(petRef).then((pet) => {                                                //참조한 학생 data 반환 Promise
        try {
          let curActiList = pet.data().actList                  //선택 학생 한명의 '기존 활동' 
          makeAccWithSelectedActi().then(({ newActiList }) => { //선택한 활동의 누가 배열, 누가 기록 반환
            if (!curActiList || curActiList.length === 0) {     //기록 활동 x 누가 기록 x -> 완전한 첫 작성
              let accRec = makeAccRec(newActiList)
              setDoc(petRef, {
                actList: newActiList,              //누가'활동'에 선택 활동 반영
                accRecord: accRec                  //누가'기록'에 선택 활동 반영
              }, { merge: true })
            } else if (curActiList) { //기존 활동 o, 누가 기록 o
              let actiList = [...curActiList, ...newActiList];              //기존 누가 활동과 새로운 입력할 활동을 섞는다.
              let uniqueList = actiList.reduce((acc, current) => {          //중복 제거 id값 비교
                if (acc.findIndex(({ id }) => id === current.id) === -1) {  //배열에서 조건을 충족하는 index를 반환, 없을 경우 -1 반환; 
                  acc.push(current);
                } else {
                  acc = acc.filter(({ id }) => id !== current.id)          //이전꺼 지우고 
                  acc.push(current);                                       //새로 덮어 씌우기
                }
                return acc;
              }, [])
              setDoc(petRef, {
                actList: uniqueList,                          //기존 활동 + 새로운 활동
                accRecord: makeAccRec(uniqueList)             //기존 기록 + 새로운 기록
              }, { merge: true })
            }
          })
        } catch (error) {
          console.log(error.message)
        }
      })
      return null;
      //학생 반복 종료
    })
  }

  //★★★★ 수행 관리 입력하기
  const writePerfRecDataOnDB = async (studentList, classId, selectedPerf, perfRecord) => {
    studentList.forEach((student, index) => {
      let curActiList = student.actList || [];                                                                        //기존 list 없으면 []
      if (curActiList.length > 0) { curActiList = curActiList.filter(({ id }) => { return id !== selectedPerf.id }) } //기존에 같은 수행평가를 입력했다면 제거
      selectedPerf.record = perfRecord[index]                                                                         //성취도에 맞게 문구 변경    
      let newActiList = [...curActiList]                                                                              //기존 활동에 추가
      if (selectedPerf.record !== '') { newActiList.push(selectedPerf) }                                              //수행 문구 입력된 경우만 추가
      let newAcc = makeAccRec(newActiList)                                                                            //누가 기록 생성하기    
      let updatedStudent = { ...student, actList: newActiList, accRecord: newAcc }                                    //학생 업데이트    
      //DB 통신
      let petRef = doc(appFireStore, "classRooms", classId, "students", student.id);                                  //학생 DB ref
      try {
        setDoc(petRef, updatedStudent, { merge: true })
      } catch (error) {
        console.log(error.message)
      }
    })
  }

  return { makeAccWithSelectedActi, writeAccDataOnDB, writePerfRecDataOnDB }
}

export default useAcc