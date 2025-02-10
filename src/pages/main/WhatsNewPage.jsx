//라이브러리
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
//컴포넌트
import EmptyResult from '../../components/EmptyResult'
import EvolutionModal from '../../components/Modal/EvolutionModal'
import SmallBtn from '../../components/Btn/SmallBtn'
//hooks
import useFetchRtMyUserData from '../../hooks/RealTimeData/useFetchRtMyUserData'
import useFireUserData from '../../hooks/Firebase/useFireUserData'
import useFireTransaction from '../../hooks/useFireTransaction'
import usePet from '../../hooks/usePet'

//240201 갱신
const WhatsNewPage = () => {
  //준비
  const user = useSelector(({ user }) => { return user })
  const { myUserData } = useFetchRtMyUserData();                   //실시간 유저 정보 구독
  useEffect(() => { bindData(); }, [myUserData])
  const [onSubmitList, setOnSubmitList] = useState([]);
  const [reward, setReward] = useState(null);
  const [isRewardModal, setIsRewardModal] = useState(false)
  const { approveKlassTransaction } = useFireTransaction();
  const { getInitialPet } = usePet()
  const { approvWinTransaction, denyTransaction, confirmDenialTransaction } = useFireTransaction();
  const { deleteUserArrayInfo } = useFireUserData();

  //------함수부------------------------------------------------ 
  //데이터 바인딩
  const bindData = () => {
    if (!myUserData) return;
    setOnSubmitList(myUserData.onSubmitList);
  }

  //가입 승인
  const handleApproveJoinOnClick = (item) => {
    const { classId, petId } = item
    const pet = { ...getInitialPet(item.classSubj), classId, petId }
    approveKlassTransaction(item, pet)
  }

  //생기부 기록 승인
  const handleApproveWinOnClick = (item) => {
    approvWinTransaction(item)
  }

  //반려
  const handleDenyOnClick = (item) => {
    const reason = window.prompt("거부 사유를 입력하세요")
    if (reason) { denyTransaction(item, reason); } else {
      window.alert("취소하셨습니다.")
    }
  }

  //------교사용----------------------------------------------- 
  //학생 가입 여부 알림
  const TeacherKlassJoinRow = ({ index, item }) => {
    const { studentNumber, studentName, classTitle, classSubj, school, petLabel, applyDate } = item
    return <>
      <GridItem>{index + 1}</GridItem>
      <GridItem>{studentName || "에러"}</GridItem>
      <GridItem>{classTitle || "에러"}</GridItem>
      <GridItem><p style={{ margin: "0" }}>
        <Highlight>{school} {studentNumber} {studentName}</Highlight> 학생이 <Highlight>{classTitle}</Highlight>반
        <Highlight> {classSubj}</Highlight> 과목
        <Highlight> {petLabel}</Highlight>을 구독 신청하셨습니다. 학번과 이름이 맞으면 수락을 눌러주세요
      </p></GridItem>
      <GridItem>{applyDate}</GridItem>
      <GridItem><SmallBtn btnOnClick={() => { handleApproveJoinOnClick(item) }}>O</SmallBtn></GridItem>
      <GridItem><SmallBtn btnColor="#9b0c24" hoverBtnColor="red" btnOnClick={() => { handleDenyOnClick(item) }} >X</SmallBtn></GridItem>
    </>
  }

  //학생 생기부 기록 알림
  const TeacherWinRow = ({ index, item }) => {
    const { actiRecord, name, studentNumber, title, date } = item
    return <>
      <GridItem>{index + 1}</GridItem>
      <GridItem>{name || "에러"}</GridItem>
      <GridItem>{title || "에러"}</GridItem>
      <GridItem><p style={{ margin: "0", whiteSpace: 'pre-wrap' }}>
        <Highlight>{studentNumber} {name}</Highlight> 학생이 <Highlight>{title}</Highlight>활동에서
        기준을 충족하여 다음과 같은 생기부 문구를 획득합니다.{'\n'}
        "{actiRecord}"
      </p></GridItem>
      <GridItem>{date || "날짜 정보 없음"}</GridItem>
      <GridItem><SmallBtn btnOnClick={() => { handleApproveWinOnClick(item) }}>O</SmallBtn></GridItem>
      <GridItem><SmallBtn btnColor="#9b0c24" hoverBtnColor="red" btnOnClick={() => { handleDenyOnClick(item) }}>X</SmallBtn></GridItem>
    </>
  }

  //------학생용----------------------------------------------- 
  //진화 알림
  const StudentEvolutionRow = ({ index, item }) => {
    const { level, monId, petId, name, type } = item
    return <>
      <GridItem>{index + 1}</GridItem>
      <GridItem><p style={{ margin: "0" }}>{name}</p></GridItem>
      <GridItem><p style={{ margin: "0" }}>당신의 펫이 <Highlight>{level}</Highlight>레벨이 되어 다음 단계로 진화하려합니다.</p></GridItem>
      <GridItem><SmallBtn onClick={() => { handleEvolutionOnClick({ monId, petId, name, type, userData: myUserData }) }}>진화</SmallBtn></GridItem>
    </>
  }

  //결과 알림
  const StudentResultRow = (({ index, item }) => {
    const { classTitle, petLabel, reason, school, title } = item
    return <React.Fragment key={`${index}${reason}${petLabel}`}>
      <GridItem>{index + 1}</GridItem>
      <GridItem><p style={{ margin: "0" }}>{classTitle || title}</p></GridItem>
      <GridItem><p style={{ margin: "0", whiteSpace: 'pre-wrap' }}>
        {school && <><Highlight>{school} {classTitle}</Highlight> 클래스 가입 신청이 거부되었습니다.{`\n`}사유: {reason}</>}
        {title && <><Highlight>{title}</Highlight> 생기부 활동 기록이 거부되었습니다.{`\n`}사유: {reason}</>}
      </p></GridItem>
      <GridItem>
        {school && <SmallBtn onClick={() => { handleDeniedOnClick(item) }}>확인</SmallBtn>}
        {title && <SmallBtn onClick={() => { deleteUserArrayInfo(user.uid, "onSubmitList", item) }}>확인</SmallBtn>}
      </GridItem>
    </React.Fragment>
  })

  //진화 확인
  const handleEvolutionOnClick = (info) => {
    setIsRewardModal(true)
    setReward(info)
  }

  //거부 확인
  const handleDeniedOnClick = (info) => {
    confirmDenialTransaction(info)
  }

  return (<><Container>
    {/* 교사용 */}
    {user.isTeacher && <>
      <TeacherGridContainer>
        <TableHeaderWrapper>
          <Header>연번</Header>
          <Header>학생</Header>
          <Header>대상</Header>
          <Header>내용</Header>
          <Header>일시</Header>
          <Header>승인</Header>
          <Header>반려</Header>
        </TableHeaderWrapper>
        {onSubmitList.length === 0 && <GridRow><EmptyResult comment={"신청 내역이 없어요"} /></GridRow>}
        {onSubmitList?.map((item, index) => {
          if (item.type === "join") { return <TeacherKlassJoinRow key={`${item.studentId}${item.petId}`} index={index} item={item} /> }
          else { return <TeacherWinRow key={`${item.actiId}${item.sId}${index}`} index={index} item={item} /> }
        })}
      </TeacherGridContainer>
    </>}

    {/* 학생용 */}
    {!user.isTeacher && <>
      <StudentGridContainer>
        <TableHeaderWrapper>
          <Header>연번</Header>
          <Header>대상</Header>
          <Header>내용</Header>
          <Header>확인</Header>
        </TableHeaderWrapper>
        {(onSubmitList?.length === 0 || !onSubmitList) && <GridRow><EmptyResult comment={"새로운 알림이 없어요"} /></GridRow>}
        {onSubmitList?.map((item, index) => {
          if (item.type === "evolution") { return <StudentEvolutionRow key={item.petId} index={index} item={item} /> }
          else { return <StudentResultRow key={`${index}${item.reason}${item.petLabel}`} index={index} item={item} /> }
        }
        )}
      </StudentGridContainer>
    </>}
  </Container >
    <EvolutionModal show={isRewardModal} onHide={() => { setIsRewardModal(false) }} info={reward} />
  </>)
}

const Container = styled.main`
  width: 100%;
  box-sizing: border-box;
  @media screen and (max-width: 767px){
    width: 100%;
    height: ${(props) => props.$clientheight}px;
  }
`
const GridRow = styled.div`
  grid-column: 1/-1;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: #efefef;
`
const GridContainer = styled.div`
  width: 90%;
  margin: 50px auto;
  display: grid;
  grid-template-rows: 40px;
`
const TeacherGridContainer = styled(GridContainer)`
  grid-template-columns : 70px 100px 120px 1fr 150px 70px 70px;
`
const StudentGridContainer = styled(GridContainer)`
  grid-template-columns : 70px 100px 1fr 70px;
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
  display: felx;
  &.left-align { text-align: left; }
`
const Highlight = styled.span`
  font-weight: bold;
  color: #3454d1;
`
export default WhatsNewPage