//라이브러리
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
//컴포넌트
import CardListItem from './ListItem/CardListItem'
import EmptyResult from '../EmptyResult'
import PetImg from '../PetImg'
//아이콘
import iconImg from '../../image/icon/like_icon.png'
import recycleIcon from '../../image/icon/recycle_icon.png'
import { useSelector } from 'react-redux'

//생성(240109) -> onClick 로직 분리(250122)
const CardList = ({ dataList, type, onClick, selected }) => {
  const user = useSelector(({ user }) => user)
  const navigate = useNavigate();

  //------카드 랜더링----------------------------------------------- 
  //펫 카드
  const PetCard = ({ item, onClick }) => {
    return <Card $backgroundColor={`${item.petId === selected?.petId ? "rgba(52, 84, 209, 0.4)" : "white"}`} onClick={() => { onClick(item) }}>
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
  //과목 활동 카드
  const SubjectActiCard = ({ item, onClick }) => {
    const { title, subject, subjDetail, repeatInfoList, likedCount, madeBy, uid } = item;
    const maskedName = (name) => {
      if (!uid || uid === user.uid) return name
      if (name.length < 2) return name
      return name[0] + '○' + name.slice(2);
    };
    return <Card onClick={() => { onClick(item); }}>
      <Title style={{ color: "#3454d1" }} >{title}</Title>
      <p style={{ margin: "5px 0" }}>{subject}-{subjDetail ? subjDetail : ''}</p>
      <Row style={{ height: "41px", gap: "5px", justifyContent: "flex-end" }}>
        {repeatInfoList && <IconImg alt='반복형' src={recycleIcon} />}
        <IconImg src={iconImg} alt={"받은좋아요"} />
        <p style={{ margin: "4px 0" }}>{likedCount ? likedCount : 0}</p>
      </Row>
      <Row style={{ justifyContent: "flex-end" }}><TagText style={{ backgroundColor: "#3454d1b3" }}>by {madeBy ? `${maskedName(madeBy)} 선생님` : "어떤 선생님"}</TagText></Row>
    </Card >
  }

  return (
    <Container>
      <CardWrapper>
        {/* 데이터 없음 */}
        {(!dataList || dataList.length === 0) && <>
          <EmptyResult comment={"데이터가 없어요"} />
        </>}
        {/* 교사 */}
        {(type === "teacher") && dataList?.map((item) => {
          return (<CardListItem key={item.uid} item={item} onClick={onClick} type={"teacher"} styles={{ backgroundColor: `${item.uid === selected ? "rgba(52, 84, 209, 0.4)" : "white"}` }} />)
        })}
        {/* 교과반 */}
        {(type === "classroom" || type === "appliedClassList") && dataList?.map((item) => {
          return (<CardListItem key={item.id} item={item} onClick={onClick} type={"classroom"} />)
        })}
        {/* 담임반 */}
        {(type === "homeroom") && dataList?.map((item) => {
          return (<CardListItem key={item.id} item={item} onClick={onClick} type={"homeroom"} />)
        })}
        {/* 교과활동 */}
        {type === "activity" && dataList?.map((item) => (<SubjectActiCard item={item} onClick={onClick} />))}
        {/* 업어온 활동 */}
        {type === "copiedActi" && dataList?.map((item) => {
          return (<CardListItem key={item.id} item={item} onClick={() => { navigate(`/activities/${item.id}`, { state: { acti: item } }) }} type={"copiedActi"} styles={{ hoverColor: "rgba(255, 105, 180, 0.2)" }} />)
        })}
        {/* 퀴즈 활동*/}
        {type === "quizActi" && dataList?.map((item) => {
          return (<CardListItem key={item.id} item={item} onClick={onClick} type={"quizActi"} styles={{ hoverColor: "rgba(9, 138, 15,0.2)" }} />)
        })}
        {/* 단어 세트 */}
        {(type === "quiz") && dataList?.map((item) => {
          return (<CardListItem key={item.id} item={item} onClick={() => { navigate('/quiz_setting', { state: item }) }} type={"quiz"} />)
        })}
        {/*펫*/}
        {(type === "pet") && dataList?.map((item) => (<PetCard key={item.petId} item={item} onClick={onClick} />))}
        {/*몬스터*/}
        {(type === "monster") && dataList?.map((item) => (<MonsterCard key={item.level} item={item} onClick={onClick} />))}
      </CardWrapper>
    </Container>
  )
}
const Container = styled.div`
    border-top: 1px solid rgba(120, 120, 120, 0.5);;
    border-bottom: 1px solid rgba(120, 120, 120, 0.5);
    margin: 5px auto 5px;
    list-style: none;
    @media screen and (max-width: 767px){
      flex - direction: column;
    align-items: center;
    padding: 0;
    border: none;
    border-top: 1px solid #3454d1;
    border-bottom: 1px solid #3454d1;
  }
    `
const CardWrapper = styled.ul`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
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
      background - color: ${props => props.$hoverColor || "rgb(52, 84, 209, 0.2)"};
  }
    `
const Row = styled.div`
    display: flex;
    `
const Column = styled(Row)`
    flex-direction: column;
    `
const BasicText = styled.p`
    margin: 0;
    text-align: center;
    `
const Title = styled.h5`
    margin: 0 0 8px;
    font-weight: 700;
    overflow: hidden;
    white-space: nowrap;   /* 텍스트를 한 줄로 표시 */
    text-overflow: ellipsis;
    `
const Highlight = styled(BasicText)`
    color: #3454d1;
    font-weight: 700;
    font-size: larger;
    `
const BigNumber = styled.p`
    font-size: 110px;
    text-align: right;
    color: rgb(52, 84, 209, 0.3);
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
export default CardList