//컴포넌트
import MultiSelector from '../../components/MultiSelector';
import DialogModal from '../../components/StaticDialogModal.jsx';

//변수관리
import { useSelector } from 'react-redux';
import { useRef, useState } from 'react';

//파이어베이스
import { appFireStore } from '../../firebase/config.js'
import { doc, getDoc, setDoc } from 'firebase/firestore';

//CSS styles
import styled from "styled-components"
import styles from "./MainSelector.module.css"

//스타일
const StyledButtonSection = styled.div`
  position: relative;
  bottom: 40px;
  width: 80%;
  height: 20%;
  margin: 0 auto;
`
const StyledButton = styled.button`
  position: relative;
  margin: 0 auto;
  width: 15em;
  height: 3em;
  background-color: #6495ed;
  border: none;
  border-radius: 5px;
  color: black;
  padding: 0.25em 1em;
`
const MainSelector = ({ studentList, activitiyList, classId }) => {
  //redux 전역변수
  const studentSelected = useSelector(({ studentSelected }) => { return studentSelected })
  const activitySelected = useSelector(({ activitySelected }) => { return activitySelected })

  //지역 변수
  const [modalShow, setModalShow] = useState(false) //대화창 보여주기 변수
  const selectStudentRef = useRef(null); //학생 선택 변수, 재랜더링 X
  const selectActRef = useRef(null); //활동 선택 변수, 재랜더링 X

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

  //선택 완료 버튼 클릭
  const handleSelectComplete = async () => {
    console.log('선택 학생List', studentSelected)
    console.log('선택 활동List', activitySelected)
    setModalShow(true) //대화창 pop
  }
    
  return (
    <>
      {/* 학생 셀렉터, 활동 셀렉터 */}
      <div className={styles.wrapper}>
        <div className={styles.selector_container}>
          <div className={styles.selector}>
            <MultiSelector studentList={studentList} selectStudentRef={selectStudentRef} />
          </div>
          <div className={styles.selector}>
            <MultiSelector activitiyList={activitiyList} selectActRef={selectActRef} />
          </div>
        </div>
        <StyledButtonSection>
          <StyledButton onClick={() => {
            handleSelectComplete()
          }}>선택 완료</StyledButton>
        </StyledButtonSection>
      </div>
      {/* 리엑트 부트스트랩 */}
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