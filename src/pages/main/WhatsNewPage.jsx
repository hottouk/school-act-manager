import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import useEnrollClass from '../../hooks/useEnrollClass'
import { useSelector } from 'react-redux'
import EmptyResult from '../../components/EmptyResult'
import { useNavigate } from 'react-router-dom'
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData'
import RewardModal from '../../components/Modal/RewardModal'
import useDoActivity from '../../hooks/useDoActivity'
import useFetchRtMyUserData from '../../hooks/RealTimeData/useFetchRtMyUserData'
import SmallBtn from '../../components/Btn/SmallBtn'
import useFireTransaction from '../../hooks/useFireTransaction'
import usePet from '../../hooks/usePet'

const WhatsNewPage = () => {
  //준비
  const user = useSelector(({ user }) => { return user })
  const { myUserData } = useFetchRtMyUserData();                   //실시간 유저 정보 구독
  useEffect(() => { renderData(); }, [myUserData])
  const [onSubmitList, setOnSubmitList] = useState(null);
  const [reward, setReward] = useState(null)
  const [isModalShown, setIsModalShown] = useState(false)
  const { approveKlassTransaction } = useFireTransaction();
  const { getInitialPet } = usePet()

  const { approveMembership, confirmApplyResult, denyMembership } = useEnrollClass()
  const { confirmHomeworkResult } = useDoActivity()
  const { getInfo } = useAddUpdFireData("activities")
  const navigate = useNavigate()

  //데이터 랜더링
  const renderData = () => {
    if (!myUserData) return;
    setOnSubmitList(myUserData.onSubmitList);
  }

  //가입 승인
  const handleApproveOnClick = (item) => {
    const { classId, petId } = item
    console.log(item)
    const pet = { ...getInitialPet(item.classSubj), classId, petId }
    console.log(pet)
    approveKlassTransaction(item, pet)
  }

  const handleDeny = () => { }

  //유저 상호작용
  const handleBtnClick = (event, params) => { //prams는 actiInfo
    switch (event.target.id) {
      case "approval_btn":
        approveMembership(params)
        break;
      case "deny_btn":
        denyMembership(params)
        break;
      case "check_homework_btn":
        let studentId = params.id.split("/")[0]
        let actId = params.id.split("/")[1]
        getInfo(actId, "acti").then((acti) => {
          let particiList = acti.data().particiList
          let actInfo = { id: acti.id, ...acti.data() }
          let student = particiList.find((item) => { return item.uid === studentId })
          navigate(`/activities/${actId}/${studentId}`, { state: { acti: actInfo, student } })
        })
        break;
      case "signup_result_btn":
        confirmApplyResult(params, callRewardModal)
        break;
      case "homework_result_btn":
        confirmHomeworkResult(params, callRewardModal)
        break;
      default: return
    }
  }

  const callRewardModal = (reward) => { //보상 Modal 부르기
    setIsModalShown(true)
    setReward(reward)
  }

  return (<><Container>
    {/* 교사용 */}
    {user.isTeacher && <>
      <p>클래스 가입 신청</p>
      <GridContainer>
        <TableHeaderWrapper>
          <Header>연번</Header>
          <Header>신청 학생</Header>
          <Header>신청 반</Header>
          <Header>신청 내역</Header>
          <Header>신청 일시</Header>
          <Header>승인</Header>
          <Header>반려</Header>
        </TableHeaderWrapper>
        {(!onSubmitList || onSubmitList.length === 0) && <GridRow><EmptyResult comment={"신청 내역이 없어요"} /></GridRow>}
        {onSubmitList?.map((item, index) => {
          const { studentId, petId, studentNumber, studentName, classTitle, classSubj, school, petLabel, applyDate } = item
          return <React.Fragment key={`${studentId}${petId}`}>
            <GridItem>{index + 1}</GridItem>
            <GridItem>{studentName || "에러"}</GridItem>
            <GridItem>{classTitle || "에러"}</GridItem>
            <GridItem><p style={{ margin: "0" }}>
              <Highlight>{studentNumber} {studentName}</Highlight> 학생이 <Highlight>{school} {classTitle}</Highlight>반
              <Highlight> {classSubj}</Highlight> 과목
              <Highlight> {petLabel}</Highlight>을 구독 신청하셨습니다. 학번과 이름이 맞으면 수락을 눌러주세요
            </p></GridItem>
            <GridItem>{applyDate}</GridItem>
            <GridItem><SmallBtn btnOnClick={() => { handleApproveOnClick(item) }}>O</SmallBtn></GridItem>
            <GridItem><SmallBtn btnColor="#9b0c24" hoverBtnColor="red">X</SmallBtn></GridItem>
          </React.Fragment>
        })}
      </GridContainer>

    </>}
    {/* 학생용 */}
    {!user.isTeacher && <>
      <p>클래스 신청 결과</p>

    </>}
  </Container>
    <RewardModal show={isModalShown} onHide={() => { setIsModalShown(false) }} rewards={reward} />
  </>)
}

const Container = styled.main`
  box-sizing: border-box;
  @media screen and (max-width: 767px){
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    margin: 0;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
const GridRow = styled.div`
  grid-column: 1/8;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: #ddd;
`
const GridContainer = styled.div`
  width: 90%;
  margin: 0 auto;
  display: grid;
  grid-template-columns : 70px 100px 100px 1fr 150px 70px 70px;
  grid-template-rows: 40px;
`
const TableHeaderWrapper = styled.div` 
  display: contents;
`
const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #3454d1;
  color: white;
  font-weight: bold;
  padding: 10px;

  &: first-child {
    border-top-left-radius: 5px;
  }
  &: last-child {
    border-top-right-radius: 5px;
  }
`
const GridItem = styled.div`
  background-color: #efefef;
  padding: 10px;
  color: black;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  &.left-align { 
    text-align: left;
  }
`
const Highlight = styled.span`
  font-weight: bold;
  color: #3454d1;
`

const StyledBtn18 = styled.button`
  align-items: center;
  background-color: ${(props) => {
    return props.$color ? "#C70039" : "#3454d1"
  }};
  border: 0;
  border-radius: 100px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font-family: -apple-system, system-ui, system-ui, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 20px;
  max-width: 480px;
  min-height: 40px;
  min-width: 0px;
  overflow: hidden;
  padding: 0px;
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;
  touch-action: manipulation;
  transition: background-color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s, box-shadow 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s, color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;
  &:hover, focus {
    background-color: ${(props) => { return props.$color ? "#900C3F" : "#16437E" }};
    color: #ffffff;
  }
  &:active {
    background: #09223b;
    color: rgb(255, 255, 255, .7);
  }
  &:disabled {
    cursor: not - allowed;
    background: rgba(0, 0, 0, .08);
    color: rgba(0, 0, 0, .3);
  }
`
export default WhatsNewPage