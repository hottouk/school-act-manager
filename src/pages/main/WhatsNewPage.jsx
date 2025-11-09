//라이브러리
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
//컴포넌트
import EmptyResult from '../../components/EmptyResult';
import EvolutionModal from '../../components/Modal/EvolutionModal';
import SmallBtn from '../../components/Btn/SmallBtn';
//hooks
import useFetchRtMyUserData from '../../hooks/RealTimeData/useFetchRtMyUserData';
import useFireUserData from '../../hooks/Firebase/useFireUserData';
import useFireTransaction from '../../hooks/useFireTransaction';
import useMediaQuery from '../../hooks/useMediaQuery';
import useFireClassData from '../../hooks/Firebase/useFireClassData';
//240201 갱신 -> 모바일(250215)
const WhatsNewPage = () => {
  //준비
  const user = useSelector(({ user }) => { return user });
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { myUserData } = useFetchRtMyUserData();          //실시간 유저 정보 구독
  useEffect(() => { bindData(); }, [myUserData]);
  //새소식
  const [onSubmitList, setOnSubmitList] = useState([]);
  const [reward, setReward] = useState(null);
  const [isRewardModal, setIsRewardModal] = useState(false);
  const { updateKlassroomArrayInfo } = useFireClassData();
  const { approvWinTransaction, denyTransaction, confirmDenialTransaction, approveCoteahingTransaction, approveEditTransaction } = useFireTransaction();
  const { deleteUserArrayInfo, approveKlassTransaction } = useFireUserData();
  //------함수부------------------------------------------------ 
  //데이터 바인딩
  const bindData = () => {
    if (!myUserData) return;
    setOnSubmitList(myUserData.onSubmitList);
  }
  //교사: 가입 승인
  const handleApproveJoinOnClick = (item) => {
    const { classId, petId, pet } = item;
    const petInfo = { ...pet, classId, petId };
    approveKlassTransaction(item, petInfo);
  }
  //생기부 기록 승인
  const handleApproveWinOnClick = (item) => {
    approvWinTransaction(item)
  }
  //공동 교사 승인
  const handleApproveCoteachingOnClick = async (item) => {
    const { teacher, klass } = item
    const promises = [
      deleteUserArrayInfo(user.uid, "onSubmitList", item),
      approveCoteahingTransaction(teacher.uid, klass.id),
      updateKlassroomArrayInfo(klass.id, "coTeacher", teacher.uid)
    ];
    await Promise.all(promises).then(() => { window.alert("승인되었습니다.") });
  }
  //반려
  const handleDenyOnClick = (item) => {
    const reason = window.prompt("거부 사유를 입력하세요");
    if (reason) denyTransaction(item, reason);
    else if (reason === '') alert("이유는 필수 입력입니다.")
    else alert("취소하셨습니다.")
  }
  //진화 확인
  const handleEvolutionOnClick = (info) => {
    setIsRewardModal(true);
    setReward(info);
  }
  //------교사용 랜더링----------------------------------------------- 
  //학생 클래스 구독 신청
  const TeacherKlassJoinRow = ({ index, item }) => {
    const { studentNumber, studentName, classTitle, classSubj, petLabel, applyDate } = item
    return <><GridItem>{index + 1}</GridItem>
      <GridItem>{studentName || "에러"}</GridItem>
      <GridItem>{classTitle || "에러"}</GridItem>
      <GridItem><BasicText>
        <Hilit>{studentNumber} {studentName}</Hilit> 학생이 <Hilit>{classTitle}</Hilit>반
        <Hilit> {classSubj}</Hilit> 과목
        <Hilit> {petLabel}</Hilit>을 구독 신청하셨습니다. 학번과 이름이 맞으면 수락을 눌러주세요
      </BasicText></GridItem>
      <GridItem>{applyDate}</GridItem>
      <GridItem><SmallBtn btnOnClick={() => { handleApproveJoinOnClick(item) }}>O</SmallBtn></GridItem>
      <GridItem><SmallBtn btnColor="#9b0c24" hoverBtnColor="red" btnOnClick={() => { handleDenyOnClick(item) }} >X</SmallBtn></GridItem>
    </>
  }
  const TeacherKlassJoinBubble = ({ index, item }) => {
    const { studentNumber, studentName, classTitle, classSubj, petLabel, applyDate } = item;
    return <BubbleWrapper>
      <BubbleText>
        - 제목: <Hilit>클래스 구독 신청</Hilit><br />
        - from: <Hilit>{studentNumber} {studentName}</Hilit><br />
        - 반: <Hilit> {classSubj}</Hilit> 과목 <Hilit>{classTitle}</Hilit><br />
        - 구독 대상: <Hilit>{petLabel}</Hilit>
      </BubbleText>
      <Row style={{ justifyContent: "flex-end" }}>{applyDate}</Row>
      <Row style={{ marginTop: "20px", gap: "5px" }}>
        <SmallBtn styles={{ width: "50%" }} btnOnClick={() => { handleApproveJoinOnClick(item) }}>수락</SmallBtn>
        <SmallBtn btnColor="#9b0c2480" styles={{ width: "50%" }} btnOnClick={() => { handleDenyOnClick(item) }} >거절</SmallBtn>
      </Row>
    </BubbleWrapper>
  }
  //학생 수정 요청
  const TeacherEditRecordRow = ({ index, item }) => {
    const { studentName, studentNumber, record, newRecord, subject, date, byte, newByte, } = item;
    return <><GridItem>{index + 1}</GridItem>
      <GridItem>
        {studentNumber}&nbsp;{studentName}
      </GridItem>
      <GridItem>수정요청</GridItem>
      <GridItem>
        <BasicText>
          <Hilit> {subject}</Hilit> 과목 문구<br />
          기존 <Hilit>{byte}</Hilit> 바이트: {record} <br />
          수정 <Hilit>{newByte}</Hilit> 바이트: <Underlined>{newRecord}</Underlined>
        </BasicText>
      </GridItem>
      <GridItem>{date.split("T")[0]}</GridItem>
      <GridItem><SmallBtn btnOnClick={() => approveEditTransaction(item)}>O</SmallBtn></GridItem>
      <GridItem><SmallBtn btnColor="#9b0c24" hoverBtnColor="red" btnOnClick={() => handleDenyOnClick(item)} >X</SmallBtn></GridItem>
    </>
  }
  const TeacherEditRecordBubble = ({ index, item }) => {
    const { studentName, studentNumber, record, newRecord, subject, date, byte, newByte, } = item;
    return <BubbleWrapper>
      <BubbleText>
        - 제목: <Hilit>세특 수정 요청</Hilit><br />
        - from: <Hilit>{studentNumber} {studentName}</Hilit> <br />
        - 과목: <Hilit> {subject}</Hilit> 과목 문구<br />
        - 기존 <Hilit>{byte}</Hilit> 바이트: {record} <br />
        - 수정 <Hilit>{newByte}</Hilit> 바이트: <Underlined>{newRecord}</Underlined>
      </BubbleText>
      <Row style={{ justifyContent: "flex-end" }}>{date.split("T")[0] || "날짜 정보 없음"}</Row>
      <Row style={{ marginTop: "20px", gap: "5px" }}>
        <SmallBtn styles={{ width: "50%" }} btnOnClick={() => { approveEditTransaction(item) }}>수락</SmallBtn>
        <SmallBtn btnColor="#9b0c2480" styles={{ width: "50%" }} btnOnClick={() => { handleDenyOnClick(item) }} >거절</SmallBtn>
      </Row>
    </BubbleWrapper>
  }
  //학생 생기부 기록
  const TeacherWinRow = ({ index, item }) => {
    const { actiRecord, name, studentNumber, title, date } = item
    return <>
      <GridItem>{index + 1}</GridItem>
      <GridItem>{name || "에러"}</GridItem>
      <GridItem>{title || "에러"}</GridItem>
      <GridItem><BubbleText>
        <Hilit>{studentNumber} {name}</Hilit> 학생이 <Hilit>{title}</Hilit>활동에서
        기준을 충족하여 다음과 같은 생기부 문구를 획득합니다.{'\n'}
        "{actiRecord}"
      </BubbleText></GridItem>
      <GridItem>{date || "날짜 정보 없음"}</GridItem>
      <GridItem><SmallBtn btnOnClick={() => { handleApproveWinOnClick(item) }}>O</SmallBtn></GridItem>
      <GridItem><SmallBtn btnColor="#9b0c24" hoverBtnColor="red" btnOnClick={() => { handleDenyOnClick(item) }}>X</SmallBtn></GridItem>
    </>
  }
  const TeacherWinBubble = ({ index, item }) => {
    const { actiRecord, name, studentNumber, title, date } = item
    return <BubbleWrapper>
      <BubbleText>
        - 제목: <Hilit>세특 기록 요청</Hilit> <br />
        - from: <Hilit>{studentNumber} {name}</Hilit> <br />
        - 활동: <Hilit>{title}</Hilit><br />
        - 문구: {actiRecord} <br />
      </BubbleText>
      <Row style={{ justifyContent: "flex-end" }}>{date || "날짜 정보 없음"}</Row>
      <Row style={{ marginTop: "20px", gap: "5px" }}>
        <SmallBtn styles={{ width: "50%" }} btnOnClick={() => { handleApproveWinOnClick(item) }}>수락</SmallBtn>
        <SmallBtn btnColor="#9b0c2480" styles={{ width: "50%" }} btnOnClick={() => { handleDenyOnClick(item) }} >거절</SmallBtn>
      </Row>
    </BubbleWrapper>
  }
  //코티칭
  const CoTeachingRow = ({ index, item }) => {
    const { klass, teacher, applyDate } = item
    return <><GridItem>{index + 1}</GridItem>
      <GridItem>{teacher.name || "에러"}</GridItem>
      <GridItem>{klass.classTitle || "에러"}</GridItem>
      <GridItem>
        <BasicText>
          <Hilit>{teacher.name}</Hilit> 선생님께서 <Hilit>{klass.classTitle}</Hilit>반에
          <Hilit> 공동 교사</Hilit>로 신청하셨습니다.
        </BasicText>
      </GridItem>
      <GridItem>{applyDate}</GridItem>
      <GridItem><SmallBtn btnOnClick={() => { handleApproveCoteachingOnClick(item) }}>O</SmallBtn></GridItem>
      <GridItem><SmallBtn btnColor="#9b0c24" hoverBtnColor="red" btnOnClick={() => { handleDenyOnClick(item) }} >X</SmallBtn></GridItem>
    </>
  }
  const CoteachingBubble = ({ index, item }) => {
    const { klass, teacher, applyDate } = item
    return <BubbleWrapper>
      <BubbleText>
        - 제목: <Hilit>공동 교사 승인 신청</Hilit> <br />
        - from: <Hilit>{teacher.name} 선생님</Hilit> <br />
        - 반: <Hilit>{klass.classTitle}</Hilit>
      </BubbleText>
      <Row style={{ justifyContent: "flex-end" }}>{applyDate || "날짜 정보 없음"}</Row>
      <Row style={{ marginTop: "20px", gap: "5px" }}>
        <SmallBtn styles={{ width: "50%" }} btnOnClick={() => { handleApproveCoteachingOnClick(item) }}>수락</SmallBtn>
        <SmallBtn btnColor="#9b0c2480" styles={{ width: "50%" }} btnOnClick={() => { handleDenyOnClick(item) }} >거절</SmallBtn>
      </Row>
    </BubbleWrapper>
  }
  //결과
  const TeacherDenialRow = ({ index, item }) => {
    const { klassTitle, subject, name, reason, applyDate } = item
    return <><GridItem>{index + 1}</GridItem>
      <GridItem>{name || "에러"}</GridItem>
      <GridItem>{klassTitle || "에러"}</GridItem>
      <GridItem style={{ justifyContent: "flex-start" }}><BubbleText>
        <Hilit>{subject} {klassTitle}</Hilit> 공동 교사 등록이 거부되었습니다.{`\n`}사유: {reason}
      </BubbleText></GridItem>
      <GridItem>{applyDate}</GridItem>
      <GridItem style={{ gridColumn: "6/8", justifyContent: "center" }}><SmallBtn btnOnClick={() => { confirmDenialTransaction(item) }}>O</SmallBtn></GridItem>
    </>
  }
  const TeacherDenialBubble = ({ index, item }) => {
    const { klassTitle, subject, name, reason, applyDate } = item
    return <BubbleWrapper>
      <BubbleText>
        - 제목: <Hilit>공동 교사 승인 거부 알림</Hilit><br />
        - 반: <Hilit>{klassTitle}</Hilit><br />
        - 사유: {reason}
      </BubbleText>
      <Row style={{ marginTop: "20px" }}>
        <SmallBtn styles={{ width: "100%" }} btnOnClick={() => { confirmDenialTransaction(item) }}>확인</SmallBtn>
      </Row>
    </BubbleWrapper>
  }
  const teacherRenderes = {
    join: (item, index) => (<TeacherKlassJoinRow key={`${item.studentId}${item.petId}`} index={index} item={item} />),
    "co-teacher": (item, index) => (<CoTeachingRow key={`${index}`} index={index} item={item} />),
    denial: (item, index) => (<TeacherDenialRow key={`${index}`} index={index} item={item} />),
    win: (item, index) => (<TeacherWinRow key={`${item.actiId}${item.sId}${index}`} index={index} item={item} />),
    edit: (item, index) => (<TeacherEditRecordRow key={`${item.time}${item.studentId}${index}`} index={index} item={item} />)
  }
  const teacherMobileRenderers = {
    join: (item, index) => (<TeacherKlassJoinBubble key={`${item.studentId}${item.petId}`} index={index} item={item} />),
    "co-teacher": (item, index) => (<CoteachingBubble key={`${index}`} index={index} item={item} />),
    denial: (item, index) => (<TeacherDenialBubble key={`${index}`} index={index} item={item} />),
    win: (item, index) => (<TeacherWinBubble key={`${item.actiId}${item.sId}${index}`} index={index} item={item} />),
    edit: (item, index) => (<TeacherEditRecordBubble key={`${item.time}${item.studentId}${index}`} index={index} item={item} />)
  }
  //------학생용 랜더링----------------------------------------------- 
  //진화 알림
  const StudentEvolutionRow = ({ index, item }) => {
    const { level, name, } = item;
    return <>
      <GridItem>{index + 1}</GridItem>
      <GridItem><BasicText>{name}</BasicText></GridItem>
      <GridItem><BasicText>당신의 펫이 <Hilit>{level}</Hilit>레벨이 되어 다음 단계로 진화하려합니다.</BasicText></GridItem>
      <GridItem><SmallBtn onClick={() => { handleEvolutionOnClick({ ...item, submitItem: item }) }}>진화</SmallBtn></GridItem>
    </>
  }
  const StudentEvolutionBubble = ({ index, item }) => {
    const { level, name, } = item;
    return <BubbleWrapper>
      <BubbleText>
        당신의 펫 <Hilit>{name}</Hilit>이(가)
        <Hilit>{level}</Hilit>레벨이 되어 다음 단계로 진화하려합니다.
      </BubbleText>
      <Row style={{ justifyContent: "space-evenly", marginTop: "20px" }}>
        <SmallBtn onClick={() => { handleEvolutionOnClick({ ...item, submitItem: item }) }}>진화</SmallBtn>
      </Row>
    </BubbleWrapper>
  }
  //승인 알림
  const StudentApprovalRow = (({ index, item }) => {
    const { newRecord, message, subType } = item;
    return <>
      <GridItem>{index + 1}</GridItem>
      <GridItem>
        <BasicText>{subType === "edit" && "승인"}</BasicText></GridItem>
      <GridItem>
        <BasicText>
          {message}<br />
          {newRecord}
        </BasicText>
      </GridItem>
      <GridItem>
        <SmallBtn onClick={() => deleteUserArrayInfo(user.uid, "onSubmitList", item)}>확인</SmallBtn>
      </GridItem>
    </>
  })
  const StudentApprovalBubble = (({ index, item }) => {
    const { newRecord, message, subType } = item;
    return <BubbleWrapper>
      <BubbleText>
        <BasicText>
          <Hilit>{message}</Hilit><br />
          - 문구: {newRecord}
        </BasicText>
      </BubbleText>
      <Row style={{ marginTop: "20px" }}>
        <SmallBtn styles={{ width: "100%" }} onClick={() => deleteUserArrayInfo(user.uid, "onSubmitList", item)}>확인</SmallBtn>
      </Row>
    </BubbleWrapper>
  })
  //거절 알림
  const StudentResultRow = (({ index, item }) => {
    const { classTitle, petLabel, reason, school, title, newRecord, subject } = item;
    return <>
      <GridItem>{index + 1}</GridItem>
      <GridItem><BasicText>거부</BasicText></GridItem>
      <GridItem>
        {school && <BasicText><Hilit>{school} {classTitle}</Hilit> 클래스 가입 신청이 거부되었습니다.{`\n`}사유: {reason}</BasicText>}
        {title && <BasicText><Hilit>{title}</Hilit> 생기부 활동 기록이 거부되었습니다.{`\n`}사유: {reason}</BasicText>}
        {newRecord &&
          <BasicText>
            <Hilit>{subject}</Hilit> 과목 <br />
            "{newRecord}"<br />
            수정 요청이 <Hilit>거부</Hilit>되었습니다.<br />
            사유: <Underlined>{reason}</Underlined>
          </BasicText>}
      </GridItem>
      <GridItem>
        {school && <SmallBtn onClick={() => confirmDenialTransaction(item)}>확인</SmallBtn>}
        {!school && <SmallBtn onClick={() => deleteUserArrayInfo(user.uid, "onSubmitList", item)}>확인</SmallBtn>}
      </GridItem>
    </>
  })
  const StudentResultBubble = ({ index, item }) => {
    const { classTitle, petLabel, reason, school, title, newRecord, date } = item
    return <BubbleWrapper>
      {school &&
        <BubbleText>
          <Hilit>{classTitle}</Hilit> 클래스 가입 신청이 거부되었습니다. <br />
          - 사유: {reason}</BubbleText>}
      {title &&
        <BubbleText>
          <Hilit>{title}</Hilit> 생기부 활동 기록이 거부되었습니다.<br />
          - 사유: {reason}
        </BubbleText>}
      {newRecord &&
        <BubbleText>
          <Hilit>생기부 수정 요청이 거부되었습니다</Hilit><br />
          - 문구: {newRecord}<br />
          - 사유: {reason}
        </BubbleText>}
      <Row style={{ justifyContent: "flex-end" }}>{date || "날짜 정보 없음"}</Row>
      <Row style={{ marginTop: "20px" }}>
        <SmallBtn styles={{ width: "100%" }} onClick={() => { deleteUserArrayInfo(user.uid, "onSubmitList", item) }}>확인</SmallBtn>
      </Row>
    </BubbleWrapper>
  }

  const studentRenderes = {
    denial: (item, index) => (<StudentResultRow key={item.reason} index={index} item={item} />),
    evolution: (item, index) => (<StudentEvolutionRow key={`${index}${item.reason}${item.petLabel}`} index={index} item={item} />),
    confirm: (item, index) => (<StudentApprovalRow key={item.message} index={index} item={item} />),
  }
  const studentMobileRenderes = {
    denial: (item, index) => (<StudentResultBubble key={item.reason} index={index} item={item} />),
    evolution: (item, index) => (<StudentEvolutionBubble key={`${index}${item.reason}${item.petLabel}`} index={index} item={item} />),
    confirm: (item, index) => (<StudentApprovalBubble key={item.message} index={index} item={item} />),
  }

  return (<><Container>
    {/* 교사용 */}
    {(user.isTeacher && !isMobile) && <>
      <TeacherGridContainer>
        <TableHeaderWrapper>
          <Header>연번</Header>
          <Header>누가</Header>
          <Header>무엇을</Header>
          <Header>어떻게</Header>
          <Header>언제</Header>
          <Header>승인</Header>
          <Header>반려</Header>
        </TableHeaderWrapper>
        {(!onSubmitList || onSubmitList?.length === 0) && <GridRow><EmptyResult comment={"새로운 알림이 없어요"} /></GridRow>}
        {onSubmitList?.map((item, index) => {
          const renderer = teacherRenderes[item.type];
          return renderer ? renderer(item, index) : null;
        })}
      </TeacherGridContainer>
    </>}
    {/* 교사용 모바일 */}
    {(isMobile && user.isTeacher) && <>
      {(onSubmitList?.length === 0 || !onSubmitList) && <GridRow><EmptyResult comment={"새로운 알림이 없어요"} /></GridRow>}
      {onSubmitList?.map((item, index) => {
        const renderer = teacherMobileRenderers[item.type];
        return renderer ? renderer(item, index) : null;
      })}
    </>}
    {/* 학생용 */}
    {(!user.isTeacher && !isMobile) && <>
      <StudentGridContainer>
        <TableHeaderWrapper>
          <Header>연번</Header>
          <Header>대상</Header>
          <Header>내용</Header>
          <Header>확인</Header>
        </TableHeaderWrapper>
        {(onSubmitList?.length === 0 || !onSubmitList) && <GridRow><EmptyResult comment={"새로운 알림이 없어요"} /></GridRow>}
        {onSubmitList?.map((item, index) => {
          const renderer = studentRenderes[item.type];
          return renderer ? renderer(item, index) : null;
        }
        )}
      </StudentGridContainer>
    </>}
    {/* 학생용 모바일 */}
    {(isMobile && !user.isTeacher) && <>
      {(onSubmitList?.length === 0 || !onSubmitList) && <GridRow><EmptyResult comment={"새로운 알림이 없어요"} /></GridRow>}
      {onSubmitList?.map((item, index) => {
        const renderer = studentMobileRenderes[item.type];
        return renderer ? renderer(item, index) : null;
      })}
    </>}
  </Container >
    {/* 진화모달 */}
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
const Row = styled.div`
  display: flex;
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
  color: 3a3a3a;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  &.left-align { text-align: left; }
`
const BasicText = styled.p`
  margin: 0;
  text-align: left;
`
const BubbleText = styled(BasicText)`
  white-space: pre-wrap
`
const Hilit = styled.span`
  font-weight: bold;
  color: #3454d1;
  font-dec
`
const Underlined = styled.span`
  text-decoration: underline
`
const BubbleWrapper = styled.div`
  background-color: #efefef;
  padding: 10px;
  color: 3a3a3a;
  border: 1px solid #ddd;
  border-radius: 15px;
`
export default WhatsNewPage