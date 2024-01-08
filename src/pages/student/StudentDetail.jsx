//라이브러리
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { useSelector } from 'react-redux';
//Hooks
import useGetLevel from '../../hooks/useGetLevel';
import useFirestore from '../../hooks/useFirestore';
//컴포넌트
import RadarChart from '../../components/RadarChart';
import AnimatedProgressBar from '../../components/ProgressBar';
//스타일
import styled from 'styled-components';
//이미지
import egg from "../../image/myPet/egg.png";
import green1 from "../../image/myPet/green_pet1.png"
import green2 from "../../image/myPet/green_pet2.png"
import x_btn from "../../image/icon/x_btn.png"

//스타일
const StyledContainer = styled.div`
  box-sizing: border-box;
  width: 80%;
  margin: 0 auto;
  margin-bottom: 50px;
`
const StyledStudentInfoPannel = styled.div`
  height: 1000px;
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
  height: 30%;
  padding: 15px;
  background-color: white;
  border: 1px solid black;
  border-radius: 15px;
`
const StyledBotPannel = styled.div`
  position: relative;
  height: 68%;
  margin-top: 15px;
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
const StyledBotLeftInfo = styled.div`
  position: absolute;
  width: 20%;
  top: 0px;
  bottom: 0px;
  left: 10px;
  margin: 10px auto;
  padding: 15px;
  border: 1px solid black;
  border-radius: 10px;
  overflow-y: scroll
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
  overflow-y: scroll
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
const StyledTitleUl = styled.ul`
  padding: 0;
  p {
    margin-bottom: 2px;
  }
  li {
    margin: 8px auto;
    border: 1px solid black;
    border-radius: 10px;
    height: 89px;
    padding: 2px;
  }
`
const StyledRecordUl = styled.ul`
  li {
    display: flex;
    border: 1px solid whitesmoke;
  }
  img {
    width: 30px;
    height: 30px;
  }
  textarea {
    display: block;
    width: 95%;
    height: 80px;
    padding: 5px;
    margin: 8px auto;
  }
`
const StyledArrowRightBtn = styled.button` 
  float: right;
  position: relative;
  bottom: 500px;
  left: 40px;
  width: 25px;
  height: 25px;
  border: 10px solid #333;
  border-left: 0;
  border-top: 0;
  transform: rotate(315deg);
  opacity: 0.8;
  cursor: pointer;
  &:hover {
    border-color: orange;
    z-index: 1;
    transform: rotate(315deg) scale(1.3);
  }
  opacity: 0.8;
`
const StyledArrowLeftBtn = styled.button` 
  float: left;
  position: relative;
  top: 500px;
  right: 40px;
  width: 25px;
  height: 25px;
  border: 10px solid #333;
  border-left: 0;
  border-top: 0;
  transform: rotate(135deg);
  cursor: pointer;
  &:hover {
    border-color: orange;
    transform: rotate(135deg) scale(1.3);
    z-index: 1;
  }
  opacity: 0.8;
`

