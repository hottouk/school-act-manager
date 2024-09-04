//라이브러리
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { useSelector } from 'react-redux';
//Hooks
import useGetLevel from '../../hooks/useGetLevel';
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData';
//컴포넌트
import RadarChart from '../../components/RadarChart';
import AnimatedProgressBar from '../../components/ProgressBar';
import SmallBtn from '../../components/Btn/SmallBtn';
//이미지
import x_btn from "../../image/icon/x_btn.png"
import PetImg from '../../components/PetImg';
import useGetMyUserInfo from '../../hooks/useGetMyUserInfo';
import GptModal from '../../components/Modal/GptModal';
//스타일
import styled from 'styled-components';

//2024.07.20 업데이트(코드 간소화 + 기능추가)
const StudentDetail = () => {
  //1.변수
  //url 관련
  const user = useSelector(({ user }) => user)
  const navigate = useNavigate();
  const { state } = useLocation() //개별 학생 정보
  let { studentNumber, actList, writtenName, master, subject } = state
  useEffect(() => {
    setStudentNumber(studentNumber)
    if (writtenName) { setWrittenName(writtenName) } //이름 or 미등록
    setSubject(subject)
    setActiList(actList)
    setIsMaster(master === user.uid) //누른 학생 본인 여부 확인
    setNthStudent(allStudentList.findIndex(({ id }) => { return id === params.studentId })) //전체 학생에서 몇번째인지 index 찾는다.
  }, [state])
  const params = useParams()
  //전역 변수
  const allActivityList = useSelector(({ allActivities }) => { return allActivities })
  const allStudentList = useSelector(({ allStudents }) => { return allStudents }) //전체 학생 전역 변수
  //hooks
  const { getAbilityScores, getExpAndLevelByActList } = useGetLevel()
  const { fetchMyPetInfo } = useGetMyUserInfo()
  //편집 모드 
  const [isModifiying, setIsModifying] = useState(false)
  const { deleteStudent, updateStudent } = useAddUpdFireData("classRooms")
  //학생 관련 정보
  const [nthStudent, setNthStudent] = useState(null)
  const [_studentNumber, setStudentNumber] = useState(null)
  const [_writtenName, setWrittenName] = useState('미등록')
  const [_actiList, setActiList] = useState(null)
  const [_isMaster, setIsMaster] = useState(false)
  const [_subject, setSubject] = useState('')
  let expAndLevel = { exp: 0, level: 0 }
  let abilityScores = {}
  if (actList) { //기록된 활동이 있다면
    expAndLevel = getExpAndLevelByActList(actList)
    abilityScores = getAbilityScores(actList)
  }
  //객체 접근
  const textAreaRef = useRef({})
  const selectRef = useRef({})
  const divRef = useRef({})
  //GPT 모달
  const [isGptShown, setIsGptShown] = useState(false)
  const [selectedActi, setSelectedActi] = useState(null)
  const [gptRecord, setGptRecord] = useState('')
  useEffect(() => { //GPT 개별화 문구 textArea에 띄우고 새 활동 문구로 저장.
    if (selectedActi) {
      textAreaRef.current[selectedActi.index].value = gptRecord;
      updateAccRecord(selectedActi.index, gptRecord);
    }
  }, [gptRecord])

  useEffect(() => {
    if (!user.isTeacher) { //학생만 실행
      if (user.uid === master) { fetchMyPetInfo(state) }//학생 펫정보 업데이트
    }
  }, [])

  //3.함수
  const moveStudent = (student) => { //학생 화살표 이동
    navigate(`/classrooms/${params.id}/${student.id}`, { state: student })
  }

  //셀렉터 변경시_2
  const updateActiList = (event, index) => {
    let newId = event.value //클릭한 새로운 이벤트 id
    let newActi = allActivityList.find((acti) => { return acti.id === newId }) //전체 활동에서 클릭한 활동과 id가 일치하는 활동을 찾기 -> 원본 반환.
    let acti = { ...newActi }                                                  //★불변성 유지를 위한 복사★ allActivityList는 전역변수
    setActiList(prevActiList => {
      let newActiList = [...prevActiList.slice(undefined, index), acti, ...prevActiList.slice(index + 1)]
      return newActiList
    })
  }

  //셀렉터 변경 시_1
  const handleSelectOnchange = (event, index) => { //event는 선택 acti Obj
    if ((_actiList.findIndex(({ id }) => { return id === event.value })) === -1) {  //기존 활동과 중복된 활동이 아닌 경우만
      updateActiList(event, index)
    } else {
      window.alert("중복된 활동으로는 변경할 수 없습니다.")
    }
  }

  //textarea 변경 (gpt, 수기 변경)
  const updateAccRecord = (index, newRec) => {
    setActiList(prevActiList => {
      let newActiList = [...prevActiList];
      newActiList[index].record = newRec;
      return newActiList;
    })
  }

  //textarea 수기 변경
  const handleTextareaOnChange = (event, index) => {
    updateAccRecord(index, event.target.value)
  }

  const handleBtnClick = (event, acti, index) => {
    switch (event.target.id) {
      case "back_btn":
        navigate(`/classrooms/${params.id}`)
        break;
      case "edit_btn":
        setIsModifying(!isModifiying)
        break;
      case "delete_btn":
        if (window.confirm('학생을 삭제하시겠습니까? 삭제한 학생은 복구할 수 없습니다.')) {
          deleteStudent(params.id, params.studentId) //데이터 통신
          navigate(-1)
        }
        break;
      case "save_btn":
        if (window.confirm('학생정보를 이대로 저장하시겠습니까?')) { //저장 클릭
          let accRecord = ""
          accRecord = _actiList.map(item => item.record).join(" "); // 누가기록 업데이트
          const newStudentData = { writtenName: _writtenName, actList: _actiList, accRecord };
          updateStudent(newStudentData, params.id, params.studentId);
        } else { //취소 클릭
          setActiList(state.actList)
          setWrittenName(state.writtenName)
        }
        setIsModifying(false)
        break;
      case "delete_acti_btn":
        let leftList = _actiList.filter((_, i) => { return i !== index })
        setActiList(leftList)
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
      {user.isTeacher && <StyledArrowLeftBtn id="leftArwBtn" onClick={handleBtnClick} />}
      <StyledStudentInfoPannel>
        <StyledTopPannel>
          <PetImg subject={_subject} level={expAndLevel.level} onClick={() => { }} />
          <StyledTopRightInfo>
            <p>학번: {_studentNumber}</p>
            <p>이름: {!isModifiying
              ? _writtenName ? _writtenName : '미등록'
              : <input id="input_name" type="text" defaultValue={_writtenName} onChange={(event) => {
                setWrittenName(event.target.value)
              }} />
            }</p>
            <p>레벨: {expAndLevel.level}</p>
            <StyledProgressDiv>경험치: {expAndLevel.exp}<AnimatedProgressBar exp={expAndLevel.exp} level={expAndLevel.level} /></StyledProgressDiv>
          </StyledTopRightInfo>
          <StyeldChartDiv>
            <RadarChart abilityScores={abilityScores} />
          </StyeldChartDiv>
        </StyledTopPannel>
        <StyledBotPannel>
          <StyledBotGridContainer>
            <StyledTitleRow>
              <StyledMidlDiv>활동</StyledMidlDiv>
              <AccWrapper style={{ justifyContent: "center" }}>생기부</AccWrapper>
            </StyledTitleRow>
            {(user.isTeacher || _isMaster) && <>
              {!_actiList || _actiList.length === 0 ? <div className="no_act_record">활동이 없어요ㅠㅠ</div>
                : _actiList.map((acti, index) => {
                  return <StyledContentRow key={acti.id} ref={(element) => { return divRef.current[index] = element }} >
                    <StyledMidlDiv>
                      <div>
                        <p>{acti.title}</p>
                        {isModifiying && <Select
                          ref={(element) => { return selectRef.current[index] = element }}
                          options={allActivityList.map((activity) => {
                            return { label: activity.title, value: activity.id, key: activity.id }
                          })}
                          onChange={(event) => { handleSelectOnchange(event, index) }} />}
                      </div>
                    </StyledMidlDiv>
                    <AccWrapper>
                      {!isModifiying && <span>{acti.record}</span>}
                      {isModifiying && <> {/*수정할때*/}
                        {acti.perfRecordList && <SmallBtnWrapper>
                          <SmallBtn btnName="상" btnOnClick={() => {
                            updateAccRecord(index, acti.perfRecordList[0])
                            textAreaRef.current[index].value = acti.perfRecordList[0];
                          }} />
                          <SmallBtn btnName="중" btnOnClick={() => {
                            updateAccRecord(index, acti.perfRecordList[1])
                            textAreaRef.current[index].value = acti.perfRecordList[1];
                          }} />
                          <SmallBtn btnName="하" btnOnClick={() => {
                            updateAccRecord(index, acti.perfRecordList[2])
                            textAreaRef.current[index].value = acti.perfRecordList[2];
                          }} />
                          <SmallBtn btnName="최하" btnOnClick={() => {
                            updateAccRecord(index, acti.perfRecordList[3])
                            textAreaRef.current[index].value = acti.perfRecordList[3];
                          }} />
                        </SmallBtnWrapper>}
                        <textarea
                          defaultValue={acti.record}
                          onChange={(event) => handleTextareaOnChange(event, index)}
                          ref={(element) => { return textAreaRef.current[index] = element }}>
                        </textarea>
                        <SmallBtn btnColor="#3454d1" btnName="GPT" btnOnClick={() => { //gpt 버튼
                          setSelectedActi({ acti, index });
                          setIsGptShown(true);
                        }}></SmallBtn>
                        <img src={x_btn} id="delete_acti_btn" alt="삭제x" onClick={(event) => { return handleBtnClick(event, acti, index) }} />
                      </>}
                    </AccWrapper>
                  </StyledContentRow>
                })}
            </>}
            {(!user.isTeacher && !_isMaster) && <div className='no_act_record'>볼 권한이 없습니다. 본인만 열람 가능합니다.</div>}
          </StyledBotGridContainer>
        </StyledBotPannel>
      </StyledStudentInfoPannel>
      {/* 교사전용 */}
      {user.isTeacher && <>
        <StyledArrowRightBtn id="rightArwBtn" onClick={handleBtnClick} />
        <StyeldBtnDiv>
          <StyledBtn id='back_btn' onClick={handleBtnClick}>목록</StyledBtn>
          {!isModifiying
            ? <StyledBtn id='edit_btn' onClick={handleBtnClick}>수정</StyledBtn>
            : <StyledBtn id='save_btn' onClick={handleBtnClick}>저장</StyledBtn>
          }
          <StyledBtn id='delete_btn' onClick={handleBtnClick}>삭제</StyledBtn>
        </StyeldBtnDiv>
      </>}
      {/* 학생전용 */}
      {!user.isTeacher &&
        <StyeldBtnDiv>
          <StyledBtn id='back_btn' onClick={handleBtnClick} $width="100%">목록</StyledBtn>
        </StyeldBtnDiv>
      }
      {isGptShown &&
        <GptModal show={isGptShown} acti={selectedActi && selectedActi.acti} setPersonalRecord={setGptRecord} onHide={() => { setIsGptShown(false) }}></GptModal>}
    </StyledContainer>
  )
}
const StyledContainer = styled.div`
  box-sizing: border-box;
  width: 80%;
  margin: 0 auto;
  margin-bottom: 50px;
  @media screen and (max-width: 767px){
    width: 100%;
    height: 1200px;
    margin: 0;
  }
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
  @media screen and (max-width: 767px){
    margin-top: 0;
    border: none;
    border-radius: 0;
  }
`
const StyledTopPannel = styled.div`
  position: relative;
  height: 30%;
  padding: 15px;
  background-color: #efefef;
  border: 1px solid black;
  border-radius: 15px;
  img {
  display: inline-block;
    width: 120px;
    height: 120px;
    padding: 7px;
    border: 1px solid black;
    border-radius: 60px;
    background-color: white;
  @media screen and (max-width: 767px){
    width: 80px;
    height: 80px;
    border-radius: 40px;
  }
  }
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
  #input_name {
    height: 35px;
    border-radius: 10px;
  }
   @media screen and (max-width: 767px){
    width: 100%;
    height: 64%;
    top: 95px;
    bottom: 0;
    right: 0;
    border: none;
    border-radius: 0;
    p { 
      margin-bottom: 8px;
    }
    p input {
      width: 25%
    }
  }
`
const StyledProgressDiv = styled.div`
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
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px solid black;
  @media screen and (max-width: 767px){
    width: 60%;
    align-items: flex-start;
    border-left: none;
    canvas { 
      border: 1px solid black;
      border-radius: 15px;
    }
  }
`
const StyledBotPannel = styled.div`
  position: relative;
  height: 68%;
  margin-top: 15px;
  padding: 15px;
  background-color: #efefef;
  border: 1px solid black;
  border-radius: 15px;
  .no_act_record {
    margin: auto;
    font-weight: bold;
  }
  @media screen and (max-width: 767px){
    width: 100%;
    display: flex;
    flex-direction: column;
  }
`
const StyledBotGridContainer = styled.div`
position: absolute;
  width: 98%;
  top: 0px;
  bottom: 0px;
  left: 10px;  
  margin: 10px auto;
  border: 1px solid black;
  border-radius: 10px;
display: grid;
  grid-template-rows: 40px;
  grid-auto-rows: minmax(5px, 120px);  
  overflow-y: scroll
`
const StyledTitleRow = styled.div`
  display: flex;
  background-color: #3454d1; 
  color: white;
`
const StyledContentRow = styled.li`
  display: flex;
  background-color: ${(props) => props.color};
  img {
    width: 30px;
    height: 30px;
    cursor: pointer;
    margin: auto;
  }
`
const StyledMidlDiv = styled.div`
  flex-shrink: 0;
  flex-basis: 130px;
display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  text-align: center;
  p {
    margin: 0;
  }
  @media screen and (max-width: 767px){
    flex-basis: 65px;
  }
`
const AccWrapper = styled.div`
  flex-grow: 1;
  justify-content: center;
  padding: 0 5px;
  word-wrap: break-word;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  textarea {
    width: 95%;
    height: 100%;
    padding: 5px;
  }
  button {
    margin: 0 7px;
  }
  overflow-y: auto;
  @media screen and (max-width: 767px){
    width: 0;
  }
`
const SmallBtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 2px;
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
  width: ${(props) => { return props.$width ? props.$width : "250px" }};
  color: royalBlue;
  background-color: transparent;
  border-radius: 15px;
  border: 2px solid royalBlue;
  padding: 25px;
  @media screen and (max-width: 767px){
    width: 110px;
    height: 40px;
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
  @media screen and (max-width: 767px){
    display: none;
  }
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
  @media screen and (max-width: 767px){
    display: none;
  }
`
export default StudentDetail