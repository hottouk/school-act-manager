//라이브러리
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
//컴포넌트
import ModalBtn from '../Btn/ModalBtn';
//hooks
import useFetchStorageImg from '../../hooks/Game/useFetchStorageImg';
import useFireUserData from '../../hooks/Firebase/useFireUserData';
//데이터
import { initPetPathList, initPetList } from "../../data/monsterList"
//학생 클래스 가입 모달 수정(250123) => 펫선택(250828)
const ApplyClassModal = ({ show, onHide, klass, myUserData: user }) => {
  //준비
  const allStudents = useSelector(({ allStudents }) => { return allStudents })
  const { applyKlassTransaction } = useFireUserData();
  klass = klass || { grade: "1", subjDetail: "과목", classTitle: "샘플" }
  const { grade, subjDetail, classTitle } = klass
  const { fetchImgUrlList } = useFetchStorageImg();
  useEffect(() => { fetchImgUrlList(initPetPathList, setInitPetUrlList) }, []);
  const [initPetUrlList, setInitPetUrlList] = useState([]);
  //단계
  const [step, setStep] = useState(1);
  //선택
  const [_selected, setSelected] = useState(null);
  const [_selectedIndex, setSelectedIndex] = useState(null);
  const [_selectedPet, setSelectedPet] = useState(null);
  //------함수부------------------------------------------------  
  //셀렉터 옵션
  const createOptions = () => {
    const options = []
    allStudents.forEach((student) => {
      let name = '미등록'
      let number = student.studentNumber
      if (student.writtenName) { name = student.writtenName }
      options.push({ value: student.id, label: `${number} ${name}` })
    })
    options.sort((a, b) => a.label.localeCompare(b.label));
    return options
  }
  //가입 버튼
  const handleOnSubmit = (event) => {
    event.preventDefault();
    if (_selectedPet) {
      const confirm = window.confirm(`"${_selected.label}" 학번과 이름이 맞습니까?`);
      if (confirm) {
        const info = { klass, user, petId: _selected.value, petLabel: _selected.label, pet: _selectedPet };
        applyKlassTransaction(info);
      }
      onHide();
    } else window.alert("펫을 선택하세요");
  }
  //다음
  const handleNextOnClick = () => {
    if (_selected) setStep(prev => ++prev);
    else window.alert("학번을 선택하세요");
  }
  //펫 클릭
  const handlePetOnClick = (index) => {
    setSelectedIndex(index);
    setSelectedPet(initPetList[index]);
  }
  //취소
  const cancelOnClick = () => {
    onHide();
    setSelected(null);
    setSelectedPet(null);
    setSelectedIndex(null);
  }
  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}>
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>클래스 가입 신청</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#efefef" }}>
        {step === 1 && <>
          <p>{grade}학년 {subjDetail}과목 {classTitle}반에 가입 신청하시겠습니까?</p>
          <Select
            options={createOptions()}
            placeholder="자신의 학번을 선택하세요"
            onChange={(event) => { setSelected(event) }} />
        </>}
        {step === 2 && <>
          <p>받고 싶은 펫을 선택하세요</p>
          <Row style={{ gap: "10px", justifyContent: "center" }}>
            {initPetUrlList.map((url, index) =>
              <InitPetImg
                $selected={index === _selectedIndex}
                key={url} src={url} alt={`egg${index}`}
                onClick={() => { handlePetOnClick(index) }} />)}
          </Row>
        </>}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#efefef" }}>
        <ModalBtn onClick={() => { cancelOnClick(); }}>취소</ModalBtn>
        {step === 1 && <ModalBtn styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} onClick={handleNextOnClick}>다음</ModalBtn>}
        {step === 2 && <ModalBtn onClick={() => { setStep((prev) => --prev) }}>이전</ModalBtn>}
        {step === 2 && <ModalBtn styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} onClick={(event) => handleOnSubmit(event)}>가입</ModalBtn>}
      </Modal.Footer>
    </Modal >
  )
}

const Row = styled.div`
  display: flex;
`
const InitPetImg = styled.img`
  width: 100px;
  cursor: pointer;
  border : 1px #949192 solid;
  border-radius: 10px;
  background-color: ${({ $selected }) => $selected ? "orange" : "white"};
`
export default ApplyClassModal