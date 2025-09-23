//라이브러리
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components"
//컴포넌트
import MidBtn from '../../components/Btn/MidBtn.jsx';
import MainBtn from '../../components/Btn/MainBtn.jsx'
import SelectedDialogModal from '../../components/Modal/SelectedDialogModal.jsx';
//hooks
import useAcc from '../../hooks/useAcc.jsx';
import useGetByte from '../../hooks/useGetByte.jsx';
import Select from 'react-select';
import { setSelectStudent } from '../../store/studentSelectedSlice.jsx';
import { setSelectActivity } from '../../store/activitySelectedSlice.jsx';
import PerfModal from '../../components/Modal/PerfModal.jsx';
//수정(250903)
const MainSelectorSection = ({ isMobile, studentList, actiList, classId }) => {
  const dispatcher = useDispatch();
  const navigate = useNavigate();
  useEffect(() => { bindOptions() }, [studentList, actiList]);
  const activitySelected = useSelector(({ activitySelected }) => activitySelected);
  useEffect(() => { processSelectActi() }, [activitySelected]);
  //셀렉터 옵션
  const [studentOptionList, setStudentOptionList] = useState([]);
  const [actiOptionList, setActiOptionList] = useState([]);
  const [isAllStudentChecked, setIsAllStudentChecked] = useState(false); //모든학생 선택 유무
  const [isAllActiChecked, setIsAllActiChecked] = useState(false);       //모든활동 선택 유무
  const [isDeleteChecked, setIsDeleteChecked] = useState(false);
  //주요 정보
  const [_accRecord, setAccRecords] = useState();
  const [_byte, setByte] = useState(0);
  const { writeAccDataOnDB, delActiDataOnDB } = useAcc();
  const { getByteLengthOfString } = useGetByte();
  //MultiSelector 내부 변수
  const selectStudentRef = useRef(null);   //학생 선택 셀렉터 객체, 재랜더링 X 
  const selectActRef = useRef(null);       //활동 선택 셀렉터 객체, 재랜더링 X
  const studentCheckBoxRef = useRef(null); //모든 학생 체크박스, 재랜더링 X
  const actiCheckBoxRef = useRef(null);    //모든 활동 체크박스, 재랜더링 X
  //모달창
  const [isCompleteModalShow, setIsCompleteModalShow] = useState(false);
  const [isPerfModal, setIsPerfModal] = useState(false);                //활동별 보기

  //------함수부------------------------------------------------
  //학생 옵션
  const bindOptions = () => {
    if (!studentList || !actiList) return;
    const students = studentList.map((student) => {
      const name = student.writtenName || '미등록';
      const number = student.studentNumber;
      return ({ label: `${number} ${name}`, value: student.id })
    });
    const actis = actiList.map((acti) => ({ value: acti.id, label: acti.title, uid: acti.uid, record: acti.record, content: acti.content }));
    setStudentOptionList(students);
    setActiOptionList(actis);
  }
  //활동 선택 처리 
  const processSelectActi = () => {
    if (activitySelected.length === 0) return;
    const acc = activitySelected.reduce((acc, cur) => { return acc.concat(' ' + cur.record) }, '');
    const byte = getByteLengthOfString(acc);
    setByte(byte);
    setAccRecords(acc);
  }
  //학생 선택
  const handleStudentSelection = (event) => { dispatcher(setSelectStudent(event)); }
  //활동 선택
  const handleActivitySelection = (event) => { dispatcher(setSelectActivity(event)); }
  //학생 체크박스
  const handleAllStudentCheckOnChange = (event) => {
    const studentChecked = event.target.checked;
    selectStudentRef.current.clearValue();  //표면적 선택 초기화
    if (studentChecked) {
      dispatcher(setSelectStudent(studentOptionList));
      setIsAllStudentChecked(true);
    } else {
      dispatcher(setSelectStudent([]));
      setIsAllStudentChecked(false);
    }
  }
  //활동 체크박스
  const handleAllActiCheckOnChange = (event) => {
    let activityChecked = event.target.checked;
    selectActRef.current.clearValue();
    if (activityChecked) {
      dispatcher(setSelectActivity(actiOptionList));
      setIsAllActiChecked(true);
    } else {
      dispatcher(setSelectActivity([]));
      setIsAllActiChecked(false);
    }
  }
  //셀렉터에서 선택된 값 해제하기
  const onClearSelect = () => {
    if (selectStudentRef.current) {
      selectStudentRef.current.clearValue();
      studentCheckBoxRef.current.checked = false;
      setIsAllStudentChecked(false);
    }
    if (selectActRef.current) {
      selectActRef.current.clearValue();
      actiCheckBoxRef.current.checked = false;
      setIsAllActiChecked(false);
    }
  }
  return (
    <>
      <Container>
        <SelectWrapper>
          <Select isMulti ref={selectStudentRef}
            onChange={(event) => { handleStudentSelection(event) }}
            options={studentOptionList}
            placeholder={`${isAllStudentChecked ? "모든 학생이 선택됨" : "학생을 선택하세요"}`}
            isDisabled={isAllStudentChecked} />
          <Row style={{ gap: "2px" }}>
            <input type="checkbox" id="all_student_check" ref={studentCheckBoxRef} onChange={(event) => { handleAllStudentCheckOnChange(event); }} />
            <label htmlFor="all_student_check">모든 학생</label>
          </Row>
        </SelectWrapper>
        {(actiList && actiList.length !== 0) && <SelectWrapper>
          <Select isMulti ref={selectActRef}
            onChange={(event) => { handleActivitySelection(event) }}
            options={actiOptionList}
            placeholder={`${isAllActiChecked ? "모든 활동이 선택됨" : "활동을 선택하세요"}`}
            isDisabled={isAllActiChecked}
          />
          <Row style={{ gap: "10px" }}>
            <Row style={{ gap: "2px" }}>
              <input type="checkbox" id="all_acti_check" ref={actiCheckBoxRef} onChange={(event) => { handleAllActiCheckOnChange(event); }} />
              <label htmlFor="all_acti_check">모든 활동</label>
            </Row>
            <Row style={{ gap: "2px" }}>
              <input type="checkbox" id="delete_check" onChange={() => setIsDeleteChecked(!isDeleteChecked)} />
              <label htmlFor="delete_check"> 삭제</label>
            </Row>
          </Row>
        </SelectWrapper>}
        {(!actiList || actiList.length === 0) &&
          <SelectWrapper>활동이 없습니다. PC 버젼에서 활동을 추가해주세요.
            <Row style={{ justifyContent: "center", marginTop: "10px" }}>{!isMobile && <MidBtn onClick={() => { navigate("/activities_setting") }}>활동 추가</MidBtn>}</Row>
          </SelectWrapper>}
        <AccWrapper>
          <AccTextArea type="text" value={_accRecord} disabled={true} />
          <ByteWrapper>
            <input type="text" disabled={true} value={_byte} />
            <p style={{ display: "inline" }}> /1500 Byte</p>
          </ByteWrapper>
        </AccWrapper>
        <BtnWrapper>
          <MainBtn onClick={() => { setIsCompleteModalShow(true) }} styles={{ zIndex: "null" }}>선택 완료</MainBtn>
          {!isMobile && <MainBtn onClick={() => { setIsPerfModal(true) }} styles={{ zIndex: "null" }}>활동별 보기</MainBtn>}
          {!isMobile && <MainBtn onClick={() => { navigate('allStudents') }} styles={{ zIndex: "null" }}>전체 세특 보기</MainBtn>}
        </BtnWrapper>
      </Container >
      {/* 선택 완료 모달 */}
      <SelectedDialogModal
        show={isCompleteModalShow}
        onHide={() => setIsCompleteModalShow(false)}
        onClearSelect={onClearSelect}
        writeAccDataOnDB={() => writeAccDataOnDB(classId)}
        delActiDataOnDB={delActiDataOnDB}
        isDeleteChecked={isDeleteChecked}
        klassId={classId}
      />
      {/* 활동별 보기 */}
      <PerfModal
        show={isPerfModal}
        onHide={() => setIsPerfModal(false)}
        actiList={actiList}
        studentList={studentList}
        classId={classId}
      />
    </>
  )
}
const Row = styled.div`
  display: flex;
`
const Container = styled(Row)`
  width: 80%;
  flex-direction: column;
  min-height: 350px;
  margin: 0 auto;
  padding: 5px;
  @media (max-width: 767px){
    width: 100%;
    margin: 0;
  }
`
const SelectWrapper = styled.div`
  width: 50%;
  margin: 0 auto;
  margin-top: 35px;
  @media(max-width: 768px){
    width: 80%;
    margin-top: 35px;
  }
`
const AccWrapper = styled(Row)`
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
const BtnWrapper = styled(Row)`
  margin: 20px auto;
  gap: 40px;
`
const AccTextArea = styled.textarea`
  width: 80%;
  height: 100px;
  margin: 10px auto;
  border-radius: 7px;
  @media(max-width: 768px) { width: 100%; }
`
export default MainSelectorSection