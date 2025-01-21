//라이브러리
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'
//컴포넌트
import FormFrame from '../../components/Form/FormFrame'
import FormHeader from '../../components/Form/FormHeader'
import ImagePicker from '../../components/Form/ImagePicker'
import DotTitle from '../../components/Title/DotTitle'
import CommonTextarea from '../../components/CommonTextArea'
import LongW100Btn from '../../components/Btn/LongW100Btn'
import BackBtn from '../../components/Btn/BackBtn'
import SubNav from '../../components/Bar/SubNav'
import MonsterModal from '../../components/Modal/MonsterModal'
import GameModal from '../../components/Modal/GameModal'
import TwoRadios from '../../components/Radio/TwoRadios'
//hooks
import useTeacherAuth from '../../hooks/useTeacherAuth'
import useFireBasic from '../../hooks/Firebase/useFireBasic'
import useAdjustStat from '../../hooks/Game/useAdjustStat'
import useFetchStorageImg from '../../hooks/Game/useFetchStorageImg'
//이미지
import temp_icon from '../../image/icon/question.png'
import { useSelector } from 'react-redux'
//25.01.19
const QuizActiFormPage = () => {
  //준비
  const { log } = useTeacherAuth();
  if (log) { window.alert(log) };
  const user = useSelector(({ user }) => user);
  const navigate = useNavigate();
  const { fetchData } = useFireBasic("quiz");
  const { addData, setData, deleteData } = useFireBasic("activities");
  const { getStatUp } = useAdjustStat();
  const { fetchImgUrl } = useFetchStorageImg();
  useEffect(() => { fetchData("uid").then(quizSetList => { quizSetList.map((item) => setQuizOptionList(prev => [...prev, { label: item.title, value: item }])) }) }, []) //퀴즈 세트 불러오기
  const { state: quizActiInfo } = useLocation();
  useEffect(() => { renderState(); }, [quizActiInfo])
  //랜더링 변수
  const [_title, setTitle] = useState('');
  const [_content, setContent] = useState('');
  const [_record, setRecord] = useState('');
  const [_isPrivate, setIsPrivate] = useState(false);
  const [subjGroup, setSubjGroup] = useState('');
  const [subjDetail, setSubjDetail] = useState('');
  //퀴즈 세트 선택
  const [quizOptionList, setQuizOptionList] = useState([]);
  const [_quizSelected, setQuizSelected] = useState(null);
  useEffect(() => {
    if (!_quizSelected) return;
    autoFill();
  }, [_quizSelected])
  //레벨
  const levelOptionList = [{ label: 1, value: 1 }, { label: 2, value: 2 }, { label: 3, value: 3 }, { label: 4, value: 4 }, { label: 5, value: 5 }]
  const [_level, setLevel] = useState(1)
  useEffect(() => { setStatUp(getStatUp(_level)); }, [_level])
  const [_statUp, setStatUp] = useState({ hp: 0, atk: 0, def: 0, spd: 0 })  //레벨 보정 수치
  //몬스터
  const [monImg, setMonImg] = useState(null);     //이미지
  const [_monster, setMonster] = useState(null);  //몬스터 정보
  useEffect(() => {
    if (_monster) { setMonsterDetails(_monster.step[0]) }
    else { setMonsterDetails(null) }
  }, [_monster])
  const [monsterDetails, setMonsterDetails] = useState(null);
  //모드
  const [isModifying, setIsModifying] = useState(!quizActiInfo);
  //모달
  const [isMonsterModal, setIsMonsterModal] = useState(false);
  const [isGameModal, setIsGameModal] = useState(false)

  //------함수부------------------------------------------------ 
  //기존 state 렌더링
  const renderState = () => {
    if (!quizActiInfo) return;
    const { title, content, quizInfo, monster, isPrivate, level } = quizActiInfo
    setTitle(title);
    setContent(content)
    setIsPrivate(isPrivate);
    setQuizSelected(quizInfo)
    setMonster(monster)
    setLevel(level)
    fetchImgUrl(monster.path, setMonImg);
  }

  //자동 완성
  const autoFill = () => {
    setRecord(`${_quizSelected.subjDetail}과목 ${_quizSelected.title}을(를) {/*n*/}회 반복 학습하여 시험을 통과함.`)
    setContent(`${_quizSelected.subjDetail}과목 학습 퀴즈${_quizSelected.quizList.length}개`)
    setSubjGroup(_quizSelected.subject)
    setSubjDetail(_quizSelected.subjDetail)
    setTitle(_quizSelected.title)
  }

  //입력 확인
  const check = () => {
    if (_quizSelected && monsterDetails) { return true };
    window.alert("몬스터 생성이나 단어 세트 선택이 되지 않았습니다.");
    return false;
  }
  //사용자 클릭
  const handleMonImgOnClick = () => {
    if (!isModifying) return
    setIsMonsterModal(true)
  }

  //저장
  const handleSaveOnClick = () => {
    if (check()) {
      let confirm = window.confirm(`${quizActiInfo ? "이렇게 변경 저장할까요?" : "이 퀴즈 게임 활동을 생성할까요?"}`)
      if (confirm) {
        let data = { title: _title, record: _record, content: _content, subject: subjGroup, subjDetail, quizInfo: _quizSelected, monster: _monster, level: _level, isPrivate: _isPrivate, madeBy: user.name }
        if (!quizActiInfo) {
          addData(data);
          navigate("/activities");
        } else {
          setData(data, quizActiInfo.id);
          setIsModifying(false);
        }
      }
    }
  }

  //테스트 게임
  const handleTestOnClick = () => {
    if (check()) {
      let confirm = window.confirm("이 내용으로 테스트 게임을 진행할까요?")
      if (confirm) {
        setIsGameModal(true);
      }
    }
  }

  //수정 취소
  const hadleCancelOnClick = () => {
    renderState();
    setIsModifying(false);
  }

  //삭제
  const handleDeleteOnClick = () => {
    const { id } = quizActiInfo
    if (!id) return;
    const confirm = window.confirm("이 활동을 삭제하시겠습니까?");
    if (confirm) {
      deleteData(id)
      navigate("/activities")
    }
  }

  return (<>
    <SubNav><BackBtn /></SubNav>
    <Container>
      <FormFrame>
        <FormHeader><legend> 퀴즈 게임 생성</legend></FormHeader>
        <Row style={{ gap: "20px" }}>
          <ImagePicker src={monImg || temp_icon} onClick={handleMonImgOnClick} styles={isModifying && { backgroundColor: "white" }} />
          <StyledBox style={isModifying ? { backgroundColor: "white" } : { backgroundColor: "#efefef" }}>{monsterDetails?.desc || "오른쪽 물음표를 클릭해서 몬스터를 생성하세요."}</StyledBox>
        </Row>
        <Row style={{ justifyContent: "space-between", margin: "13px 0" }}>
          <DotTitle title={"게임 제목"} styles={{ dotColor: "#3454d1;" }} />
          <StyledInput type="text" value={_title} onChange={(e) => { setTitle(e.target.value) }} disabled={!isModifying} />
        </Row>
        <Row style={{ marginBottom: "10px", justifyContent: "space-between" }}>
          <DotTitle title={"단어 세트"} styles={{ dotColor: "#3454d1;" }} />
          {!isModifying && <StyledText>{_quizSelected?.title}</StyledText>}
          {isModifying && <Select options={quizOptionList} onChange={(e) => { setQuizSelected(e.value) }} />}
        </Row>
        <Row style={{ marginBottom: "10px", justifyContent: "space-between" }}>
          <DotTitle title={"교과/과목"} styles={{ dotColor: "#3454d1;" }} />
          {_quizSelected && <StyledText>{subjGroup}교과 {subjDetail}</StyledText>}
        </Row>
        <Row style={{ marginBottom: "10px", justifyContent: "space-between" }}>
          <DotTitle title={"난이도(레벨)"} styles={{ dotColor: "#3454d1;" }} />
          {(monsterDetails && isModifying) && <Select options={levelOptionList} onChange={(e) => { setLevel(e.value) }} />}
          {!isModifying && <StyledText>{_level}</StyledText>}
        </Row>
        {/* 공개/비공개 */}
        <Row style={{ justifyContent: "space-between", marginBottom: "10px" }}>
          <DotTitle title={"공개 여부"} styles={{ dotColor: "#3454d1;" }} />
          <TwoRadios name="isPrivate_radio"
            id={["private_radio", "public_radio"]}
            value={_isPrivate} label={["비공개 활동", "공개 활동"]}
            onChange={() => { setIsPrivate(!_isPrivate) }}
            disabled={!isModifying}
          />
        </Row>
        {monsterDetails && <StatusWrapper>
          <p>이름: {monsterDetails.name}</p>
          <p>체력: {monsterDetails.hp}+(<HighLight>{_statUp.hp}</HighLight>)</p><span></span>
          <p>공격력: {monsterDetails.atk}+(<HighLight>{_statUp.atk}</HighLight>)</p>
          <p>방어력: {monsterDetails.def}+(<HighLight>{_statUp.def}</HighLight>)</p>
          <p>스피드: {monsterDetails.spd}+(<HighLight>{_statUp.spd}</HighLight>)</p>
        </StatusWrapper>}
        {/* 설명 */}
        <CommonTextarea title="활동 설명" onChange={(e) => { setContent(e.target.value) }} value={_content}
          placeholder={"단어세트를 선택하세요"} disabled={!isModifying} />
        <CommonTextarea title="생기부 문구" onChange={(e) => { setRecord(e.target.value) }} value={_record}
          placeholder={"단어세트를 선택하세요"} disabled={!isModifying} />
        {!quizActiInfo && <BtnWrapper>
          <LongW100Btn btnName="생성" btnOnClick={handleSaveOnClick} />
          <LongW100Btn btnName="테스트" btnOnClick={handleTestOnClick} />
        </BtnWrapper>}
        {quizActiInfo && <BtnWrapper>
          {isModifying && <LongW100Btn btnName="변경 저장" btnOnClick={handleSaveOnClick} />}
          {!isModifying && <LongW100Btn btnName="수정" btnOnClick={() => { setIsModifying(true) }} />}
          {isModifying && <LongW100Btn btnName="취소" btnOnClick={hadleCancelOnClick} />}
          {!isModifying && <LongW100Btn btnName="삭제" btnOnClick={handleDeleteOnClick} />}
          <LongW100Btn btnName="테스트" btnOnClick={handleTestOnClick} />
        </BtnWrapper>}
      </FormFrame>
    </Container>
    <MonsterModal
      show={isMonsterModal}
      onHide={() => setIsMonsterModal(false)}
      monster={_monster}
      setMonster={setMonster}
      setMonImg={setMonImg}
    />
    {isGameModal && <GameModal
      show={isGameModal}
      onHide={() => setIsGameModal(false)}
      quizSetId={_quizSelected.id}
      monsterDetails={{ ...monsterDetails, level: _level }} //게임엔 레벨까지 제공
    />}
  </>
  )
}

const Container = styled.div`
  box-sizing: border-box;
`
const Row = styled.div`
  display: flex;
`
const StyledBox = styled.div`
  border: 1px solid black;
  height: 100px;
  border-radius: 8px;
  padding: 5px;
  flex-grow:1;
  overflow-y: scroll;
`
const StyledText = styled.p`
  margin: 0;
`
const StatusWrapper = styled.div`
  width: 200px;
  border: 1px solid gray;
  border-radius: 8px;
  margin: 15px auto;
  padding: 5px;
  text-align: center;
  p { margin-bottom: 5px;}
`
const HighLight = styled.span`
  color: #3454d1;
  font-weight: bold;
`
const StyledInput = styled.input`
  height: 35px;
  border-radius: 7px;
  padding-left: 5px;
  &:disabled {             /* 해당 input disabled 되었을 때 */
    color: gray;           /* 글자 색을 white로 설정 */
  }
`
const BtnWrapper = styled.div`
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

export default QuizActiFormPage