const StudentDetail = () => {
  //1.변수
  //url 관련
  const navigate = useNavigate();
  const { state } = useLocation()
  const params = useParams()
  let { studentNumber, actList, writtenName } = state //개별 학생 props 변수
  //전역 변수
  const allActivityList = useSelector(({ allActivities }) => { return allActivities })
  const allStudentList = useSelector(({ allStudents }) => { return allStudents }) //전체 학생 전역 변수
  //hooks
  const { getAbilityScores, getExpAndLevelByActList } = useGetLevel()
  //편집 모드 
  const [isEditable, setIsEditable] = useState(false)
  const { deleteStudent, updateStudent } = useFirestore('classRooms')
  //학생 관련 정보
  const [nthStudent, setNthStudent] = useState(null)
  let expAndLevel = { exp: 0, level: 0 }
  let abilityScores = {}
  const [_studentNumber, setStudentNumber] = useState(null)
  const [_writtenName, setWrittenName] = useState('미등록')
  const [_actList, setActList] = useState(null)
  if (actList) { //기록된 활동이 있다면
    expAndLevel = getExpAndLevelByActList(actList)
    abilityScores = getAbilityScores(actList)
  }
  //객체 접근
  const textAreaRef = useRef({})
  const selectRef = useRef({})

  //2. UseEffect
  useEffect(() => {
    setStudentNumber(studentNumber)
    if (writtenName) {
      setWrittenName(writtenName)
    }
    setActList(actList)
    setNthStudent(allStudentList.findIndex(({ id }) => { return id === params.studentId })) //전체 학생에서 몇번째인지 index 찾는다.
  }, [studentNumber])

  //3.함수
  const moveStudent = (student) => {
    navigate(`/classrooms/${params.id}/${student.id}`, { state: student })
  }

  const handleInputOnChange = (event) => { //이름 수정
    switch (event.target.id) {
      case 'input_name':
        setWrittenName(event.target.value)
        break;
      default: return
    }
  }

  const handleSelectOnchange = (event, index) => { //event는 선택 act Obj
    let newId = event.value //클릭한 새로운 이벤트 id
    if ((_actList.findIndex(({ id }) => { return id === newId })) === -1) {   //기존 활동과 중복된 활동이 아닐 경우에만
      let newAct = allActivityList.find(({ id }) => { return id === newId }) //전체 활동에서 새로운 클릭한 활동과 id가 일치하는 활동을 찾는다.
      let newUserActList = [..._actList.slice(undefined, index), newAct, ..._actList.slice(index + 1)]
      setActList(newUserActList)                                  //기존의 actList에 새로이 클릭된 활동을 집어 넣는다.
      textAreaRef.current[index].value = _actList[index].record  //새로운 활동의 record를 창에 띄운다.
    } else {
      window.alert("중복된 활동으로는 변경할 수 없습니다.")
    }
  }

  const handleBtnClick = (event, act, index) => {
    switch (event.target.id) {
      case "back_btn":
        navigate(`/classrooms/${params.id}`)
        break;
      case "edit_btn":
        setIsEditable(!isEditable)
        break;
      case "delete_btn":
        if (window.confirm('학생을 삭제하시겠습니까? 삭제한 학생은 복구할 수 없습니다.')) {
          deleteStudent(params.id, params.studentId) //데이터 통신
          navigate(-1)
        }
        break;
      case "save_btn":
        if (window.confirm('학생정보를 이대로 저장하시겠습니까?')) {
          let accRecord = ""
          if (_actList) { //누가기록 업데이트
            accRecord = _actList.reduce((acc, cur) => { return acc.concat(" ", String(cur.record)) }, "")
          }
          updateStudent({ writtenName: _writtenName, actList: _actList, accRecord }, params.id, params.studentId); //데이터 통신
        }
        setIsEditable(!isEditable)
        break;
      case "delete_act_btn":
        let newId = act.id;
        let actIndex = _actList.findIndex(({ id }) => { return id === newId });
        _actList.splice(actIndex, 1)
        console.log(_actList)
        textAreaRef.current[index].value = ''
        break;
      case "rightArwBtn":
        if (nthStudent === allStudentList.length - 1) {
          window.alert("마지막 학생입니다.")
          return;
        }
        let nextStudent = allStudentList[nthStudent + 1];
        moveStudent(nextStudent)

        break;
      case "leftArwBtn":
        if (nthStudent === 0) {
          window.alert("첫번째 학생입니다.")
          return;
        }
        let previousStudent = allStudentList[nthStudent - 1];
        moveStudent(previousStudent)
        break;
      default: return
    }
    return null
  }

  return (
    <StyledContainer>
      <StyledArrowLeftBtn id="leftArwBtn" onClick={handleBtnClick} />
      <StyledStudentInfoPannel>
        <StyledTopPannel>
          {expAndLevel.level === 0 && < StyledPetImg src={egg} alt="레벨0 알" />}
          {expAndLevel.level === 1 && < StyledPetImg src={green1} alt="레벨1풀" />}
          {expAndLevel.level === 2 && < StyledPetImg src={green2} alt="레벨2풀" />}
          {expAndLevel.level === 3 && < StyledPetImg src={green2} alt="레벨2풀" />}
          <StyledTopRightInfo>
            <p>학번: {_studentNumber}</p>
            <p>이름: {!isEditable
              ? _writtenName ? _writtenName : '미등록'
              : <input id='input_name' type="text" defaultValue={_writtenName} onChange={handleInputOnChange} />
            }</p>
            <p>레벨: {expAndLevel.level}</p>
            <StyledP>경험치: {expAndLevel.exp}<AnimatedProgressBar exp={expAndLevel.exp} level={expAndLevel.level} /></StyledP>
          </StyledTopRightInfo>
          <StyeldChartDiv>
            <RadarChart abilityScores={abilityScores} />
          </StyeldChartDiv>
        </StyledTopPannel>
        <StyledBotPannel>
          <StyledBotLeftInfo>
            {!isEditable
              ? !_actList || _actList.length === 0 ? <div>활동이 없어유ㅠㅠ</div> : _actList.map((act) => { return <p key={act.id}>{act.title}</p> })
              : !_actList ? <div>활동이 없어유ㅠㅠ</div> :
                <StyledTitleUl>
                  {_actList.map((act, index) => {
                    return <li key={act.id}>
                      <p>{act.title}</p>
                      <Select
                        ref={(element) => { return selectRef.current[index] = element }}
                        options={allActivityList.map((activity) => { return { label: activity.title, value: activity.id } })}
                        onChange={(event) => { handleSelectOnchange(event, index) }} />
                    </li>
                  })}
                </StyledTitleUl>
            }
          </StyledBotLeftInfo>
          <StyledBotRightInfo>
            {!isEditable
              ? !_actList ? <div>기록된 활동이 없습니다.</div> :
                _actList.map((act) => {
                  return <p key={act.id}>{act.record}</p>
                })
              : !_actList ? <div>기록된 활동이 없습니다.</div> :
                <StyledRecordUl>
                  {_actList.map((act, index) => {
                    return <li key={act.id}>
                      <textarea
                        defaultValue={act.record}
                        ref={(element) => { return textAreaRef.current[index] = element }}
                        disabled>
                      </textarea>
                      <img src={x_btn} id='delete_act_btn' alt="삭제" onClick={(event) => { return handleBtnClick(event, act, index) }} />
                    </li>
                  })}
                </StyledRecordUl>
            }
          </StyledBotRightInfo>
        </StyledBotPannel>
      </StyledStudentInfoPannel>
      <StyledArrowRightBtn id="rightArwBtn" onClick={handleBtnClick} />
      <StyeldBtnDiv>
        <StyledBtn id='back_btn' onClick={handleBtnClick}>목록으로</StyledBtn>
        {!isEditable
          ? <StyledBtn id='edit_btn' onClick={handleBtnClick}>수정</StyledBtn>
          : <StyledBtn id='save_btn' onClick={handleBtnClick}>저장</StyledBtn>
        }
        <StyledBtn id='delete_btn' onClick={handleBtnClick}>삭제</StyledBtn>
      </StyeldBtnDiv>
    </StyledContainer>
  )
}

export default StudentDetail