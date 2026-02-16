//라이브러리
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
//컴포넌트
import EmptyResult from '../EmptyResult'
import PetImg from '../PetImg'
//hooks
import useMediaQuery from '../../hooks/useMediaQuery'
//아이콘
import iconImg from '../../image/icon/like_icon.png'
import unknownIcon from '../../image/icon/unkown_icon.png'
import recycleIcon from '../../image/icon/recycle_icon.png'
//생성(240109) -> onClick 로직 분리(250122) -> 정리(251216)
const CardList = ({ dataList, type, onClick, selected }) => {
  const user = useSelector(({ user }) => user)
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const typeColor = { activity: "#3454d1", copiedActi: "#ff69b4", quizActi: "#098a0f" };
  const hoverColor = { activity: "#3453d120", copiedActi: "#ff69b420", quizActi: "#098a0f20" };
  //------랜더링----------------------------------------------- 
  //활동 카드(교과, 담임, 업어온, 퀴즈)
  const ActiCard = ({ item, onClick }) => {
    const { title, subject, subjDetail, repeatInfoList, likedCount, madeBy, uid, quizInfo } = item || {};
    const maskedName = (name) => {
      if (!uid || uid === user.uid) return name;
      return name[0] + 'ㅇㅇ';
    };
    return <Card onClick={() => { onClick(item); }} $hoverColor={hoverColor[type]}>
      <Title style={{ color: typeColor[type] }} >{title}</Title>
      <BasicText>{subject}-{subjDetail ? subjDetail : ''}</BasicText>
      {!isMobile && <Row style={{ height: "41px", gap: "5px", justifyContent: "flex-end" }}>
        {repeatInfoList && <IconImg alt='반복형' src={recycleIcon} />}
        {quizInfo && <BasicText>{quizInfo.quizList?.length || 0} 문제</BasicText>}
        {type === "activity" && <div>
          <IconImg src={iconImg} alt={"받은좋아요"} />
          <p style={{ margin: "4px 0" }}>{likedCount ? likedCount : 0}</p>
        </div>}
      </Row>}
      {!isMobile && <Row style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
        <TagText style={{ backgroundColor: typeColor[type] }}>by {madeBy ? `${maskedName(madeBy)} 선생님` : "어떤 선생님"}</TagText>
      </Row>}
    </Card >
  }
  //클래스 카드(교과,담임)
  const KlassCard = ({ item, onClick }) => {
    const { classTitle, intro, subject, subjDetail, grade, classNumber } = item || {};
    return <Card onClick={() => onClick(item)}>
      <Title style={{ color: "#3454d1" }}>{classTitle}</Title>
      <Row style={{ marginBottom: "25px" }}>
        {type === "subjKlass" && <BasicText>{subject}{subjDetail ? '-' + subjDetail : ''} / </BasicText>}
        <Row>
          <Highlight>{grade}</Highlight><BasicText>학년</BasicText>
          <Highlight>{classNumber}</Highlight><BasicText>반</BasicText>
        </Row>
      </Row>
      {!isMobile && <BasicText>{intro}</BasicText>}
    </Card>
  }
  //단어 카드
  const QuizCard = ({ item, onClick }) => {
    return <Card onClick={() => { onClick(item); }}>
      <Title style={{ color: "#3454d1" }} >{item.title}</Title>
      <p style={{ margin: "5px 0" }}>{item.subject}{item.subjDetail ? '-' + item.subjDetail : ''}</p>
      {!isMobile
        ? <QuizNumber style={{ margin: "-60px -15px" }}>{item.quizList.length}</QuizNumber>
        : <BasicText>{item.quizList?.length || 0} 문제</BasicText>}
    </Card>
  }
  //펫
  const PetCard = ({ item, onClick }) => {
    return <Card $backgroundColor={`${item.petId === selected?.petId ? "rgba(52, 84, 209, 0.4)" : "white"}`} onClick={onClick}>
      <Row style={{ justifyContent: "space-between" }}>
        <Column>
          <PetImg path={item.path} subject={"none"} styles={{ width: "100px", height: "100px" }} />
          <p style={{ margin: "5px 0", textAlign: "center" }}>lv{item.level.level} {item.name}</p>
        </Column>
        <Column style={{ justifyContent: "space-between" }}>
          <BigNumber style={{ margin: "-35px 0" }}>{Math.floor(item.spec.hp + item.spec.atk + item.spec.def + item.spec.mat + item.spec.mdf + item.spec.spd)}</BigNumber>
          <p style={{ margin: "5px 0", textAlign: "center" }}>종합전투력</p>
        </Column>
      </Row>
    </Card>
  }
  //몬스터 카드
  const MonsterCard = ({ item, onClick }) => {
    const { spec, exp, name, level, path } = item;
    return <Card style={{ padding: "10px", }} $backgroundColor={`${level === selected ? "rgba(52, 84, 209, 0.4)" : "white"}`} onClick={() => { onClick(level) }}>
      <Row style={{ justifyContent: "space-around" }}>
        <Column>
          <PetImg path={path} subject={"none"} styles={{ width: "100px", height: "100px" }} />
          <Row style={{ justifyContent: "space-evenly" }}>
            <Highlight>lv{level} </Highlight>
            <BasicText style={{ paddingTop: "4px" }}>{name}</BasicText>
          </Row>
        </Column>
        <Column style={{ justifyContent: "space-around" }}>
          <BasicText>Status</BasicText>
          <Row style={{ gap: "20px" }}>
            <Column>
              <BasicText>체력: {spec?.hp ?? "??"}</BasicText>
              <BasicText>공격: {spec?.atk ?? "??"}</BasicText>
              <BasicText>방어: {spec?.def ?? "??"}</BasicText>
            </Column>
            <Column>
              <BasicText>마력: {spec?.mat ?? "??"}</BasicText>
              <BasicText>지력: {spec?.mdf ?? "??"}</BasicText>
              <BasicText>민첩: {spec?.spd ?? "??"}</BasicText>
            </Column>
          </Row>
          <Highlight>획득 경험치: {exp}</Highlight>
        </Column>
      </Row>
    </Card>
  }
  //멤버 카드
  const MemberCard = ({ item, onClick }) => {
    const { profileImg, name, email } = item;
    return <Card $backgroundColor={`${item.uid === selected ? "rgba(52, 84, 209, 0.4)" : "white"}`} onClick={() => { onClick(item); }}>
      <Column style={{ justifyContent: "space-between", height: "100%" }}>
        <Row style={{ justifyContent: "flex-start", alignItems: "center" }}>
          <ProfileImg src={profileImg || unknownIcon} alt='프로필' />
          <Title style={{ color: "#3454d1", margin: "0 20px" }}>{name}</Title>
        </Row>
        <p>{email}</p>
      </Column>
    </Card>
  }
  //게임방 카드
  const MultiroomCard = ({ item, onClick }) => {
    const { status, players, pets } = item;
    const player1 = players[0];
    const player2 = players[1];
    const pet1 = pets[0];
    const pet2 = pets[1];
    const { spec, exp, name, level, path } = pet1;
    return <Card onClick={() => { onClick(item); }} style={{ padding: "0", position: "relative" }}>
      <Row style={{ height: "100%", }} >
        <Column style={{ width: "50%", height: "100%", alignItems: "center", justifyContent: "center", borderRadius: "10px 0 0 10px", backgroundColor: "#3454d150" }}>
          <PetImg path={pet1?.path} styles={{ width: "100px", height: "100px", border: "1px solid gray", borderRadius: "50px" }} />
          <BasicText>{player1?.name}님의 {pet1?.name}</BasicText>
        </Column>
        <Column style={{ width: "50%", height: "100%", alignItems: "center", justifyContent: "center", borderRadius: "0 10px 10px 0", backgroundColor: "#9b0c2450" }}>
          <PetImg path={pet2?.path} styles={{ width: "100px", height: "100px", border: "1px solid gray", borderRadius: "50px" }} />
          <BasicText>{player2 ? player2.name : "미입장"}</BasicText>
        </Column>
      </Row>
      {/* <BasicText style={{ color: "#3454d1", fontWeight: "bold", position: "absolute", bottom: "-10px", padding: "5px", backgroundColor:"gray" }}>{status}...</BasicText> */}
    </Card>
  }
  //시험 문제
  const ExamCard = ({ item, onClick }) => {
    return <Card $backgroundColor={`${item.id === selected?.id ? "rgba(52, 84, 209, 0.4)" : "white"}`} onClick={onClick}>
      <Title style={{ color: "#3454d1" }}>{item.title}</Title>
      <p>{item.type}</p>
      <p>{item.level}</p>
    </Card>
  }
  return (
    <Container>
      {/* 데이터 없음 */}
      {(!dataList?.length)
        ? <Center><EmptyResult comment={"데이터가 없어요"} /></Center>
        : <CardWrapper>
          {/* 교과/담임 활동 */}
          {type === "activity" && dataList?.map((item) => (<ActiCard key={item.id} item={item} onClick={onClick} />))}
          {/* 업어온 활동 */}
          {type === "copiedActi" && dataList?.map((item) => (<ActiCard key={item.id} item={item} onClick={(item) => onClick(item)} />))}
          {/* 퀴즈 활동*/}
          {type === "quizActi" && dataList?.map((item) => (<ActiCard key={item.id} item={item} onClick={onClick} />))}
          {/* 교과반 */}
          {(type === "subjKlass" || type === "appliedClassList") && dataList?.map((item) => (<KlassCard key={item.id} item={item} onClick={onClick} />))}
          {/* 담임반 */}
          {(type === "homeroom") && dataList?.map((item) => (<KlassCard key={item.id} item={item} onClick={onClick} />))}
          {/* 시험 문제 */}
          {(type === "exam") && dataList?.map((item) => <ExamCard key={item.id} item={item} onClick={() => { navigate(`/exam_item`, { state: item }) }} />)}
          {/* 멤버 */}
          {(type === "member") && dataList?.map((item) => <MemberCard key={item.uid} item={item} onClick={onClick} />)}
          {/* 단어 세트 */}
          {(type === "quiz") && dataList?.map((item) => (<QuizCard key={item.id} item={item} onClick={() => { navigate('/quiz_setting', { state: item }) }} />))}
          {/*펫*/}
          {(type === "pet") && dataList?.map((item, index) => <PetCard key={item.petId} item={item} onClick={() => { onClick(item, index) }} />)}
          {/*몬스터*/}
          {(type === "monster") && dataList?.map((item) => <MonsterCard key={item.level} item={item} onClick={onClick} />)}
          {/*게임방*/}
          {(type === "multiroom") && dataList?.map((item) => <MultiroomCard key={item.gameId} item={item} onClick={onClick} />)}
        </CardWrapper>}
    </Container>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const Center = styled(Column)`
  justify-content: center;
  align-items: center;
`
const Container = styled.div`
  background-color: white;
  border-top: 1px solid rgba(120, 120, 120, 0.5);;
  border-bottom: 1px solid rgba(120, 120, 120, 0.5);
  list-style: none;
  @media screen and (max-width: 768px){
    flex-direction: column;
    align-items: center;
    border: none;
    border-top: 1px solid #3454d1;
    border-bottom: 1px solid #3454d1;
  }
`
const CardWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  @media screen and (max-width: 768px){
    padding: 0;
    margin: 0;
  }
`
const Card = styled.li`
  width: 280px;
  height: 155px;
  margin: 10px;
  padding: 15px 25px;
  border: 1.5px solid  rgb(120, 120, 120, 0.5) ;
  border-radius: 15px;
  cursor: pointer;
  background-color: ${props => props.$backgroundColor || "white"};
  &: hover {
    background-color: ${props => props.$hoverColor || "rgb(52, 84, 209, 0.2)"};
  }
  @media(max-width: 768px) {
    width: 95%;
    height: 70px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    border-radius: 5px;
  }
`
const Title = styled.h5`
  margin: 0 0 8px;
  font-weight: 700;
  overflow: hidden;
  white-space: nowrap;   /* 텍스트를 한 줄로 표시 */
  text-overflow: ellipsis;
  @media(max-width: 768px){
    font-size: 17px;
    margin: 5px 0;
  }
`
const BasicText = styled.p`
  margin: 5px 0;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const Highlight = styled(BasicText)`
  color: #3454d1;
  font-weight: bold;
`
const BigNumber = styled.p`
  font-size: 110px;
  text-align: right;
  color: rgb(52, 84, 209, 0.3);
`
const ProfileImg = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 23px;
`
const IconImg = styled.img`
  width: 30px;
  height: 30px;
  margin-bottom: 7px;
  padding: 1px;
  border: 1px solid rgb(120, 120, 120, 0.5);
  border-radius: 30px;
`
const TagText = styled.p`
  display: inline;
  color: white;
  padding: 3px;
  border-radius: 5px;
  margin-bottom: 4px
`
const QuizNumber = styled.p`
  font-size: 110px;
  text-align: right;
  color: rgb(52, 84, 209, 0.3);
`
export default CardList