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
//hooks
import useTeacherAuth from '../../hooks/useTeacherAuth'
import useFireBasic from '../../hooks/Firebase/useFireBasic'
import useFetchStorageImg from '../../hooks/Game/useFetchStorageImg'
//이미지
import temp_icon from '../../image/icon/question.png'
import { useSelector } from 'react-redux'
import TwoRadios from '../../components/Radio/TwoRadios'
import GameRankModal from '../../components/Modal/GameRankModal'
//250119 생성 -> 0202 recordList로 갱신
const QuizActiFormPage = () => {
  //준비
  const { log } = useTeacherAuth();
  if (log) { window.alert(log) };
  const user = useSelector(({ user }) => user);
  const navigate = useNavigate();
  const { fetchData } = useFireBasic("quiz");
  const { addData, setData, deleteData } = useFireBasic("activities");
  const { fetchImgUrl } = useFetchStorageImg();
  useEffect(() => { fetchData("uid").then(quizSetList => { quizSetList.map((item) => setQuizOptionList(prev => [...prev, { label: item.title, value: item }])) }) }, []) //퀴즈 세트 불러오기
  const { state: quizActiInfo } = useLocation();
  useEffect(() => { bindInfo(); }, [quizActiInfo])
  //랜더링 변수
  const [_title, setTitle] = useState('');
  const [_content, setContent] = useState('');
  const [_highCount, setHighCount] = useState(3);
  useEffect(() => { autoFilRecord("high"); }, [_highCount])
  const [_midCount, setMidCount] = useState(2);
  useEffect(() => { autoFilRecord("mid"); }, [_midCount])
  const [_basicCount, setBasicCount] = useState(1);
  useEffect(() => { autoFilRecord("basic"); }, [_basicCount])
  const [_highRec, setHighRec] = useState('');
  const [_midRec, setMidRec] = useState('');
  const [_basicRec, setBasicRec] = useState('');
  const [subjGroup, setSubjGroup] = useState('');
  const [subjDetail, setSubjDetail] = useState('');
  const [_isPrivate, setIsPrivate] = useState(false);
  const [gameRecord, setGameRecord] = useState(null);
  //퀴즈 세트 선택
  const [quizOptionList, setQuizOptionList] = useState([]);
  const [_quizSelected, setQuizSelected] = useState(null);
  useEffect(() => { autoFill(); }, [_quizSelected])
  //몬스터
  const [monImg, setMonImg] = useState(null);     //이미지
  const [_monster, setMonster] = useState(null);  //몬스터 정보
  useEffect(() => { if (_monster) setMonsterDetails(_monster.step[0]) }, [_monster])
  const [monsterDetails, setMonsterDetails] = useState(null);
  //모드
  const [isModifying, setIsModifying] = useState(!quizActiInfo);
  //모달
  const [isMonsterModal, setIsMonsterModal] = useState(false);
  const [isRankModal, setIsRankModal] = useState(false);

  //------함수부------------------------------------------------ 
  //기존 state 렌더링
  const bindInfo = () => {
    if (!quizActiInfo) return;
    // gameRecord: 게임 결과
    const { title, content, quizInfo, monster, isPrivate, recordList, gameRecord } = quizActiInfo
    setHighCount(recordList[0].count);
    setHighRec(recordList[0].record)
    setMidCount(recordList[1].count);
    setMidRec(recordList[1].record);
    setBasicCount(recordList[2].count);
    setBasicRec(recordList[2].record);
    setTitle(title);
    setContent(content);
    setQuizSelected(quizInfo);
    setMonster(monster);
    setIsPrivate(isPrivate);
    setGameRecord(gameRecord);
    fetchImgUrl(monster.path, setMonImg);
  }
  //자동 완성
  const autoFill = () => {
    if (!_quizSelected) return;
    setContent(`${_quizSelected.subjDetail}과목 학습 퀴즈${_quizSelected.quizList.length}개`)
    setSubjGroup(_quizSelected.subject)
    setSubjDetail(_quizSelected.subjDetail)
    setTitle(_quizSelected.title)
  }
  //자동 채우기
  const autoFilRecord = (level) => {
    if (!_quizSelected) return;
    if (level === "high") {
      const highRecord = `${_quizSelected.subjDetail}과목 ${_quizSelected.title}을(를) ${_highCount}회 반복 학습한 후, 자기주도적으로 테스트를 진행하여 우수한 성적을 거둠. 반복적인 학습에도 지치지 않고 끝까지 해내는 끈기와 인내심, 의지가 돋보이는 학생임.`
      setHighRec(highRecord)
    } else if (level === "mid") {
      const midRecord = `${_quizSelected.subjDetail}과목 ${_quizSelected.title}을(를) ${_midCount}회 반복 학습한 후, 자기주도적으로 테스트를 진행하여 우수한 성적으로 기준 점수를 통과함.`
      setMidRec(midRecord)
    } else {
      const basicRecord = `${_quizSelected.subjDetail}과목 ${_quizSelected.title}을(를) ${_basicCount}회 반복 학습함.`
      setBasicRec(basicRecord)
    }
  }
  //입력 확인
  const check = () => {
    // 조건 1: 선택했는가?
    if (!_quizSelected || !_monster) {
      return { valid: false, message: "몬스터 생성이나 단어 세트 선택이 되지 않았습니다." }
    };
    // 조건 2: 순서 조건을 만족하는지 확인
    if (_highCount < _midCount || _midCount < _basicCount) {
      return { valid: false, message: "성취도 값은 상 >= 중 >= 하 순으로 입력해야 합니다." };
    }
    // 조건 3: 중복된 값이 있는지 확인
    const values = [_highCount, _midCount, _basicCount];
    const uniqueValues = new Set(values);
    if (uniqueValues.size !== values.length) {
      return { valid: false, message: "상급, 중급, 기본 값은 서로 다른 값을 가져야 합니다." };
    }
    // 조건 4: 각 rec는 반드시 ''문구가 있어야 함.
    if (_basicRec === '' || _midRec === '' || _highRec === '') {
      return { valid: false, message: "수준별 문구가 존재해야 합니다." };
    }
    // 모든 조건 통과
    return { valid: true, message: "유효한 성취도 입력입니다!" };
  }
  //몬스터 클릭
  const handleMonImgOnClick = () => {
    if (!isModifying) return
    setIsMonsterModal(true)
  }
  //저장
  const handleSaveOnClick = () => {
    let isValid = check();
    if (isValid.valid) {
      let confirm = window.confirm(`${quizActiInfo ? "이렇게 변경 저장할까요?" : "이 퀴즈 게임 활동을 생성할까요?"}`)
      if (confirm) {
        const recordList = [{ count: _highCount, record: _highRec }, { count: _midCount, record: _midRec }, { count: _basicCount, record: _basicRec }]
        const data = { title: _title, recordList, content: _content, subject: subjGroup, subjDetail, quizInfo: _quizSelected, monster: _monster, madeBy: user.name, isPrivate: _isPrivate }
        if (!quizActiInfo) {
          addData(data);
          navigate("/activities");
        } else {
          setData(data, quizActiInfo.id);
          setIsModifying(false);
        }
      }
    } else { window.alert(isValid.message) }
  }
  //수정 취소
  const hadleCancelOnClick = () => {
    bindInfo();
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
          <StyledInput type="text" value={_title} onChange={(event) => { setTitle(event.target.value) }} disabled={!isModifying} />
        </Row>
        <Row style={{ marginBottom: "10px", justifyContent: "space-between" }}>
          <DotTitle title={"단어 세트"} styles={{ dotColor: "#3454d1;" }} />
          {!isModifying && <StyledText>{_quizSelected?.title}</StyledText>}
          {isModifying && <Select options={quizOptionList} onChange={(event) => { setQuizSelected(event.value) }} />}
        </Row>
        <Row style={{ marginBottom: "15px", justifyContent: "space-between" }}>
          <DotTitle title={"교과/과목"} styles={{ dotColor: "#3454d1;" }} />
          {_quizSelected && <StyledText>{subjGroup}교과 {subjDetail}</StyledText>}
        </Row>
        <Row style={{ marginBottom: "15px", justifyContent: "space-between" }}>
          <DotTitle title={"공개/비공개"} styles={{ dotColor: "#3454d1;" }} />
          <TwoRadios
            name={"isPrivate_radio"}
            id={["private_radio", "public_radio"]}
            value={_isPrivate}
            label={["비공개 활동", "공개 활동"]}
            onChange={() => { setIsPrivate(!_isPrivate) }}
            disabled={!isModifying}
          />
        </Row>
        {/* 몇번 이겨야? */}
        {_quizSelected && <>
          <DotTitle title={"성취도별 문구"} styles={{ dotColor: "#3454d1;" }} />
          <LevelWrapper>
            <Row style={{ gap: "10px", alignItems: "center" }}>
              <LevelText>상급</LevelText>
              <NumberInput type="number" value={_highCount} min={3} max={50} onChange={(event) => { setHighCount(Number(event.target.value)) }} disabled={!isModifying} />
              <RecordTextArea value={_highRec} onChange={(event) => { setHighRec(event.target.value) }} disabled={!isModifying}></RecordTextArea>
            </Row>
            <Row style={{ gap: "10px", alignItems: "center" }}>
              <LevelText>중급</LevelText>
              <NumberInput type="number" value={_midCount} min={2} max={49} onChange={(event) => { setMidCount(Number(event.target.value)) }} disabled={!isModifying} />
              <RecordTextArea value={_midRec} onChange={(event) => { setMidRec(event.target.value) }} disabled={!isModifying}></RecordTextArea>
            </Row>
            <Row style={{ gap: "10px", alignItems: "center" }}>
              <LevelText>기본</LevelText>
              <NumberInput type="number" value={_basicCount} min={1} max={48} onChange={(event) => { setBasicCount(Number(event.target.value)) }} disabled={!isModifying} />
              <RecordTextArea value={_basicRec} onChange={(event) => { setBasicRec(event.target.value) }} disabled={!isModifying}></RecordTextArea>
            </Row>
          </LevelWrapper>
        </>}
        {/* 설명 */}
        <CommonTextarea title="활동 설명" onChange={(e) => { setContent(e.target.value) }} value={_content}
          placeholder={"단어세트를 선택하세요"} disabled={!isModifying} />

        {!quizActiInfo && <BtnWrapper>
          <LongW100Btn btnName="생성" btnOnClick={handleSaveOnClick} />
        </BtnWrapper>}
        {quizActiInfo && <BtnWrapper>
          {(!isModifying && gameRecord) && <LongW100Btn btnName="결과 보기" btnOnClick={() => { setIsRankModal(true) }} />}
          {isModifying && <LongW100Btn btnName="변경 저장" btnOnClick={handleSaveOnClick} />}
          {!isModifying && <LongW100Btn btnName="수정" btnOnClick={() => { setIsModifying(true) }} />}
          {isModifying && <LongW100Btn btnName="취소" btnOnClick={hadleCancelOnClick} />}
          {!isModifying && <LongW100Btn btnName="삭제" btnOnClick={handleDeleteOnClick} />}
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
    {gameRecord && <GameRankModal
      show={isRankModal}
      onHide={() => { setIsRankModal(false) }}
      result={gameRecord}
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
  border: none;
  height: 100px;
  border-radius: 8px;
  padding: 5px;
  flex-grow:1;
  overflow-y: scroll;
`
const StyledText = styled.p`
  margin: 0;
`
const StyledInput = styled.input`
  height: 35px;
  border-radius: 7px;
  border: none;
  padding-left: 5px;
  &:disabled {             /* 해당 input disabled 되었을 때 */
    color: gray;           /* 글자 색을 white로 설정 */
  }
`
const LevelWrapper = styled.div`
  margin: 15px auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
`
const LevelText = styled(StyledText)`
  text-align: center;
`
const NumberInput = styled.input`
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 3px;
  text-align: center;
`
const RecordTextArea = styled.textarea`
  flex-grow: 1;
  height: 60px;
  border: none;
  border-radius: 5px;
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
