//라이브러리
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Select from 'react-select';
//컴포넌트
import ClickableIcon from '../../components/Styled/ClickableIcon';
import SmallBtn from '../../components/Btn/SmallBtn';
import AskEditModal from '../../components/Modal/AskEditModal';
import GptModal from '../../components/Modal/gptModal/GptModal';
//hooks
import useGetByte from '../../hooks/useGetByte';
//이미지
import x_btn from "../../image/icon/x_btn.png"
//분리(260121)
const ActiTableSection = ({ actiList, setActiList, tabValue, getAccRec, petRtData, isModifying, isMobile, }) => {
  //유저
  const user = useSelector(({ user }) => user);
  //활동
  const allActivityList = useSelector((state) => state.allActivities);
  //객체 접근
  const selectRef = useRef({});
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
    if ((actiList.findIndex(({ id }) => id === event.value.id)) === -1) { return { isValid: true, msg: "같은 활동 없음" } }
    else { return { isValid: false, msg: "중복된 활동입니다." } };
  }
  //임의 활동 추가
  const handleAddActiOnClick = () => {
    const assignedDate = new Date().toISOString().split("T")[0];
    const cryptoId = crypto.randomUUID();
    const newActiItem = { title: "임의기록", record: '', id: cryptoId, uid: user.uid, assignedDate, madeBy: user.name, semester: tabValue };
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
  //학생 수정 요청
  const handleEditRecordOnClick = (item, index) => {
    if (user.isTeacher) return;
    setSelectedActi({ item, index });
    setIsEditModal(true);
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
              onClick={() => handleEditRecordOnClick(item, index)}
              style={{ textDecoration: "underline", color: "#3454d1" }}>{record}
            </span>
          </GridItem>
        }
        {!isMobile && <GridItem>{assignedDate || '없음'}</GridItem>}
        {!isMobile &&
          (user.isTeacher
            ? <GridItem>{madeBy || '익명'}</GridItem>
            : <GridItem>
              <SmallBtn onClick={() => handleEditRecordOnClick(item, index)}>수정</SmallBtn>
            </GridItem>)}
        {!isMobile && <GridItem>{getByteLengthOfString(record)} Byte</GridItem>}
      </GridRow>)
  }
  return (<>
    <GridContainer>
      <GridRow>
        {!isMobile && <Header>연번</Header>}
        <Header>활동</Header>
        <Header>생기부</Header>
        {!isMobile && <Header>{!isModifying ? "날짜" : "성취도"}</Header>}
        {!isMobile &&
          (user.isTeacher
            ? <Header> {!isModifying ? "기록자" : "변경"}</Header>
            : <Header>수정</Header>)
        }
        {!isMobile && <Header>바이트</Header>}
      </GridRow>
      {actiList?.length === 0 && <GridItem style={{ gridColumn: "1/7" }}>활동이 없어요ㅠㅠ</GridItem>}
      {actiList?.length > 0 && actiList.map((acti, index) => {
        const { record, perfRecordList, uid, id } = acti;
        return <React.Fragment key={id || index}>
          {/* 열람 */}
          {(!isModifying || (isModifying && user.uid !== uid && user.userStatus !== "master")) && <ActiRow item={acti} index={index} />}
          {/* 수정 */}
          {(isModifying && (user.userStatus === "master" || (user.userStatus === "coTeacher" && user.uid === uid))) &&
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
                  ref={(ele) => selectRef.current[index] = ele}
                  options={allActivityList.map((item) => ({ label: item.title, value: item }))}
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
                <SmallBtn btnName="상" btnOnClick={() => { changeAccRecord(index, perfRecordList[0]) }} />
                <SmallBtn btnName="중" btnOnClick={() => { changeAccRecord(index, perfRecordList[1]) }} />
                <SmallBtn btnName="하" btnOnClick={() => { changeAccRecord(index, perfRecordList[2]) }} />
                <SmallBtn btnName="최하" btnOnClick={() => { changeAccRecord(index, perfRecordList[3]) }} />
              </SmallBtnWrapper>}</GridItem>
              {/* 5열 */}
              <GridItem>
                <SmallBtnWrapper className="gpt">
                  <i className="fa-solid fa-brain" style={{ cursor: "pointer", color: "#3454d1" }}
                    onClick={() => { setSelectedActi({ item: acti, index }); setIsGptModal(true); }} />
                  <img src={x_btn} style={{ width: "25px", height: "25px" }} alt="삭제x" onClick={(event) => handleDeleteActiOnClick(index)} />
                </SmallBtnWrapper>
              </GridItem>
              {/* 6열 */}
              <GridItem>{getByteLengthOfString(record)} Byte</GridItem>
            </GridRow>}
        </React.Fragment>
      })}
      {isModifying && <GridRow>
        <GridItem style={{ gridColumn: "1/7", gap: "20px" }} >
          <ClickableIcon className='fa-solid fa-plus' onClick={handleAddActiOnClick} />
        </GridItem>
      </GridRow>}
    </GridContainer>
    {/* 모달 */}
    {isGptModal && <GptModal
      show={isGptModal}
      onHide={() => setIsGptModal(false)}
      acti={selectedActi?.item}
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
const GridContainer = styled.div`
  margin: 10px auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  display: grid;
  grid-template-columns: 52px 100px 1fr 130px 80px 80px;
  @media screen and (max-width: 767px){
    grid-template-columns: 1fr 5fr;
  }
`
const GridItem = styled.div`
  display: flex;
  background-color: #efefef;
  padding: 10px;
  color: black;
  border: 1px solid #78787880;
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
const GridRow = styled.div`
  display: contents;
`
const Header = styled.div`
  height: 40px;
  display: flex;
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
const SmallBtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 2px;
  &.gpt { gap: 12px; }
`
export default ActiTableSection
