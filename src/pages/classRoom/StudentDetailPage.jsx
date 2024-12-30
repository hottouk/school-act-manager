//라이브러리
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { useSelector } from 'react-redux';
//Hooks
import useGetLevel from '../../hooks/useGetLevel';
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData';
//컴포넌트
import SubNav from '../../components/Bar/SubNav';
import RadarChart from '../../components/RadarChart';
import AnimatedProgressBar from '../../components/ProgressBar';
import SmallBtn from '../../components/Btn/SmallBtn';
import ArrowBtn from '../../components/Btn/ArrowBtn';
import TransparentBtn from '../../components/Btn/TransparentBtn';
import ByteCalculator from '../../components/Etc/ByteCalculator';
//이미지
import x_btn from "../../image/icon/x_btn.png"
import PetImg from '../../components/PetImg';
import useGetMyUserInfo from '../../hooks/useGetMyUserInfo';
import GptModal from '../../components/Modal/gptModal/GptModal';
//스타일
import styled from 'styled-components';
import AnimRotation from '../../anim/AnimRotation';

//2024.07.20 업데이트(코드 간소화 + 기능추가)
const StudentDetailPage = () => {
  //----1.변수부--------------------------------
  //url 관련
  const navigate = useNavigate();
  useEffect(() => { setIsVisible(true) }, [])
  //전역변수(Frozen)
  const user = useSelector((state) => state.user);
  const allStudentList = useSelector((state) => state.allStudents);
  const allActivityList = useSelector((state) => state.allActivities);
  //개별 학생 정보
  const { state } = useLocation()
  const { studentNumber, actList, writtenName, master, subject } = state || {}
  useEffect(() => {
    setStudentNumber(studentNumber)
    if (writtenName) { setWrittenName(writtenName) } //이름 or 미등록
    setSubject(subject)
    setActiList(actList)
    setIsMaster(master === user.uid) //누른 학생 본인 여부 확인
    setNthStudent(allStudentList.findIndex(({ id }) => { return id === params.studentId })) //전체 학생에서 몇 번째인지 index 찾기기
  }, [state])
  const params = useParams()
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
  useEffect(() => { if (!user.isTeacher) { if (user.uid === master) { fetchMyPetInfo(state) } } }, []) //학생만 실행, 펫정보 업데이트
  //에니메이션
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false);

  //----2.함수부--------------------------------
  const getAccRec = () => {
    return _actiList?.reduce((acc, cur) => acc + cur.record, '')
  }
  //학생  이동(24.12.2)
  const moveStudent = (student) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      navigate(`/classrooms/${params.id}/${student.id}`, { state: student })
      setIsAnimating(false);
    }, 500); // 애니메이션 시간과 동일하게 설정
  }
  //활동 순서 변경(24.12.24)
  const moveActiItem = (index, direction) => {
    setActiList((prevActiList) => {
      let newActiList = [...prevActiList];
      let targetIndex = direction === 'up' ? index - 1 : index + 1;
      // 범위를 벗어나면 이동하지 않음
      if (targetIndex < 0 || targetIndex >= newActiList.length) return prevActiList;
      // swap
      [newActiList[index], newActiList[targetIndex]] = [newActiList[targetIndex], newActiList[index]];
      return newActiList;
    });
  };
  //활동 셀렉터 변경시_2
  const updateActiList = (event, index) => {
    let newId = event.value //클릭한 새로운 이벤트 id
    let newActi = allActivityList.find((acti) => { return acti.id === newId }) //전체 활동에서 클릭한 활동과 id가 일치하는 활동을 찾기 -> 원본 반환.
    let acti = { ...newActi }                                                  //★불변성 유지를 위한 복사★ allActivityList는 전역 변수
    setActiList(prevActiList => {
      let newActiList = [...prevActiList.slice(undefined, index), acti, ...prevActiList.slice(index + 1)]
      return newActiList
    })
  }
  //활동 셀렉터 변경 시_1
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
  const handleBtnClick = (event, index) => {
    switch (event.target.id) {
      case "delete_btn": //삭제 버튼
        if (window.confirm('학생을 삭제하시겠습니까? 삭제한 학생은 복구할 수 없습니다.')) {
          deleteStudent(params.id, params.studentId) //데이터 통신
          navigate(-1)
        }
        break;
      case "save_btn":
        if (window.confirm('학생정보를 이대로 저장하시겠습니까?')) { //저장 버튼
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
      case "cancel_btn":
        setActiList(state.actList)
        setWrittenName(state.writtenName)
        setIsModifying(false)
        break;
      case "delete_acti_btn":
        let leftList = _actiList.filter((_, i) => { return i !== index })
        setActiList(leftList)
        break;
      case "right_arw_btn":
        if (nthStudent === allStudentList.length - 1) {
          window.alert("마지막 학생입니다.")
          return;
        }
        let nextStudent = allStudentList[nthStudent + 1];
        moveStudent(nextStudent)
        break;
      case "left_arw_btn":
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

  return (<>
    <SubNav styles={{ padding: "10px" }}>
      <Select
        placeholder="학생 바로 이동"
        options={allStudentList.map((student) => { return { label: `${student.studentNumber} ${student.writtenName || '미등록'}`, value: student.id, key: student.id } })}
        onChange={(event) => { moveStudent(allStudentList.find((student) => student.id === event.value)) }} />
    </SubNav>
    <Container $isVisible={isVisible}>
      <ContentWrapper><ArrowBtn deg={225} onClick={() => { navigate(`/classrooms/${params.id}`) }} /></ContentWrapper>
      <div>
        {(user.isTeacher && !isModifiying) && <FloatLeftWrapper><ArrowBtn id="left_arw_btn" deg={135} onClick={handleBtnClick} /></FloatLeftWrapper>}
        <AnimRotation isAnimating={isAnimating}>
          <StyledBackgroundPannel>
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
              <GridBotContainer>
                <HeaderWrapper>
                  <StyledHeader>순서</StyledHeader>
                  <StyledHeader>활동</StyledHeader>
                  <StyledHeader>생기부</StyledHeader>
                  <StyledHeader>날짜</StyledHeader>
                  <StyledHeader>바이트</StyledHeader>
                </HeaderWrapper>
                {(user.isTeacher || _isMaster) && <>
                  {!_actiList || _actiList.length === 0
                    ? <><div /><div className="no_act_record">활동이 없어요ㅠㅠ</div></>
                    : _actiList.map((acti, index) => {
                      return <GridRowWrapper key={acti.id}>
                        {/* 1열 */}
                        <StyledGridItem>
                          {!isModifiying && index + 1}
                          {isModifiying && <div style={{ display: "flex", flexDirection: "column" }}>
                            <button onClick={() => moveActiItem(index, 'up')}>▲</button>
                            <button onClick={() => moveActiItem(index, 'down')}>▼</button>
                          </div>}
                        </StyledGridItem>
                        {/* 2열 */}
                        <StyledGridItem>
                          <div>
                            <p>{acti.title}</p>
                            {isModifiying && <Select
                              ref={(element) => { return selectRef.current[index] = element }}
                              options={allActivityList.map((activity) => {
                                return { label: activity.title, value: activity.id, key: activity.id }
                              })}
                              onChange={(event) => { handleSelectOnchange(event, index) }} />}
                          </div>
                        </StyledGridItem>
                        {/* 3열 */}
                        <StyledGridItem className="left-align">
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
                              value={acti.record}
                              onChange={(event) => handleTextareaOnChange(event, index)}
                              ref={(element) => { return textAreaRef.current[index] = element }}>
                            </textarea>
                            <SmallBtnWrapper className="gpt">
                              <SmallBtn btnColor="#3454d1" btnName="GPT" btnOnClick={() => { //gpt 버튼
                                setSelectedActi({ acti, index });
                                setIsGptShown(true);
                              }}></SmallBtn>
                              <img src={x_btn} id="delete_acti_btn" alt="삭제x" onClick={(event) => { return handleBtnClick(event, index) }} />
                            </SmallBtnWrapper>
                          </>}
                        </StyledGridItem>
                        {/* 4열 */}
                        <StyledGridItem>{acti.date || '없음'}</StyledGridItem>
                        <StyledGridItem>
                          <ByteCalculator str={_actiList[index].record} styles={{ isTotalByteHide: true }} />
                        </StyledGridItem>
                      </GridRowWrapper>
                    })}
                </>}
                {(!user.isTeacher && !_isMaster) && <div className='no_act_record'>볼 권한이 없습니다. 본인만 열람 가능합니다.</div>}
              </GridBotContainer>
            </StyledBotPannel>
          </StyledBackgroundPannel>
          <TotalByteWrapper>
            <StyledBotBackground>
              <ByteCalculator str={getAccRec()} styles={{ justifyContent: "center", fontSize: "22px", fontColor: "white", width: "81px" }}></ByteCalculator>
            </StyledBotBackground>
          </TotalByteWrapper>
        </AnimRotation>
      </div>
      {/* 교사전용 */}
      {user.isTeacher && <>
        {!isModifiying && <FloatRightWrapper><ArrowBtn id="right_arw_btn" onClick={handleBtnClick} /></FloatRightWrapper>}
        <BtnWrapper>
          {!isModifiying && <TransparentBtn id="edit_btn" btnName="수정" btnOnClick={() => { setIsModifying(!isModifiying) }} />}
          {isModifiying && <TransparentBtn id="save_btn" btnName="저장" btnOnClick={handleBtnClick} />}
          {isModifiying && <TransparentBtn id="cancel_btn" btnName="취소" btnOnClick={handleBtnClick} />}
          <TransparentBtn id="delete_btn" btnOnClick={handleBtnClick} btnName="삭제" />
        </BtnWrapper>
      </>}
    </Container>
    {isGptShown &&
      <GptModal show={isGptShown} acti={selectedActi && selectedActi.acti} setPersonalRecord={setGptRecord} onHide={() => { setIsGptShown(false) }}></GptModal>}
  </>
  )
}
const Container = styled.div`
  opacity: ${(({ $isVisible }) => $isVisible ? 1 : 0)};
  transition: opacity 0.7s ease;
  box-sizing: border-box;
  width: 85%;
  margin: 0 auto;
  margin-bottom: 50px;
  @media screen and (max-width: 767px){
    width: 100%;
    height: 1200px;
    margin: 0;
  }
`
const ContentWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.$marginTop || "30px"};
  margin-bottom: ${(props) => props.$marginBottom || "0"};
