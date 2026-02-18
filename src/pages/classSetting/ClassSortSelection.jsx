//라이브러리
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
//컴포넌트
import CardSortForm from '../../components/Form/CardSortForm'
import SubNav from '../../components/Bar/SubNav'
import BackBtn from '../../components/Btn/BackBtn'
//hooks
import useClientHeight from '../../hooks/useClientHeight'
//css
import styled from 'styled-components'
import MainContainer from '../../components/Styled/MainContainer'
import useMediaQuery from '../../hooks/useMediaQuery'
//state에 반type 생성, css제목 변경(240915)
const ClassSortSelection = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { state } = useLocation(); //=>에 따라 보여줄 화면 결정
  useEffect(() => {
    setStep(state.step)
    setType(state.type)
  }, [state])
  const [step, setStep] = useState('')
  const [type, setType] = useState('')
  //------함수부------------------------------------------------  
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
    <MainContainer>
      {!isMobile && <SubNav><BackBtn /></SubNav>}
      <CardWrapper>
        {(step === "first") && <CardSortForm itemList={classSortList} handleCardBtnClick={handleCardBtnClick} />}
        {(step === "second") && <CardSortForm itemList={howtoMakeList} handleCardBtnClick={handleCardBtnClick} />}
      </CardWrapper>
    </MainContainer>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const CardWrapper = styled(Row)`
  height: 40dvh;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  @media(max-width: 768px){
    flex-grow: 1;
  }
`

export default ClassSortSelection