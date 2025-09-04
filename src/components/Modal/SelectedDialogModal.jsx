//라이브러리
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
//컴포넌트
import ModalBtn from '../Btn/ModalBtn';
//코드 정리(241219) -> 디자인 수정(250212)
const SelectedDialogModal = ({ show, onHide, onClearSelect, writeAccDataOnDB, isDeleteChecked, delActiDataOnDB, klassId }) => {
  const studentSelectedList = useSelector(({ studentSelected }) => { return studentSelected });
  const actiSelectedList = useSelector(({ activitySelected }) => { return activitySelected });
  const [studentList, setStudentList] = useState(null);
  const [actiList, setActiList] = useState(null);
  useEffect(() => {
    //대화창에 선택한 학번과 활동 이름 띄운다. 
    setStudentList(studentSelectedList?.map(({ label }) => label));
    setActiList(actiSelectedList?.map(({ label }) => label));
    //위 코드 실행 하기 전에 실행, unMount시 실행, 첫 마운트에선 실행X unMount 될 때 실행
    return () => {
      setStudentList(null);
      setActiList(null);
    }
  }, [studentSelectedList, actiSelectedList])
  //------함수부------------------------------------------------  
  //확인
  const handleConfirmOnClick = () => {
    if (!isDeleteChecked) writeAccDataOnDB().then(alert("입력 되었습니다."));
    else delActiDataOnDB(klassId).then(alert("삭제 되었습니다."));
    onHide();
    onClearSelect();
  }
  //취소
  const handleCancelOnClick = () => {
    onHide();
    onClearSelect();
  }
  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
    >
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>학생 생기부 입력 확인</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#efefef" }}>
        {(studentSelectedList.length === 0 || actiSelectedList.length === 0) && "학생과 활동을 모두 선택해주세요"}
        {(studentSelectedList.length !== 0 && actiSelectedList.length !== 0) && (
          isDeleteChecked
            ? <span>{studentList}학생에게서 {actiList}활동을 일괄&nbsp;<Highlight>삭제</Highlight>하시겠습니까?</span>
            : <span>{studentList}학생에게 {actiList}활동을 입력하시겠습니까?</span>
        )}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#efefef" }}>
        {(!(studentSelectedList.length === 0) && !(actiSelectedList.length === 0))
          ? <BtnWrapper>
            <ModalBtn onClick={handleCancelOnClick}>취소</ModalBtn>
            <ModalBtn styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} onClick={handleConfirmOnClick}>확인</ModalBtn>
          </BtnWrapper>
          : <ModalBtn onClick={handleCancelOnClick}>확인</ModalBtn>
        }
      </Modal.Footer>
    </Modal>
  );
}
const BtnWrapper = styled.div`
  display: flex;
  gap: 10px;
`
const Highlight = styled.span`
  font-weight: bold;
  color: red;
`
export default SelectedDialogModal;