//컴포넌트
import MultiSelector from '../../components/MultiSelector';
import DialogModal from '../../components/StaticDialogModal.jsx';

//리덕스
import { useSelector } from 'react-redux';

//파이어베이스
import { appFireStore } from '../../firebase/config.js'
import { doc, getDoc, setDoc } from 'firebase/firestore';

//CSS styles
import styles from './ClassRoomDetails.module.css';
import { useRef, useState } from 'react';

const MainSelector = ({ studentList, activitiyList, classId }) => {

  //redux 전역변수
  const studentSelected = useSelector(({ studentSelected }) => { return studentSelected })
  const activitySelected = useSelector(({ activitySelected }) => { return activitySelected })

  //지역 변수(대화창 보여주기, 대화창 확인버튼)
  const [modalShow, setModalShow] = useState(false)
  const selectStudentRef = useRef(null);
  const selectActRef = useRef(null);


  //★★★ 핵심 로직
  const writeDataOnDB = async () => {
    studentSelected.map(({ value }) => { //선택된 모든 학생에게서 아래 작업 반복 
      let studentId = value //id 참조
      const studentRef = doc(appFireStore, "classRooms", classId.id, "students", studentId); //id로 학생 data 위치 참조
      getDoc(studentRef).then((student) => {//학생 데이터 반환 Promise
        try {
          let curAccActList = student.data().actList //선택 학생 한명의 기존 누가 활동 반환
          //누가기록 작성 함수
          makeAccWithSelectedActs(activitySelected).then((newAccList) => { //newAccList는 선택 활동 누가
            //데이터 서버에 업데이트
            if (!curAccActList) { //첫 작성이라면 그대로 업데이트
              setDoc(studentRef, {
                actList: newAccList
              }, { merge: true })
            } else {//기존 누가기록이 있다면 ~
              let newList = [...curAccActList, ...newAccList];
              let uniqueList = newList.reduce((acc, current) => { //id를 찾아 비교하고 같지 않을때에만 acc에 추가
                if (acc.findIndex(({ id }) => id === current.id) === -1) { //배열에서 조건을 충족하는 index를 반환, 없을경우 -1 반환; 요소가 obj일경우 destructure 가능
                  acc.push(current);
                }
                return acc;
              }, [])
              setDoc(studentRef, {
                actList: uniqueList
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

  //셀렉터에서 선택된 값 해제하기
  const onClearSelect = () => {
    if (selectStudentRef.current) {
      selectStudentRef.current.clearValue();
    }
    if (selectActRef.current) {
      selectActRef.current.clearValue();
    }
  }

  //활동기록 누가 함수
  const makeAccWithSelectedActs = async () => {
    let actList = []
    await Promise.all( //Promise.All을 사용하면 모든 Promise가 반환될 때까지 기다린다. //캐시에서 해도 될듯한 작업임.
      activitySelected.map(async ({ value }) => { //선택된 모든 활동에서 아래 작업 반복
        let activityId = value //id 참조
        const activityRef = doc(appFireStore, "activities", activityId); //id로 활동 data 위치 참조
        const activitySnap = getDoc(activityRef);
        await activitySnap.then((activity) => {
          actList.push({ id: activity.id, ...activity.data() });
        })
        return null
      }))
    return actList
  }

  const handleSelectComplete = async () => {
    console.log('선택 학생List', studentSelected)
    console.log('선택 활동List', activitySelected)
    setModalShow(true) //대화창 pop
  }

  return (
    <>
      {/* 학생 셀렉터, 활동 셀렉터 */}
      <div className={styles.main_slector}>
        <div className={styles.student_slector}>
          <MultiSelector studentList={studentList} selectStudentRef={selectStudentRef} />
        </div>
        <div className={styles.activity_slector}>
          <MultiSelector activitiyList={activitiyList} selectActRef={selectActRef} />
        </div>
        <button className={styles.slectorButton} onClick={() => {
          handleSelectComplete()
        }}>선택 완료</button>
      </div>
      <DialogModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onClearSelect={onClearSelect}
        writeDataOnDB={writeDataOnDB}
      />
    </>
  )
}

export default MainSelector