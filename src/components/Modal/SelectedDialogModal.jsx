import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';

const SelectedDialogModal = (props) => {
  //redux 전역변수
  const studentSelected = useSelector(({ studentSelected }) => { return studentSelected })
  const activitySelected = useSelector(({ activitySelected }) => { return activitySelected })

  //지역 변수
  const [studentList, setStudentList] = useState(null)
  const [actList, setActList] = useState(null)

  useEffect(() => { //대화창에 선택한 학번과 활동 이름 띄운다.
    const selectedActList = []
    const selectedStudentList = []

    studentSelected.map(({ label }) => {
      return selectedStudentList.push(` ${label}`)
    })
    activitySelected.map(({ label }) => {
      return selectedActList.push(` ${label}`)
    })
    setStudentList(selectedStudentList)
    setActList(selectedActList)
    //위 코드 실행 하기 전에 실행, unMount시 실행, 첫 마운트에선 실행X unMount 될 때 실행
    return () => {
      setStudentList(null)
      setActList(null)
    }
  }, [studentSelected, activitySelected])

  const handleConfirm = () => {
    props.onHide()
    props.writeAccDataOnDB().then(
      window.alert("입력 되었습니다.")
    )
    props.onClearSelect()
  }

  const handleCancel = () => {
    props.onHide()
    props.onClearSelect()
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>학생 생기부 입력 확인</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {(!(studentSelected.length === 0) && !(activitySelected.length === 0))
          ? `${studentList}학생에게 ${actList}활동을 입력하시겠습니까?`
          : '학생이나 활동이 선택되지 않았습니다.'}
      </Modal.Body>
      <Modal.Footer>
        {(!(studentSelected.length === 0) && !(activitySelected.length === 0))
          ? <div>
            <Button variant="secondary" onClick={handleCancel}>취소</Button>
            <Button variant="primary" onClick={handleConfirm}>확인</Button>
          </div>
          : <Button variant="secondary" onClick={handleCancel}>확인</Button>}
      </Modal.Footer>
    </Modal>
  );
}

export default SelectedDialogModal;