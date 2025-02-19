//라이브러리
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
//컴포넌트
import ModalBtn from '../Btn/ModalBtn';

//2024.12.19 코드 정리 -> 250212 디자인 수정
const SelectedDialogModal = (props) => {
  const studentSelectedList = useSelector(({ studentSelected }) => { return studentSelected });
  const actiSelectedList = useSelector(({ activitySelected }) => { return activitySelected });
  const [studentList, setStudentList] = useState(null);
  const [actiList, setActiList] = useState(null);

  useEffect(() => { //대화창에 선택한 학번과 활동 이름 띄운다.
    const selectedActList = [];
    const selectedStudentList = [];

    studentSelectedList.map(({ label }) => {
      return selectedStudentList.push(` ${label}`)
    })
    actiSelectedList.map(({ label }) => {
      return selectedActList.push(` ${label}`)
    })
    setStudentList(selectedStudentList)
    setActiList(selectedActList)
    //위 코드 실행 하기 전에 실행, unMount시 실행, 첫 마운트에선 실행X unMount 될 때 실행
    return () => {
      setStudentList(null)
      setActiList(null)
    }
  }, [studentSelectedList, actiSelectedList])

  //------함수부------------------------------------------------  
  //확인
  const handleConfirmOnClick = () => {
    props.onHide();
    props.writeAccDataOnDB().then(window.alert("입력 되었습니다."));
    props.onClearSelect();
  }

  const handleCancelOnClick = () => {
    props.onHide();
    props.onClearSelect();
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
    >
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>학생 생기부 입력 확인</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#efefef" }}>
        {(!(studentSelectedList.length === 0) && !(actiSelectedList.length === 0))
          ? `${studentList}학생에게 ${actiList}활동을 입력하시겠습니까?`
          : '학생이나 활동이 선택되지 않았습니다.'}
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
export default SelectedDialogModal;