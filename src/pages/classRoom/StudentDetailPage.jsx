//라이브러리
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
//섹션
import PetInfoSection from './PetInfoSection';
//컴포넌트
import SubNav from '../../components/Bar/SubNav';
import SmallBtn from '../../components/Btn/SmallBtn';
import ArrowBtn from '../../components/Btn/ArrowBtn';
import TransparentBtn from '../../components/Btn/TransparentBtn';
import ByteCalculator from '../../components/Etc/ByteCalculator';
import GptModal from '../../components/Modal/gptModal/GptModal';
import BackBtn from '../../components/Btn/BackBtn';
//hooks
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData';
import useFetchRtPetDoc from '../../hooks/RealTimeData/useFetchRtPetData';
import useFirePetData from '../../hooks/Firebase/useFirePetData';
import useFireUserData from '../../hooks/Firebase/useFireUserData';
//이미지
import x_btn from "../../image/icon/x_btn.png"
import arrows_icon from "../../image/icon/arrows_icon.png"
//효과
import AnimRotation from '../../anim/AnimRotation';

//코드 간소화 및 기능추가(240720)-> 펫 동기화(250207)-> 코드 정리 및 버그 수정(250223)
const StudentDetailPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  //객체 접근
  const selectRef = useRef({});
  useEffect(() => { setIsVisible(true); }, [])
  //전역변수(Frozen)
  const user = useSelector(({ user }) => user);
  const allStudentList = useSelector((state) => state.allStudents);
  const allActivityList = useSelector((state) => state.allActivities);
  const { updatePetInfo } = useFirePetData();
  const { updateUserPetInfo } = useFireUserData();
  //실시간 학생 pet 정보
  const { pet: petData } = useFetchRtPetDoc(params.id, params.studentId);
  useEffect(() => {
    checkUser();
    setNthStudent(allStudentList.findIndex(({ id }) => { return id === params.studentId })); //전체 학생에서 몇 번째인지 index 찾기
    syncPetInfo();
    bindData();
  }, [petData])
  //hooks
  //편집 모드 
  const [isModifying, setIsModifying] = useState(false)
  const { deleteStudent, updateStudent } = useAddUpdFireData("classRooms")
  //학생 관련 정보
  const [nthStudent, setNthStudent] = useState(null);
  const [_writtenName, setWrittenName] = useState('미등록');
  const [_actiList, setActiList] = useState(null);
  const [_addOnActi, setAddOnActi] = useState(null);
  const [isMaster, setIsMaster] = useState(false);
  //GPT 모달
  const [isGptShown, setIsGptShown] = useState(false)
  const [selectedActi, setSelectedActi] = useState(null)
  const [gptRecord, setGptRecord] = useState('')
  useEffect(() => { if (selectedActi) { changeAccRecord(selectedActi.index, gptRecord); } }, [gptRecord]) //GPT 개별화 문구 textArea에 띄우고 새 활동 문구로 저장.
  //에니메이션
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false);

  //------함수부------------------------------------------------  
  const bindData = () => {
    if (!petData) return;
    const { writtenName, actList } = petData;
    if (writtenName) { setWrittenName(writtenName) }; //이름 or 미등록
    setActiList([...actList || []]);
  }
  //학생 본인 id가 아닐 경우 back
  const checkUser = () => {
    if (user.isTeacher || !petData) return;
    const { master } = petData;
    if (master?.studentId === user.uid) { setIsMaster(true); }
    else { navigate(-1); }
  }
  //펫 동기화
  const syncPetInfo = () => {
    if (user.isTeacher || !petData || !user) return;
    const confirm = window.confirm("펫 정보를 동기화 하시겠습니까?")
    if (confirm) {
      const actiList = { actList: petData.actList }
      const myPetList = user.myPetList;
      if (!myPetList) return;
      const myPet = myPetList.find((item) => { return item.petId === params.studentId });
      updatePetInfo(params.id, params.studentId, myPet); //pet 업데이트
      updateUserPetInfo(params.studentId, actiList);     //user 업데이트
    }
  }
  //실시간 acc
  const getAccRec = () => { return _actiList?.reduce((acc, cur) => acc + cur.record, '') }
  //학생 이동(241202)
  const moveStudent = (student) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      navigate(`/classrooms/${params.id}/${student.id}`)
      setIsAnimating(false);
    }, 500); // 애니메이션 시간과 동일하게 설정
  }

  //활동 순서 변경(241224)
  const moveActiItem = (index, direction) => {
    setActiList((prevActiList) => {
      const newActiList = [...prevActiList];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      // 범위를 벗어나면 이동하지 않음
      if (targetIndex < 0 || targetIndex >= newActiList.length) return prevActiList;
      // swap
      [newActiList[index], newActiList[targetIndex]] = [newActiList[targetIndex], newActiList[index]];
      return newActiList;
    });
  };
  //셀렉터 체크
  const check = (event) => {
    if ((_actiList.findIndex(({ id }) => id === event.value.id)) === -1) { return { isValid: true, msg: "같은 활동 없음" } }
    else { return { isValid: false, msg: "중복된 활동입니다." } };
  }
  //활동 셀렉터 변경
  const handleSelectOnchange = (event, index) => {
    const result = check(event);
    if (result.isValid) {
      const assignedDate = new Date().toISOString().split('T')[0];
      const selected = event.value;
      const { byte, studentDoneList, particiList, particiSIdList, likedCount, isPrivate, isHomework, createdTime, ...rest } = selected; //★필요한 prop만 사용하고 제외 및 불변성 보존★ allActivityList는 전역 변수
      const newActi = { ...rest, assignedDate };
      const newActiList = [..._actiList.slice(undefined, index), newActi, ..._actiList.slice(index + 1)];
      setActiList(newActiList);
    } else { window.alert(result.msg); };
  }
  //활동 추가 셀렉터 변경
  const handleAddOnSelectOnChange = (event) => {
    const result = check(event);
    if (result.isValid) {
      const assignedDate = new Date().toISOString().split('T')[0];
      const { byte, studentDoneList, particiList, particiSIdList, likedCount, isPrivate, isHomework, createdTime, ...rest } = event.value;
      setAddOnActi({ ...rest, assignedDate });
    } else { window.alert(result.msg); };
  }
  //활동 추가
  const handleAddActiOnClick = () => {
    const newList = [..._actiList, _addOnActi];
    setActiList(newList);
  }
  //textarea 변경 (gpt, 수기 변경)
  const changeAccRecord = (index, newRec) => {
    const curActi = _actiList[index];
    const newActi = { ...curActi, record: newRec };
    setActiList(prevActiList => {
      const newActiList = [...prevActiList.slice(undefined, index), newActi, ...prevActiList.slice(index + 1)]
      return newActiList;
    })
  }
  //textarea 수기 변경
  const handleTextareaOnChange = (event, index) => {
    changeAccRecord(index, event.target.value);
  }
  //저장
  const handleSaveOnClick = () => {
    if (window.confirm('학생정보를 이대로 저장하시겠습니까?')) {   //저장 버튼
      let accRecord = ""
      accRecord = _actiList.map(item => item.record).join(" "); // 누가기록 업데이트
      const newStudentData = { writtenName: _writtenName, actList: _actiList, accRecord };
      updateStudent(newStudentData, params.id, params.studentId);
    } else { //취소 클릭
      bindData();
    }
    setIsModifying(false)
  }
  //취소
  const handleCancelOnClick = () => {
    bindData();
    setIsModifying(false);
  }
  //활동 삭제
  const handleDeleteActiOnClick = (index) => {
    const leftList = _actiList.filter((_, i) => { return i !== index })
    setActiList(leftList)
  }
  //학생 삭제
  const handleStudentDeleteOnClick = () => {
    if (window.confirm('학생을 삭제하시겠습니까? 삭제한 학생은 복구할 수 없습니다.')) {
      deleteStudent(params.id, params.studentId) //데이터 통신
      navigate(-1)
    }
  }
  //화살표 버튼
  const handleArrowBtnOnClick = (event, index) => {
    switch (event.target.id) {
      case "right_arw_btn":
        if (nthStudent === allStudentList.length - 1) {
          window.alert("마지막 학생입니다.")
          return;
        }
        const nextStudent = allStudentList[nthStudent + 1];
        moveStudent(nextStudent)
        break;
      case "left_arw_btn":
        if (nthStudent === 0) {
          window.alert("첫번째 학생입니다.")
          return;
        }
        const previousStudent = allStudentList[nthStudent - 1];
        moveStudent(previousStudent)
        break;
      default: return
    }
  }

  //------랜더링------------------------------------------------  
  //교사
  const TeacherActiRow = ({ item, index }) => {
    const { title, record, madeBy, assignedDate } = item;
    return (
      <GridRow>
        <GridItem>{index + 1}</GridItem>
        <GridItem><p style={{ margin: "0" }}>{title}</p></GridItem>
        <GridItem className="left-align"><span>{record}</span></GridItem>
        <GridItem>{assignedDate || '없음'}</GridItem>
        <GridItem>{madeBy || '익명'}</GridItem>
        <GridItem><ByteCalculator str={record} styles={{ isTotalByteHide: true }} /></GridItem>
      </GridRow>)
  }

  return (<>
    <SubNav styles={{ padding: "10px" }}>
      {user.isTeacher && <Select
        placeholder="학생 바로 이동"
        options={allStudentList.map((student) => { return { label: `${student.studentNumber} ${student.writtenName || '미등록'}`, value: student.id, key: student.id } })}
        onChange={(event) => { moveStudent(allStudentList.find((student) => student.id === event.value)) }}
        isDisabled={isModifying}
      />}
      {!user.isTeacher && <BackBtn />}
    </SubNav>
    {/* 컨테이너 */}
    <Container $isVisible={isVisible}>
      {user.isTeacher && <CenterWrapper><ArrowBtn deg={225} onClick={() => { navigate(`/classrooms/${params.id}`) }} /></CenterWrapper>}
      <FlexWrapper>
        {(user.isTeacher && !isModifying) && <ArrowWrapper><ArrowBtn id="left_arw_btn" deg={135} onClick={handleArrowBtnOnClick} /></ArrowWrapper>}
        <AnimRotation isAnimating={isAnimating}>
          <StyledBackgroundPannel>
            <PetInfoSection
              petName={petData?.petName} desc={petData?.desc} levelInfo={petData?.level} path={petData?.path}
              subject={petData?.subject} studentNumber={petData?.studentNumber} master={petData?.master} writtenName={_writtenName}
              isModifiying={isModifying} setWrittenName={setWrittenName} />
            {(user.isTeacher || isMaster) && <GrayBotPannel>
              <GridBotContainer>
                <GridRow>
                  <StyledHeader>연번</StyledHeader>
                  <StyledHeader>활동</StyledHeader>
                  <StyledHeader>생기부</StyledHeader>
                  <StyledHeader>{!isModifying ? "날짜" : "성취도"}</StyledHeader>
                  <StyledHeader>{!isModifying ? "기록자" : "변경"}</StyledHeader>
                  <StyledHeader>바이트</StyledHeader>
                </GridRow>
                {!_actiList || _actiList.length === 0
                  ? <GridItem style={{ gridColumn: "1/7" }}>활동이 없어요ㅠㅠ</GridItem>
                  : _actiList.map((item, index) => {
                    const { record, perfRecordList, uid } = item;
                    const { userStatus } = user;
                    return <React.Fragment key={item.id}>
                      {(!isModifying || (isModifying && user.uid !== uid && userStatus !== "master")) && <TeacherActiRow item={item} index={index} />}
                      {(isModifying && (userStatus === "master" || (userStatus === "coTeacher" && user.uid === uid))) && <GridRow>
                        {/* 1열 */}
                        <GridItem>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <button onClick={() => moveActiItem(index, 'up')}>▲</button>
                            <button onClick={() => moveActiItem(index, 'down')}>▼</button>
                          </div>
                        </GridItem>
                        {/* 2열 */}
                        <GridItem>
                          <Select
                            ref={(ele) => selectRef.current[index] = ele}
                            options={allActivityList.map((item) => { return { label: item.title, value: item } })}
                            onChange={(event) => { handleSelectOnchange(event, index) }} />
                        </GridItem>
                        {/* 3열 */}
                        <GridItem className="left-align">
                          <StyledTextarea
                            value={_actiList[index].record}
                            onChange={(event) => handleTextareaOnChange(event, index)} />
                        </GridItem>
                        {/* 4열 */}
                        <GridItem>{perfRecordList && <SmallBtnWrapper>
                          <SmallBtn btnName="상" btnOnClick={() => { changeAccRecord(index, perfRecordList[0]) }} />
                          <SmallBtn btnName="중" btnOnClick={() => { changeAccRecord(index, perfRecordList[1]) }} />
                          <SmallBtn btnName="하" btnOnClick={() => { changeAccRecord(index, perfRecordList[2]) }} />
                          <SmallBtn btnName="최하" btnOnClick={() => { changeAccRecord(index, perfRecordList[3]) }} />
                        </SmallBtnWrapper>}</GridItem>
                        {/* 5열 */}
                        <GridItem><SmallBtnWrapper className="gpt">
                          <SmallBtn btnColor="#3454d1" btnName="GPT" btnOnClick={() => { //gpt 버튼
                            setSelectedActi({ item, index });
                            setIsGptShown(true);
                          }}></SmallBtn>
                          <img src={x_btn} id="delete_acti_btn" alt="삭제x" onClick={(event) => handleDeleteActiOnClick(index)} />
                        </SmallBtnWrapper>
                        </GridItem>
                        {/* 6열 */}
                        <GridItem><ByteCalculator str={record} styles={{ isTotalByteHide: true }} /></GridItem>
                      </GridRow>}
                    </React.Fragment>
                  })}
                {isModifying && <GridRow>
                  <GridItem style={{ gridColumn: "1/7", gap: "20px" }} >
                    <Select
                      options={allActivityList.map((item) => { return { label: item.title, value: item } })}
                      onChange={handleAddOnSelectOnChange} />
                    <SmallBtn onClick={handleAddActiOnClick}>추가</SmallBtn>
                  </GridItem>
                </GridRow>}
              </GridBotContainer>
              {(_actiList && _actiList.length !== 0) && <>
                <CenterWrapper><img src={arrows_icon} alt="아래화살표" /></CenterWrapper>
                {user.isTeacher && <StyledAcc>{getAccRec()}</StyledAcc >}</>}
            </GrayBotPannel>}
          </StyledBackgroundPannel>
          <TotalByteWrapper>
            <StyledBotBackground>
              <ByteCalculator str={getAccRec()} styles={{ justifyContent: "center", fontSize: "22px", fontColor: "white", width: "81px" }}></ByteCalculator>
            </StyledBotBackground>
          </TotalByteWrapper>
        </AnimRotation>
        {(user.isTeacher && !isModifying) && <ArrowWrapper><ArrowBtn id="right_arw_btn" onClick={handleArrowBtnOnClick} /></ArrowWrapper>}
      </FlexWrapper>
      {/* 교사전용 */}
      {user.isTeacher && <BtnWrapper>
        {!isModifying && <>
          <TransparentBtn onClick={() => { setIsModifying(!isModifying) }} styles={{ width: "200px" }}>수정</TransparentBtn>
          <TransparentBtn onClick={handleStudentDeleteOnClick} styles={{ width: "200px" }}>삭제</TransparentBtn></>}
        {isModifying && <>
          <TransparentBtn onClick={handleSaveOnClick} styles={{ width: "200px" }}>저장</TransparentBtn>
          <TransparentBtn onClick={handleCancelOnClick} styles={{ width: "200px" }}>취소</TransparentBtn>
        </>}
      </BtnWrapper>}
    </Container >
    {/* 모달 */}
    {isGptShown && <GptModal show={isGptShown} acti={selectedActi.item} setPersonalRecord={setGptRecord} onHide={() => { setIsGptShown(false) }}></GptModal>}
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
const Row = styled.div`
  display: flex;
`
const CenterWrapper = styled(Row)`
  justify-content: center;
`
const FlexWrapper = styled(Row)`
  position: relative;
  margin-bottom: ${(props) => props.$marginBottom || "0"};
  gap: 10px;
  justify-content: center;
`
const ArrowWrapper = styled(Row)`
  align-items: center;
`
const StyledBackgroundPannel = styled.div`
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
const GrayBotPannel = styled.div`
  position: relative;
  margin-top: 15px;
  padding: 15px;
  background-color: #efefef;
  border-radius: 15px;
  display; flex;
  flex-direction: column;
  overflow-y: scroll;
   @media screen and (max-width: 767px){
    width: 100%;
    display: flex;
    flex-direction: column;
  }
`
const GridBotContainer = styled.div`
  margin: 10px auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  display: grid;
  grid-template-columns: 52px 130px 9fr 1fr 1fr 1fr;
`
const StyledAcc = styled.div`
  margin: 10px auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 5px;
`
const GridRow = styled.div`
  display: contents;
`
const StyledHeader = styled.div`
  height: 40px;
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
const GridItem = styled.div`
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
  &.left-align { 
    text-align: left;
    justify-content: flex-start;
    overflow-y: scroll;
  }
`
const StyledTextarea = styled.textarea`
  width: 95%;
  height: 100%;
  padding: 5px;
  border-radius: 5px;
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
  padding: 12px 34px;
`
export default StudentDetailPage