//라이브러리
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
//컴포넌트
import CardSortForm from '../../components/Form/CardSortForm'
import MainBtn from '../../components/Btn/MainBtn'
//hooks
import useClientHeight from '../../hooks/useClientHeight'
//css
import styled from 'styled-components'

//2024.09.15(state에 반type 생성, css제목 변경)
const ClassSortSelection = () => {
  //1. 변수
  const navigate = useNavigate()
  const { state } = useLocation(); //=>에 따라 보여줄 화면 결정
  const [step, setStep] = useState('')
  const [type, setType] = useState('')
  //2. 세로 길이
  const clientHeight = useClientHeight(document.documentElement)
  useEffect(() => {
    setStep(state.step)
    setType(state.type)
  }, [state])

  //2. 함수
  const handleCardBtnClick = (event) => {
    switch (event.target.id) {
      case "subject":
        navigate("/classrooms_setting", { state: { step: "second", type: "subject" } })
        break;
      case "homeroom":
        navigate("/classrooms_setting", { state: { step: "second", type: "homeroom" } })
        break;
      case "club":
        break;
      case "with_neis":
        navigate("/classrooms_setting_details", { state: { how: "with_neis", type } })
        break;
      case "with_number":
        navigate("/classrooms_setting_details", { state: { how: "with_number", type } })
        break;
      case "by_hand":
        navigate("/classrooms_setting_details", { state: { how: "by_hand", type } })
        break;
      default: return;
    }
  }

  //클래스 종류 데이터
  const classSortList = [
    { id: "subject", legend: "교과반", subTitle: "과세특 기록용", imgNumber: 1 },
    { id: "homeroom", legend: "담임반", subTitle: "행발, 진로, 자율활동기록용", imgNumber: 2 },
    { id: "club", legend: "동아리", subTitle: "동아리 활동 기록용", imgNumber: 3, ban: true }
  ]
  //만드는 방법 데이터
  const howtoMakeList = [
    { id: "with_neis", legend: "나이스 출석부", subTitle: "학번, 이름 자동 생성", imgNumber: 4 },
    { id: "with_number", legend: "학번 생성", subTitle: "학번 자동 생성, 이름 수기 입력", imgNumber: 5 },
    { id: "by_hand", legend: "수기 입력", subTitle: "학생을 수작업으로 등록", imgNumber: 6 }
  ]

  return (
    <Container $clientheight={clientHeight}>
      {(step === "first") && <CardSortForm itemList={classSortList} handleCardBtnClick={handleCardBtnClick} />}
      {(step === "second") && <CardSortForm itemList={howtoMakeList} handleCardBtnClick={handleCardBtnClick} />}
      <BtnWrapper>
        <MainBtn btnName="뒤로가기" btnOnClick={() => { navigate('/classrooms') }} />
      </BtnWrapper>
    </Container>
  )
}
const Container = styled.div`
  box-sizing: border-box;
  margin-top: 110px;
  @media screen and (max-width: 767px){
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    top: 0;
    gap: 20px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
const BtnWrapper = styled.div`
  margin-top: 5%;
`
export default ClassSortSelection