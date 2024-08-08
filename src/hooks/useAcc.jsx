import { doc, getDoc, setDoc } from 'firebase/firestore'
import { appFireStore } from "../firebase/config.js"
import { useSelector } from 'react-redux'

const useAcc = () => {
  const db = appFireStore
  //redux 전역변수
  const studentSelectedList = useSelector(({ studentSelected }) => { return studentSelected })
  const activitySelectedList = useSelector(({ activitySelected }) => { return activitySelected })

  //★★★ 활동기록 누가 함수: 선택 활동과 그 활동의 누가 기록을 누적하여 반환한다.
  const makeAccWithSelectedActi = async () => {
    let newActList = []
    let selectedAccRecord = ''
    await Promise.all( //Promise.All을 사용하면 모든 Promise가 반환될 때까지 기다린다. 캐시에서 해도 될듯한 작업 코딩.
      activitySelectedList.map(async ({ value }) => { //선택된 모든 활동에서 아래 작업 반복
        let actiId = value                           //id 참조
        let actiRef = doc(db, "activities", actiId); //id로 활동 acti 참조
        let actiSnap = getDoc(actiRef);              //데이터 통신
        await actiSnap.then((snapshot) => {
          let acti = snapshot.data();
          if (acti.extraRecordList && acti.extraRecordList.length > 1) {                       //extra가 있으면 랜덤문구
            let randomI = Math.floor(Math.random() * acti.extraRecordList.length);
            selectedAccRecord = selectedAccRecord.concat(" ", acti.extraRecordList[randomI])
          }
          else { selectedAccRecord = selectedAccRecord.concat(" ", acti.record) }              //없으면 대표 문구
          newActList.push({ id: snapshot.id, ...acti });
        })
        return null
      }))
    return { newActList, selectedAccRecord }
  }

  //★★★ 핵심 로직 ★★★ 
  const writeAccDataOnDB = async (classId) => {
    studentSelectedList.map(({ value }) => { //선택된 모든 학생에게서 아래 작업 반복 
      let studentId = value //id 참조
      const petRef = doc(appFireStore, "classRooms", classId, "students", studentId); //id로 학생 data 위치 참조
      getDoc(petRef).then((student) => {                                              //참조한 학생 data 반환 Promise
        try {
          let actList = student.data().actList        //선택 학생 한명의 기존 누가 '활동' 반환
          let accRecord = student.data().accRecord    //선택 학생 한명의 기존 누가 '기록' 반환
          makeAccWithSelectedActi().then(({ newActList, selectedAccRecord }) => { //선택한 활동의 누가 배열, 누가 기록 반환
            if ((!actList && !accRecord) || actList.length === 0) { //기록 활동 x 누가 기록 x -> 완전한 첫 작성
              setDoc(petRef, {
                actList: newActList,         //누가'활동'에 선택 활동 반영
                accRecord: selectedAccRecord //누가'기록'에 선택 활동 반영
              }, { merge: true })
            } else if (!actList && accRecord) { //기록 활동 x 교사 임의 입력 누가 기록 o
              setDoc(petRef, {
                actList: newActList,                            //새로운 활동 추가
                accRecord: accRecord.concat(" ", selectedAccRecord)  //기존 기록 + 새로운 기록
              }, { merge: true })
            } else if (actList && accRecord) { //기존 활동 o, 누가 기록 o
              let newList = [...actList, ...newActList];             //기존 누가 활동과 새로운 입력할 활동을 섞는다.
              let uniqueList = newList.reduce((acc, current) => {          //id로 비교하여 중복이 아닌 경우만 acc에 추가
                if (acc.findIndex(({ id }) => id === current.id) === -1) { //배열에서 조건을 충족하는 index를 반환, 없을 경우 -1 반환; 요소가 obj일경우 destructure 가능
                  acc.push(current);
                }
                return acc;
              }, [])
              setDoc(petRef, {
                actList: uniqueList,                            //기존 활동 + 새로운 활동
                accRecord: accRecord.concat(" ", selectedAccRecord)  //기존 기록 + 새로운 기록
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

  return { makeAccWithSelectedActi, writeAccDataOnDB }
}

export default useAcc