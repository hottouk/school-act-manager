//라이브러리
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Select from 'react-select';
//컴포넌트
import ClickableIcon from '../../components/Styled/ClickableIcon';
import AskEditModal from '../../components/Modal/AskEditModal';
import GptModal from '../../components/Modal/gptModal/GptModal';
//hooks
import useGetByte from '../../hooks/useGetByte';
//이미지
import x_btn from "../../image/icon/x_btn.png"
//분리(260121)
const ActiTableSection = ({ actiList = [], setActiList, type, tabValue, getAccRec, petRtData, isEdit, isMobile, subject }) => {
  //유저
  const user = useSelector(({ user }) => user);
  //활동
  const allActiList = useSelector((state) => state.allActivities);
  //바이트
  const { getByteLengthOfString } = useGetByte();
  const [gptRecord, setGptRecord] = useState('');
  useEffect(() => { if (selectedActi) { changeAccRecord(selectedActi.index, gptRecord); } }, [gptRecord]); //GPT 개별화 문구 textArea에 띄우고 새 활동 문구로 저장.
  //모달
  const [selectedActi, setSelectedActi] = useState(null);
  const [isGptModal, setIsGptModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  //------함수부-----------------------------------------------  
  //활동 순서 변경(241224)
  const moveActiItem = (index, direction) => {
    setActiList((prev) => {
      const newActiList = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newActiList.length) return prev; // 범위 내에서만 이동
      [newActiList[index], newActiList[targetIndex]] = [newActiList[targetIndex], newActiList[index]]; // swap
      return newActiList;
    });
  };
  //셀렉터 체크
  const check = (event) => {
    if ((actiList.findIndex(({ id }) => id === event.value.id)) === -1) { return { isValid: true, msg: "같은 활동 없음" } }
    else { return { isValid: false, msg: "중복된 활동입니다." } };
  }
  //임의 활동 추가
  const handleAddActiOnClick = () => {
    const assignedDate = new Date().toISOString().split("T")[0];
    const cryptoId = crypto.randomUUID();
    const common = { title: "임의기록", record: '', id: cryptoId, uid: user.uid, madeBy: user.name, assignedDate, };
    let specific = {};
    if (type === "homeroom") specific = { subjDetail: tabValue === 1 ? "자율" : "진로" };
    else if (type === "subject") specific = { semester: tabValue };
    const newActiItem = { ...common, ...specific };
    const newList = [...actiList, newActiItem];
    setActiList(newList);
  }
  //활동 삭제
  const handleDeleteActiOnClick = (index) => {
    const leftList = actiList.filter((_, i) => { return i !== index })
    setActiList(leftList)
  }
  //활동 셀렉터 변경
  const handleSelectOnchange = (event, index) => {
    const result = check(event);
    if (result.isValid) {
      const assignedDate = new Date().toISOString().split('T')[0];
      const selected = event.value;
      const { byte, studentDoneList, particiList, particiSIdList, likedCount, isPrivate, isHomework, createdTime, ...rest } = selected; //★필요한 prop만 사용하고 제외 및 불변성 보존★ allActivityList는 전역 변수
      const newActi = { ...rest, assignedDate, semester: tabValue };
      const newActiList = [...actiList.slice(undefined, index), newActi, ...actiList.slice(index + 1)];
      setActiList(newActiList);
    } else { alert(result.msg); };
  }
  //textarea 변경 (gpt, 수기 변경)
  const changeAccRecord = (idx, newRec) => {
    const curActi = actiList[idx];
    const newActi = { ...curActi, record: newRec };
    setActiList(prev => {
      const newActiList = [...prev.slice(0, idx), newActi, ...prev.slice(idx + 1)]
      return newActiList;
    })
  }
  //textarea 수기 변경
  const handleTextareaOnChange = (event, index) => {
    changeAccRecord(index, event.target.value);
  }
  //------랜더링------------------------------------------------  
  const ActiRow = ({ item, index }) => {
    const { title, record, madeBy, assignedDate, repeatTimes } = item;
    return (
      <GridRow>
        {!isMobile && <GridItem>{index + 1}</GridItem>}
        <GridItem style={{ flexDirection: "column" }}>
          {title}
          {repeatTimes && <span style={{ fontWeight: "bold", color: "#3454d1" }}>{repeatTimes}회 반복</span>}
        </GridItem>
        {/* 생기부 기록 */}
        {!isMobile
          ? <GridItem className="left-align"><span>{record}</span></GridItem>
          : <GridItem className="left-align">
            <span
              onClick={() => { }}
              style={{ textDecoration: "underline", color: "#3454d1" }}>{record}
            </span>
          </GridItem>
        }
        {!isMobile && <GridItem>{assignedDate || '없음'}</GridItem>}
        {!isMobile && <GridItem>{madeBy || '익명'}</GridItem>
        }
        {!isMobile && <GridItem>{getByteLengthOfString(record)} Byte</GridItem>}
      </GridRow>)
  }
  return (<>
    <GridTableSection>
      <GridRow>
        {!isMobile && <Header>연번</Header>}
        <Header>활동</Header>
        <Header>생기부</Header>
        {!isMobile && <Header>{!isEdit ? "날짜" : "문구 종류"}</Header>}
        {!isMobile &&
          (user.isTeacher
            ? <Header> {!isEdit ? "기록자" : "변경"}</Header>
            : <Header>수정</Header>)
        }
        {!isMobile && <Header>바이트</Header>}
      </GridRow>
      {actiList?.length === 0 && <div style={{ gridColumn: "1/7", textAlign: "center", margin: "5px 0" }}>활동이 없어요ㅠㅠ</div>}
      {actiList?.length > 0 && actiList.map((acti, index) => {
        console.log(acti);
        const { uid, id, record, perfRecordList, extraRecordList, repeatInfoList, } = acti;
        const recordList = [{ label: "기본 문구", value: record, type: "basic" }];
        if (perfRecordList?.length > 0) ["상", "중", "하", "최하"].forEach((item, index) => recordList.push({ label: item, value: perfRecordList[index], type: "perf" }));
        extraRecordList?.forEach((item, index) => recordList.push({ label: `랜덤문구${index + 1}`, value: item }));
        repeatInfoList?.forEach(({ times, record }) => recordList.push({ label: `${times}회 반복문구`, value: record, type: "repeat" }));
        return <React.Fragment key={id || index}>
          {/* 열람 */}
          {(!isEdit
            || (isEdit && user.uid !== uid && user.userStatus !== "master")) && <ActiRow item={acti} index={index} />}
          {/* 수정 */}
          {((isEdit && !isMobile) && (user.userStatus === "master" || (user.userStatus === "coTeacher" && user.uid === uid))) &&
            <GridRow>
              {/* 1열 */}
              <GridItem>
                <Column>
                  <button onClick={() => moveActiItem(index, 'up')}>▲</button>
                  <button onClick={() => moveActiItem(index, 'down')}>▼</button>
                </Column>
              </GridItem>
              {/* 2열 */}
              <GridItem>
                <Select
                  options={allActiList.map((item) => ({ label: item.title, value: item }))}
                  onChange={(event) => { handleSelectOnchange(event, index) }} />
              </GridItem>
              {/* 3열 */}
              <GridItem className="left-align">
                <Textarea
                  value={actiList[index].record}
                  onChange={(event) => handleTextareaOnChange(event, index)} />
              </GridItem>
              {/* 4열 */}
              <GridItem>{perfRecordList && <SmallBtnWrapper>
                {recordList?.map((item, radioIdx) => {
                  const { type, label, value } = item;
                  const groupName = `record-${index}`;
                  const inputId = `record-${index}-${label ?? 'basic'}`;
                  return <Row key={`${index}${radioIdx}`} style={{ gap: "5px", justifyContent: "flex-start" }}>
                    <input
                      id={inputId}
                      type='radio'
                      name={groupName}
                      value={value}
                      onChange={(event) => changeAccRecord(index, value)}
                    />
                    {type === "basic" ? "기본 문구" : label}
                  </Row>
                })}
              </SmallBtnWrapper>}</GridItem>
              {/* 5열 */}
              <GridItem>
                <SmallBtnWrapper className="gpt">
                  <i className="fa-solid fa-brain" style={{ cursor: "pointer", color: "#3454d1" }}
                    onClick={() => {
                      setSelectedActi({ item: acti, index });
                      setIsGptModal(true);
                    }} />
                  <img src={x_btn} style={{ width: "25px", height: "25px" }} alt="삭제x" onClick={(event) => handleDeleteActiOnClick(index)} />
                </SmallBtnWrapper>
              </GridItem>
              {/* 6열 */}
              <GridItem>{getByteLengthOfString(record)} Byte</GridItem>
            </GridRow>}
        </React.Fragment>
      })}
      {isEdit && <GridRow>
        <GridItem style={{ gridColumn: "1/7", gap: "20px" }} >
          <ClickableIcon className='fa-solid fa-plus' onClick={handleAddActiOnClick} />
        </GridItem>
      </GridRow>}
    </GridTableSection>
    {/* 모달 */}
    {isGptModal && <GptModal
      show={isGptModal}
      onHide={() => setIsGptModal(false)}
      subject={subject}
      acti={selectedActi?.item}
      accRecord={getAccRec(actiList)}
      setPersonalRecord={setGptRecord} />}
    {isEditModal && <AskEditModal
      show={isEditModal}
      onHide={() => setIsEditModal(false)}
      acti={selectedActi?.item}
      accRecord={getAccRec(actiList)}
      petInfo={petRtData}
    />}
  </>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const GridTableSection = styled.div`
  width: 100%;
  margin: 10px auto;
  border-radius: 10px;
  display: grid;
  grid-template-columns: 52px 100px 1fr 130px 80px 80px;
  @media (max-width: 767px){
    grid-template-columns: 1fr 5fr;
  }
`
const GridRow = styled.div`
  display: contents;
`
const GridItem = styled(Row)`
  background-color: #efefef;
  padding: 10px;
  color: black;
  border-right: 1px solid #78787880;
  border-bottom: 1px solid #78787880;
  text-align: center;
  justify-content: center;
  align-items: center;
  img {
    width: 30px;
    height: 30px;
    cursor: pointer;
    margin: auto;
  }
  /* 자식 요소 배경이 컨테이너의 테두리를 침범하지 않도록 함 */
  background-clip: padding-box;
  &.left-align { 
    text-align: left;
    justify-content: flex-start;
  }
  /* 데스크탑(6열)에서 오른쪽 끝 컬럼은 우측 경계 제거 */
  &:nth-child(6n) {
    border-right: none;
  }
  /* 마지막 행의 항목들은 하단 경계 제거 (6열 기준) */
  &:nth-last-child(-n+6) {
    border-bottom: none;
  }
  @media (max-width: 767px){
    /* 모바일(2열)에서 오른쪽 끝 컬럼은 우측 경계 제거 */
    &:nth-child(2n) { border-right: none; }
    /* 모바일 마지막 행 항목들은 하단 경계 제거 (2열 기준) */
    &:nth-last-child(-n+2) { border-bottom: none; }
  }
  /* 모서리 보정: 컨테이너의 radius가 가려지지 않도록 시각 보정 적용 */
  &:first-child { border-top-left-radius: 5px; }
  &:nth-child(6) { border-top-right-radius: 5px; }
  &:nth-last-child(1) { border-bottom-right-radius: 5px; }
  &:nth-last-child(6) { border-bottom-left-radius: 5px; }
  @media (max-width: 767px){
    &:first-child { border-top-left-radius: 5px; }
    &:nth-child(2) { border-top-right-radius: 5px; }
    &:nth-last-child(1) { border-bottom-right-radius: 5px; }
    &:nth-last-child(2) { border-bottom-left-radius: 5px; }
  }
`
const Header = styled(Row)`
  height: 40px;
  background-color: #3454d1b1; 
  color: white;
  padding: 10px;
  font-weight: bold;
  justify-content: center;
  &: first-child { border-top-left-radius: 5px;  }
  &: last-child { border-top-right-radius: 5px;  }
`
const Textarea = styled.textarea`
  width: 95%;
  height: 10dvh;
  padding: 5px;
  border-radius: 5px;
`
const SmallBtnWrapper = styled(Column)`
  gap: 2px;
  margin: 2px;
  &.gpt { gap: 12px; }
`
export default ActiTableSection
