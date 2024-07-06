//컴포넌트
import MultiSelector from '../../components/MultiSelector';
import SelectedDialogModal from '../../components/Modal/SelectedDialogModal.jsx';
//변수관리
import { useRef, useState } from 'react';
//CSS styles
import styled from "styled-components"
import { useNavigate } from 'react-router-dom';
//hooks
import useAcc from '../../hooks/useAcc.jsx';
import MainBtn from '../../components/Btn/MainBtn.jsx'

const MainSelector = ({ studentList, activitiyList, classId }) => {
  //1. 변수
  //MultiSelector 내부 변수
  const selectStudentRef = useRef(null); //학생 선택 셀렉터 객체, 재랜더링 X 
  const selectActRef = useRef(null); //활동 선택 셀렉터 객체, 재랜더링 X
  const studentCheckBoxRef = useRef(null); //모든 학생 체크박스, 재랜더링 X
  const actCheckBoxRef = useRef(null); //모든 활동 체크박스, 재랜더링 X
  //UseState
  const [isAllStudentChecked, setIsAllStudentChecked] = useState(false) //모든학생 선택 유무
  const [isAllActivityChecked, setIsAllActivityChecked] = useState(false) //모든활동 선택 유무
  const [modalShow, setModalShow] = useState(false) //대화창 보여주기 변수
  //핵심로직
  const { writeAccDataOnDB } = useAcc()
  //라이브러리
  const navigate = useNavigate();

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
        <StyledTitle>빠른 세특 쫑알이</StyledTitle>
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
          <MainBtn btnOnClick={() => { handleSelectComplete() }} btnName="선택 완료" />
        </StyledSelectorDiv>
      </StyledContainer>
      {/* 리엑트 부트스트랩 */}
      <SelectedDialogModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onClearSelect={onClearSelect}
        writeAccDataOnDB={() => writeAccDataOnDB(classId)}
      />
    </>
  )
}
const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 350px;
  padding: 5px;
`
const StyledTitle = styled.h4`
  display: flex;
  justify-content: center;
  margin: 10px auto;
`
const StyledSelectorDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
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