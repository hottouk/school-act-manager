//라이브러리
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
//컴포넌트
import MidBtn from '../../components/Btn/MidBtn.jsx';
import MainBtn from '../../components/Btn/MainBtn.jsx'
import MultiSelector from '../../components/MultiSelector';
import SelectedDialogModal from '../../components/Modal/SelectedDialogModal.jsx';
//hooks
import useAcc from '../../hooks/useAcc.jsx';
import useGetByte from '../../hooks/useGetByte.jsx';
import { useNavigate } from 'react-router-dom';
//css
import styled from "styled-components"

const MainSelector = ({ studentList, actiList, classId, setIsPerfModalShow }) => {
  //1. 변수
  //MultiSelector 내부 변수
  const selectStudentRef = useRef(null); //학생 선택 셀렉터 객체, 재랜더링 X 
  const selectActRef = useRef(null); //활동 선택 셀렉터 객체, 재랜더링 X
  const studentCheckBoxRef = useRef(null); //모든 학생 체크박스, 재랜더링 X
  const actCheckBoxRef = useRef(null); //모든 활동 체크박스, 재랜더링 X
  //전역 변수
  const activitySelected = useSelector(({ activitySelected }) => { return activitySelected })
  useEffect(() => {
    let acc = activitySelected.reduce((acc, cur) => { return acc.concat(' ' + cur.record) }, '')
    let byte = getByteLengthOfString(acc)
    setByte(byte)
    setAccRecords(acc)
  }, [activitySelected])
  //UseState
  const [isAllStudentChecked, setIsAllStudentChecked] = useState(false) //모든학생 선택 유무
  const [isAllActivityChecked, setIsAllActivityChecked] = useState(false) //모든활동 선택 유무
  //모달창
  const [isCompleteModalShow, setIsCompleteModalShow] = useState(false)
  //주요 정보
  const [_accRecord, setAccRecords] = useState();
  const [_byte, setByte] = useState(0)
  //1-2 핵심로직
  const { writeAccDataOnDB } = useAcc()
  const { getByteLengthOfString } = useGetByte()
  //1-3. 라이브러리
  const navigate = useNavigate();

  //----2.함수부--------------------------------
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

  return (
    <>
      {/* 학생 셀렉터, 활동 셀렉터 */}
      <Container>
        <StyledSelector>
          <MultiSelector
            studentList={studentList}
            selectStudentRef={selectStudentRef}
            studentCheckBoxRef={studentCheckBoxRef}
            isAllStudentChecked={isAllStudentChecked}
            isAllActivitySelected={isAllActivityChecked}
            setIsAllStudentChecked={setIsAllStudentChecked}
            setIsAllActivitySelected={setIsAllActivityChecked}
          />
        </StyledSelector>
        {(actiList && actiList.length !== 0) && <StyledSelector>
          <MultiSelector
            activitiyList={actiList}
            selectActRef={selectActRef}
            actCheckBoxRef={actCheckBoxRef}
            isAllStudentChecked={isAllStudentChecked}
            isAllActivitySelected={isAllActivityChecked}
            setIsAllStudentChecked={setIsAllStudentChecked}
            setIsAllActivitySelected={setIsAllActivityChecked}
          />
        </StyledSelector>}
        {(!actiList || actiList.length === 0) &&
          <StyledSelector>활동이 없습니다. 활동을 추가해주세요.
            <MidBtn btnName="활동 추가" btnOnClick={() => { navigate('/activities_setting') }} />
          </StyledSelector>}
        <StyledAccContainer>
          <textarea type="text" value={_accRecord} disabled={true} />
          <div className="byt_con">
            <input type="text" disabled={true} value={_byte} />
            <p style={{ display: "inline" }}> /1500 Byte</p>
          </div>
        </StyledAccContainer>
        <BtnWrapper>
          <MainBtn btnOnClick={() => { setIsCompleteModalShow(true) }} btnName="선택 완료" />
          <MainBtn btnOnClick={() => { setIsPerfModalShow(true) }} btnName="수행 평가 관리" />
        </BtnWrapper>
      </Container>
      {/* 선택 완료 모달 */}
      <SelectedDialogModal
        show={isCompleteModalShow}
        onHide={() => setIsCompleteModalShow(false)}
        onClearSelect={onClearSelect}
        writeAccDataOnDB={() => writeAccDataOnDB(classId)}
      />
    </>
  )
}
const Container = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  min-height: 350px;
  margin: 0 auto;
  padding: 5px;
  @media screen and (max-width: 767px){
    width: 100%;
    margin: 0;
  }
`
const BtnWrapper = styled.div`
  display: flex;
  margin: 20px auto;
  gap: 40px;
`
const StyledSelector = styled.div`
  width: 50%;
  margin: 0 auto;
  margin-top: 35px;
  @media screen and (max-width: 767px){
    width: 80%;
    margin-top: 35px;
  }
`
const StyledAccContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: 10px auto;
  width: 70%;
  textarea {
    width: 80%;
    height: 100px;
    margin: 10px auto;
    border-radius: 7px;
  }
  input {
    height: 35px;
    width: 85px;
    border-radius: 7px;
  }
  .byt_con {
    margin-right: 10%;
  }
`
export default MainSelector