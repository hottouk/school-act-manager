//컴포넌트
import MultiSelector from '../../components/MultiSelector';
import SelectedDialogModal from '../../components/Modal/SelectedDialogModal.jsx';
//변수관리
import { useSelector } from 'react-redux';
import { useRef, useState } from 'react';
//파이어베이스
import { appFireStore } from '../../firebase/config.js'
import { doc, getDoc, setDoc } from 'firebase/firestore';
//CSS styles
import styled from "styled-components"
import { useNavigate } from 'react-router-dom';

const MainSelector = ({ studentList, activitiyList, classId }) => {
  //1. 변수
  //redux 전역변수
  const studentSelectedList = useSelector(({ studentSelected }) => { return studentSelected })
  const activitySelectedList = useSelector(({ activitySelected }) => { return activitySelected })
  //MultiSelector 내부 변수
  const selectStudentRef = useRef(null); //학생 선택 셀렉터 객체, 재랜더링 X 
  const selectActRef = useRef(null); //활동 선택 셀렉터 객체, 재랜더링 X
  const studentCheckBoxRef = useRef(null); //모든 학생 체크박스, 재랜더링 X
  const actCheckBoxRef = useRef(null); //모든 활동 체크박스, 재랜더링 X
  //UseState
  const [isAllStudentChecked, setIsAllStudentChecked] = useState(false) //모든학생 선택 유무
  const [isAllActivityChecked, setIsAllActivityChecked] = useState(false) //모든활동 선택 유무
  const [modalShow, setModalShow] = useState(false) //대화창 보여주기 변수
  //라이브러리
  const navigate = useNavigate();

  //2. 함수
  //★★★ 핵심 로직 ★★★ 
  const writeDataOnDB = async () => {
    studentSelectedList.map(({ value }) => { //선택된 모든 학생에게서 아래 작업 반복 
      let studentId = value //id 참조
      const studentRef = doc(appFireStore, "classRooms", classId, "students", studentId); //id로 학생 data 위치 참조
      getDoc(studentRef).then((student) => {                                                 //참조한 학생 data 반환 Promise
        try {
          let curAccActList = student.data().actList  //선택 학생 한명의 기존 누가 '활동' 반환
          let accRecord = student.data().accRecord    //선택 학생 한명의 기존 누가 '기록' 반환
          makeAccWithSelectedActs().then(({ newActList, selectedAccRecord }) => { //선택한 활동의 누가 배열, 누가 기록 반환
            if ((!curAccActList && !accRecord) || curAccActList.length === 0) { //기록 활동 x 누가 기록 x -> 완전한 첫 작성
              setDoc(studentRef, {
                actList: newActList,         //누가'활동'에 선택 활동 반영
                accRecord: selectedAccRecord //누가'기록'에 선택 활동 반영
              }, { merge: true })
            } else if (!curAccActList && accRecord) { //기록 활동 x 교사 임의 입력 누가 기록 o
              setDoc(studentRef, {
                actList: newActList,                            //새로운 활동 추가
                accRecord: accRecord.concat(selectedAccRecord)  //기존 기록 + 새로운 기록
              }, { merge: true })
            } else if (curAccActList && accRecord) { //기존 활동 o, 누가 기록 o
              let newList = [...curAccActList, ...newActList];             //기존 누가 활동과 새로운 입력할 활동을 섞는다.
              let uniqueList = newList.reduce((acc, current) => {          //id로 비교하여 중복이 아닌 경우만 acc에 추가
                if (acc.findIndex(({ id }) => id === current.id) === -1) { //배열에서 조건을 충족하는 index를 반환, 없을 경우 -1 반환; 요소가 obj일경우 destructure 가능
                  acc.push(current);
                }
                return acc;
              }, [])
              setDoc(studentRef, {
                actList: uniqueList,                            //기존 활동 + 새로운 활동
                accRecord: accRecord.concat(selectedAccRecord)  //기존 기록 + 새로운 기록
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

  //★★★ 활동기록 누가 함수: 선택 활동과 선택 기록을 누적하여 반환한다.
  const makeAccWithSelectedActs = async () => {
    let newActList = []
    let selectedAccRecord = ''
    await Promise.all( //Promise.All을 사용하면 모든 Promise가 반환될 때까지 기다린다. 캐시에서 해도 될듯한 작업임.
      activitySelectedList.map(async ({ value }) => { //선택된 모든 활동에서 아래 작업 반복
        let activityId = value //id 참조
        const activityRef = doc(appFireStore, "activities", activityId); //id로 활동 data 위치 참조
        const activitySnap = getDoc(activityRef);
        await activitySnap.then((activity) => {
          selectedAccRecord = selectedAccRecord.concat(" ", activity.data().record)
          newActList.push({ id: activity.id, ...activity.data() });
        })
        return null
      }))
    return { newActList, selectedAccRecord }
  }

  //셀렉터에서 선택된 값 해제하기
  const onClearSelect = () => {
    if (selectStudentRef.current) {
      selectStudentRef.current.clearValue();
      studentCheckBoxRef.current.checked = false;
      setIsAllStudentChecked(false)
    }
    if (selectActRef.current) {
      selectActRef.current.clearValue();
      actCheckBoxRef.current.checked = false;
      setIsAllActivityChecked(false)
    }
  }

  //선택 완료 버튼 클릭
  const handleSelectComplete = async () => {
    setModalShow(true) //대화창 pop
  }

  return (
    <>
      {/* 학생 셀렉터, 활동 셀렉터 */}
      <StyledContainer>
        <StyledTitle>1단계 - 빠른 세특 입력기</StyledTitle>
        <StyledSelectorDiv>
          <StyledSelector>
            <MultiSelector
              studentList={studentList}
              selectStudentRef={selectStudentRef}
              studentCheckBoxRef={studentCheckBoxRef}
              isAllStudentChecked={isAllStudentChecked}
              isAllActivitySelected={isAllActivityChecked}
              setIsAllStudentChecked={setIsAllStudentChecked}
              setIsAllActivitySelected={setIsAllActivityChecked} />
          </StyledSelector>
          {(activitiyList && activitiyList.length !== 0) && <StyledSelector>
            <MultiSelector
              activitiyList={activitiyList}
              selectActRef={selectActRef}
              actCheckBoxRef={actCheckBoxRef}
              isAllStudentChecked={isAllStudentChecked}
              isAllActivitySelected={isAllActivityChecked}
              setIsAllStudentChecked={setIsAllStudentChecked}
              setIsAllActivitySelected={setIsAllActivityChecked} />
          </StyledSelector>}
          {(!activitiyList || activitiyList.length === 0) &&
            <StyledSelector>활동이 없습니다. 활동을 추가해주세요.
              <button onClick={() => { navigate('/activities_setting') }}>활동 추가</button>
            </StyledSelector>}
        </StyledSelectorDiv>
        <StyledBtnDiv>
          <StyledBtn onClick={() => {
            handleSelectComplete()
          }}>선택 완료</StyledBtn>
        </StyledBtnDiv>
      </StyledContainer>
      {/* 리엑트 부트스트랩 */}
      <SelectedDialogModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onClearSelect={onClearSelect}
        writeDataOnDB={writeDataOnDB}
      />
    </>
  )
}
const StyledContainer = styled.div`
  width: 100%;
  min-height: 350px;
  padding: 5px;
`
const StyledTitle = styled.h4`
  display: flex;
  justify-content: center;
  margin: 10px auto;
`
const StyledSelectorDiv = styled.div`
  width: 80%;
  height: 300px;
  margin: 0 auto;
  padding : 10px;
  @media screen and (max-width: 767px){
    width: 100%;
    margin: 0;
  }
`
const StyledSelector = styled.div`
  width: 50%;
  margin: 0 auto;
  margin-top: 35px;
  button {
    display: block;
    margin: 10px auto;
    width: 90px;
    height: 30px;
    background-color: #3454d1;
    border: none;
    border-radius: 5px;
    color: white;
  }
  @media screen and (max-width: 767px){
    width: 80%;
    margin-top: 35px;
  }
`
const StyledBtnDiv = styled.div`
  position: relative;
  bottom: 40px;
  width: 80%;
  height: 20%;
  margin: 0 auto;
`
const StyledBtn = styled.button`
  display: block;
  margin: 0 auto;
  width: 240px;
  height: 50px;
  background-color: #3454d1;
  border: none;
  border-radius: 5px;
  color: white;
  padding: 0.25em 1em;
`
export default MainSelector