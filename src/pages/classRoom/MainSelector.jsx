//라이브러리
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components"
//컴포넌트
import MidBtn from '../../components/Btn/MidBtn.jsx';
import MainBtn from '../../components/Btn/MainBtn.jsx'
import MultiSelector from '../../components/MultiSelector.jsx';
import SelectedDialogModal from '../../components/Modal/SelectedDialogModal.jsx';
//hooks
import useAcc from '../../hooks/useAcc.jsx';
import useGetByte from '../../hooks/useGetByte.jsx';

const MainSelector = ({ isMobile, type, studentList, actiList, classId, setIsPerfModalShow }) => {
  const navigate = useNavigate();
  const activitySelected = useSelector(({ activitySelected }) => { return activitySelected });
  useEffect(() => {
    const acc = activitySelected.reduce((acc, cur) => { return acc.concat(' ' + cur.record) }, '')
    const byte = getByteLengthOfString(acc)
    setByte(byte)
    setAccRecords(acc)
  }, [activitySelected]);
  const [isAllStudentChecked, setIsAllStudentChecked] = useState(false); //모든학생 선택 유무
  const [isAllActiChecked, setIsAllActiChecked] = useState(false);       //모든활동 선택 유무
  //주요 정보
  const [_accRecord, setAccRecords] = useState();
  const [_byte, setByte] = useState(0);
  const { writeAccDataOnDB, writeHomeAccOnDB } = useAcc();
  const { getByteLengthOfString } = useGetByte();
  //MultiSelector 내부 변수
  const selectStudentRef = useRef(null);  //학생 선택 셀렉터 객체, 재랜더링 X 
  const selectActRef = useRef(null);      //활동 선택 셀렉터 객체, 재랜더링 X
  const studentCheckBoxRef = useRef(null);//모든 학생 체크박스, 재랜더링 X
  const actCheckBoxRef = useRef(null);    //모든 활동 체크박스, 재랜더링 X
  //모달창
  const [isCompleteModalShow, setIsCompleteModalShow] = useState(false)

  //------함수부------------------------------------------------  
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
      setIsAllActiChecked(false)
    }
  }

  //type에 따른 prop 전달 함수
  const functionMap = {
    subject: () => writeAccDataOnDB(classId),
    self: () => writeHomeAccOnDB(classId, "self"),
    career: () => writeHomeAccOnDB(classId, "career"),
  };
  //전달 함수 선택
  const handleFunction = functionMap[type] || (window.alert("functionMap에 type 지정 바람"));

  return (
    <>
      {/* 학생 셀렉터, 활동 셀렉터 */}
      <Container>
        <SelectorWrapper>
          <MultiSelector
            studentList={studentList}
            selectStudentRef={selectStudentRef}
            studentCheckBoxRef={studentCheckBoxRef}
            isAllStudentChecked={isAllStudentChecked}
            isAllActivitySelected={isAllActiChecked}
            setIsAllStudentChecked={setIsAllStudentChecked}
            setIsAllActivitySelected={setIsAllActiChecked}
          />
        </SelectorWrapper>
        {(actiList && actiList.length !== 0) && <SelectorWrapper>
          <MultiSelector
            activitiyList={actiList}
            selectActRef={selectActRef}
            actCheckBoxRef={actCheckBoxRef}
            isAllStudentChecked={isAllStudentChecked}
            isAllActivitySelected={isAllActiChecked}
            setIsAllStudentChecked={setIsAllStudentChecked}
            setIsAllActivitySelected={setIsAllActiChecked}
          />
        </SelectorWrapper>}
        {(!actiList || actiList.length === 0) &&
          <SelectorWrapper>활동이 없습니다. PC 버젼에서 활동을 추가해주세요.
            <Row style={{ justifyContent: "center", marginTop: "10px" }}>{!isMobile && <MidBtn onClick={() => { navigate("/activities_setting") }}>활동 추가</MidBtn>}</Row>
          </SelectorWrapper>}
        <AccWrapper>
          <AccTextArea type="text" value={_accRecord} disabled={true} />
          <ByteWrapper>
            <input type="text" disabled={true} value={_byte} />
            <p style={{ display: "inline" }}> /1500 Byte</p>
          </ByteWrapper>
        </AccWrapper>
        <BtnWrapper>
          <MainBtn onClick={() => { setIsCompleteModalShow(true) }}>선택 완료</MainBtn>
          {(setIsPerfModalShow && !isMobile) && <MainBtn onClick={() => { setIsPerfModalShow(true) }}>수행 평가 관리</MainBtn>}
          {!isMobile && <MainBtn onClick={() => { navigate('allStudents') }} >반 전체 세특 보기</MainBtn>}
        </BtnWrapper>
      </Container>
      {/* 선택 완료 모달 */}
      <SelectedDialogModal
        show={isCompleteModalShow}
        onHide={() => setIsCompleteModalShow(false)}
        onClearSelect={onClearSelect}
        writeAccDataOnDB={handleFunction}
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
  @media (max-width: 767px){
    width: 100%;
    margin: 0;
  }
`
const Row = styled.div`
  display: flex;
`
const BtnWrapper = styled.div`
  display: flex;
  margin: 20px auto;
  gap: 40px;
`
const SelectorWrapper = styled.div`
  width: 50%;
  margin: 0 auto;
  margin-top: 35px;
  @media(max-width: 768px){
    width: 80%;
    margin-top: 35px;
  }
`
const AccWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: 10px auto;
  width: 70%;
`
const ByteWrapper = styled.div`
  margin-right: 10%;
  input {
    height: 35px;
    width: 85px;
    border-radius: 7px;
  }
`
const AccTextArea = styled.textarea`
  width: 80%;
  height: 100px;
  margin: 10px auto;
  border-radius: 7px;
  @media(max-width: 768px) {
    width: 100%;
  }
`
export default MainSelector