`
const StyledBackgroundPannel = styled.div`
  height: 1000px;
  padding: 15px;
  margin: 15px auto 0;
  margin-top: 35px;
  color: black;
  background-color: #3454d1;
  border-radius: 15px;
  border-bottom-right-radius: 0;
  perspective: 1000px; /* 3D 효과를 위한 원근법 */
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
const GridBotContainer = styled.div`
  position: absolute;
  width: 98%;
  top: 0px;
  bottom: 0px;
  left: 10px;  
  margin: 10px auto;
  border: 1px solid black;
  border-radius: 10px;
    display: grid;
  grid-template-columns: 52px 130px 9fr 1fr 1fr;
  grid-template-rows: 40px repeat(auto-fill, minmax(100px, auto));
  overflow-y: scroll
`
const GridRowWrapper = styled.div`
  display: contents;
`
const HeaderWrapper = styled.div` 
  display: contents;
`
const StyledHeader = styled.div`
  display: flex;
  background-color: #3454d1; 
  color: white;
  padding: 10px;
  font-weight: bold;
  justify-content: center;
  &: first-child {
    border-top-left-radius: 5px;
  }
  &: last-child {
    border-top-right-radius: 5px;
  }
`
const StyledGridItem = styled.div`
  display: flex;
  background-color: #efefef;
  padding: 10px;
  color: black;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  justify-content: center;
  align-items: center;
  img {
    width: 30px;
    height: 30px;
    cursor: pointer;
    margin: auto;
  }
  textarea {
    width: 95%;
    height: 100%;
    padding: 5px;
    border-radius: 5px;
  }
  &.left-align { 
    text-align: left;
    justify-content: flex-start;
  }
`
const SmallBtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 2px;
  &.gpt { 
    gap: 12px;
  }
`
const TotalByteWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`
const StyledBotBackground = styled.div`
  background-color: #3454d1;
  height: 50px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 30px;
  margin-bottom: 20px;
  padding: 10px 15px 50px 10px;
}
`
const BtnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`
const FloatRightWrapper = styled.div`
  float: right;
  position: relative;
  bottom: 500px;
  left: 40px;
`
const FloatLeftWrapper = styled.div`
  float: left;
  position: relative;
  top: 500px;
  right: 40px;
`
export default StudentDetailPage