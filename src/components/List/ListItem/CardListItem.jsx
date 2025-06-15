//라이브러리
import styled from 'styled-components'
//이미지
import iconImg from '../../../image/icon/like_icon.png'
import unknownIcon from '../../../image/icon/unkown_icon.png'
import recycleIcon from '../../../image/icon/recycle_icon.png'
//생성(250118)
const CardListItem = ({ item, onClick, type, styles }) => {
  const hoverColor = styles?.hoverColor
  const backgroundColor = styles?.backgroundColor

  return (
    <Container $hoverColor={hoverColor} $backgroundColor={backgroundColor} onClick={() => { onClick(item) }}    >
      {/* 교사 */}
      {type === "teacher" && <>
        <Row style={{ flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
          <Row style={{ justifyContent: "flex-start", alignItems: "center" }}>
            <StyledImg src={item.profileImg || unknownIcon} alt='프로필' />
            <Title style={{ color: "#3454d1", margin: "0 20px" }}>{item.name}</Title>
          </Row>
          <p>{item.email}</p>
        </Row></>}
      {/* 교과 클래스 */}
      {type === "classroom" && <>
        <Title style={{ color: "#3454d1" }}>{item.classTitle}</Title>
        <p style={{ marginBottom: "20px" }}>{item.intro}</p>
        <p>{item.subject ? `${item.subject}과` : "교사가 삭제한 클래스입니다."}{item.subjDetail ? '-' + item.subjDetail : ''} </p></>}
      {/* 담임 클래스 */}
      {type === "homeroom" && <>
        <Title style={{ color: "#3454d1" }}>{item.classTitle}</Title>
        <Row style={{ justifyContent: "flex-start", marginBottom: "20px" }}>
          <h5 style={{ color: "#3454d1" }}>{item.grade}</h5><span>학년</span>
          <h5 style={{ color: "#3454d1" }}>{item.classNumber}</h5><span>반</span></Row>
        <p>{item.intro}</p></>}
      {/* 엑티비티 */}
      {type === "subjActi" && <>
        <Title style={{ color: "#3454d1" }} >{item.title}</Title>
        <p style={{ margin: "5px 0" }}>{item.subject}{item.subjDetail ? '-' + item.subjDetail : ''}</p>
        <Row style={{ height: "41px", gap: "5px", justifyContent: "flex-end" }}>
          {item.repeatInfoList && <StyledIconImg alt='반복형' src={recycleIcon} />}
          <StyledIconImg src={iconImg} alt={"받은좋아요"} />
          <p style={{ margin: "4px 0" }}>{item.likedCount ? item.likedCount : 0}</p>
        </Row>
        <Row style={{ justifyContent: "flex-end" }}><MadeByTagText style={{ backgroundColor: "#3454d1b3" }}>by {item.madeBy ? `${item.madeBy} 선생님` : "어떤 선생님"}</MadeByTagText></Row></>}
      {/* 업어온 활동 */}
      {type === "copiedActi" && <>
        <Title style={{ color: "#FF69B4" }} >{item.title}</Title>
        <p style={{ margin: "5px 0" }}>{item.subject}{item.subjDetail ? '-' + item.subjDetail : ''}</p>
        <Row style={{ height: "75px", alignItems: "flex-end", justifyContent: "flex-end" }}><MadeByTagText style={{ backgroundColor: "#FF69B4" }}>by {item.madeBy ? `${item.madeBy} 선생님` : "어떤 선생님"}</MadeByTagText></Row></>}
      {/* 퀴즈 활동 */}
      {type === "quizActi" && <>
        <Title style={{ color: "#098a0f" }} >{item.title}</Title>
        <p style={{ margin: "5px 0" }}>{item.subject}{item.subjDetail ? '-' + item.subjDetail : ''}</p>
        <Row style={{ height: "41px", justifyContent: "space-between" }}>
          <StyledText>{item?.quizInfo?.quizList?.length} 문제</StyledText>
          <Row>
            <StyledIconImg src={iconImg} alt={"받은좋아요"} />
            <p style={{ margin: "4px 0" }}>{item.likedCount ? item.likedCount : 0}</p>
          </Row>
        </Row>
        <Row style={{ justifyContent: "flex-end" }}><MadeByTagText style={{ backgroundColor: "#098a0f" }}>by {item.madeBy ? `${item.madeBy} 선생님` : "어떤 선생님"}</MadeByTagText></Row></>}
      {/* 퀴즈 세트 */}
      {type === "quiz" && <>
        <Title style={{ color: "#3454d1" }} >{item.title}</Title>
        <p style={{ margin: "5px 0" }}>{item.subject}{item.subjDetail ? '-' + item.subjDetail : ''}</p>
        <StyledNumber style={{ margin: "-60px -15px" }}>{item.quizList.length}</StyledNumber></>}
    </Container >
  )
}
const Container = styled.li`
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
`
const Row = styled.div`
  display: flex;
`
const StyledImg = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 23px;
`
const Title = styled.h5`
  margin: 0 0 8px;
  font-weight: 700;
  overflow: hidden;
  white-space: nowrap;   /* 텍스트를 한 줄로 표시 */
  text-overflow: ellipsis; 
`
const StyledText = styled.p`
  margin: 0;
`
const MadeByTagText = styled.p`
  display: inline;
  color: white;
  padding: 3px;
  border-radius: 5px;
  margin-bottom: 4px
`
const StyledIconImg = styled.img`
  width: 30px;
  height: 30px; 
  margin-bottom: 7px;
  padding: 1px;
  border: 1px solid rgb(120, 120, 120, 0.5);
  border-radius: 30px;
`
const StyledNumber = styled.p`
  font-size: 110px;
  text-align: right;
  color: rgb(52, 84, 209, 0.3);
`
export default CardListItem
