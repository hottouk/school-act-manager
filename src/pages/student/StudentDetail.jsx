//라이브러리
import { useLocation, useNavigate, useParams } from 'react-router-dom'
//Hooks
import useGetLevel from '../../hooks/useGetLevel';
//컴포넌트
import RadarChart from '../../components/RadarChart';
//스타일
import styled from 'styled-components';
//이미지
import egg from "../../image/myPet/egg.png";
import green1 from "../../image/myPet/green_pet1.png"
import green2 from "../../image/myPet/green_pet2.png"
import AnimatedProgressBar from '../../components/ProgressBar';
import { useState } from 'react';
import useFirestore from '../../hooks/useFirestore';

//스타일
const StyledContainer = styled.div`
  box-sizing: border-box;
  width: 80%;
  max-width: 1020px;
  margin: 0 auto;
  margin-bottom: 50px;
`
const StyledStudentInfoPannel = styled.div`
  height: 800px;
  padding: 15px;
  margin: 15px auto;
  margin-top: 35px;
  color: black;
  background-color: royalblue;
  border: 1px solid black;
  border-radius: 20px;
`
const StyledTopPannel = styled.div`
  position: relative;
  height: 40%;
  padding: 15px;
  background-color: white;
  border: 1px solid black;
  border-radius: 15px;
`
const StyledPetImg = styled.img`
  display: inline-block;
  width: 120px;
  height: 120px;
  border: 1px solid black;
`
const StyledTopRightInfo = styled.div`
  position: absolute;
  width: 75%;
  top: 0px;
  bottom: 0px;
  right: 10px;
  margin: 10px auto;
  padding: 15px;
  border: 1px solid black;
  border-radius: 10px;
`
const StyledP = styled.div`
  width: 65%;
`
const StyeldChartDiv = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 25%;
  right: 10px;
  margin: 10px auto;
  padding: 15px;
  border-left: 1px solid black;
`
const StyledBotPannel = styled.div`
  position: relative;
  height: 57%;
  margin-top: 15px;
  padding: 15px;
  background-color: white;
  border: 1px solid black;
  border-radius: 15px;
`
const StyledBotLeftInfo = styled.div`
  position:absolute;
  width: 20%;
  top: 0px;
  bottom: 0px;
  left: 10px;
  margin: 10px auto;
  padding: 15px;
  border: 1px solid black;
  border-radius: 10px;
`
const StyledBotRightInfo = styled.div`
  position: absolute;
  width: 75%;
  top: 0px;
  bottom: 0px;
  right: 10px;
  margin: 10px auto;
  padding: 15px;
  border: 1px solid black;
  border-radius: 10px;
`
const StyledAccRecord = styled.p`
  display: inline;
`
const StyeldBtnDiv = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  width: 250px;
  color: royalBlue;
  background-color: transparent;
  border-radius: 15px;
  border: 2px solid royalBlue;
  padding: 25px;
  `
const StudentDetail = () => {
  const navigate = useNavigate();  //네비
  //url 관련 변수
  const { state } = useLocation()
  const { studentNumber, actList, writtenName, accRecord } = state //props 학생 변수
  const params = useParams() //params
  const { getAbilityScores, getExpAndLevelByActList } = useGetLevel()
  
  //편집 모드
  const [isEditable, setIsEditable] = useState(false)
  const { deleteStudent } = useFirestore('classRooms')

  //레벨과 경험치
  let expAndLevel = { exp: 0, level: 0 }
  let abilityScores = {}
  if (actList) { //기록된 활동이 있다면
    expAndLevel = getExpAndLevelByActList(actList)
    abilityScores = getAbilityScores(actList)
  }

  const handleBtnClick = (event) => {
    switch (event.target.id) {
      case "back_btn":
        navigate(-1)
        break;
      case "edit_btn":
        setIsEditable(!isEditable)
        break;
      case "delete_btn":
        deleteStudent(params.id, params.studentId)
        navigate(-1)
        break;
      default: return
    }
    return null
  }

  return (
    <StyledContainer>
      <StyledStudentInfoPannel>
        <StyledTopPannel>
          {expAndLevel.level === 0 && < StyledPetImg src={egg} alt="레벨0 알" />}
          {expAndLevel.level === 1 && < StyledPetImg src={green1} alt="레벨1풀" />}
          {expAndLevel.level === 2 && < StyledPetImg src={green2} alt="레벨2풀" />}
          {expAndLevel.level === 3 && < StyledPetImg src={green2} alt="레벨2풀" />}
          <StyledTopRightInfo>
            <p>학번: {studentNumber}</p>
            <p>이름: {writtenName ? writtenName : '미등록'}</p>
            <p>레벨: {expAndLevel.level}</p>
            <StyledP>경험치: {expAndLevel.exp}<AnimatedProgressBar exp={expAndLevel.exp} level={expAndLevel.level} /></StyledP>
          </StyledTopRightInfo>
          <StyeldChartDiv>
            <RadarChart abilityScores={abilityScores} />
          </StyeldChartDiv>
        </StyledTopPannel>
        <StyledBotPannel>
          <StyledBotLeftInfo>
            {!actList ? <div>활동 제목</div> : actList.map((act) => {
              return <p>{act.title}</p>
            })}
          </StyledBotLeftInfo>
          <StyledBotRightInfo>
            {accRecord ? accRecord : !actList ? <div>기록 활동이 없습니다.</div> : actList.map((act) => {
              return <StyledAccRecord> {act.record}.</StyledAccRecord>
            })}
          </StyledBotRightInfo>
        </StyledBotPannel>
      </StyledStudentInfoPannel>
      <StyeldBtnDiv>
        <StyledBtn id='back_btn' onClick={handleBtnClick}>목록으로</StyledBtn>
        {!isEditable
          ? <StyledBtn id='edit_btn' onClick={handleBtnClick}>수정</StyledBtn>
          : <StyledBtn id='edit_btn' onClick={handleBtnClick}>저장</StyledBtn>
        }
        <StyledBtn id='delete_btn' onClick={handleBtnClick}>삭제</StyledBtn>
      </StyeldBtnDiv>
    </StyledContainer>
  )
}

export default StudentDetail