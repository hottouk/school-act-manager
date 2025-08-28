//라이브러리
import React from 'react'
import styled from 'styled-components'
//컴포넌트
import Container from '../../components/MainPanel';
import TwoRadios from '../../components/Radio/TwoRadios';
import DotTitle from '../../components/Title/DotTitle';
//분리 생성(250211)
const ClassBoardSection = ({ userStatus, isModifying, klassData, title, intro, notice, studentList, noticeList,
  setIsModifying, setTitle, setIntro, setNotice, handleSaveOnClick, handleCancelOnClick, handleDeleteOnClick, handleDropOutOnClick, handleCopyOnClick }) => {
  return (
    <Container>
      {!isModifying && <BoldText>{title}</BoldText>}
      {isModifying && <ModifyingInput type='text' value={title} onChange={(event) => { setTitle(event.target.value) }} placeholder='반 제목을 수정해주세요'></ModifyingInput>}
      <SubjectText>{klassData?.subject || "담임"}-{klassData?.subjDetail || "담임"}</SubjectText>
      <Row style={{ gap: "15px", justifyContent: "center" }}>
        <Board>
          <InfoText>Class Info.</InfoText>
          <Row><DotTitle title={"반 정보"} />
            {!isModifying
              ? <BasicText>{intro}</BasicText>
              : <ModifyingInput type='text' value={intro} onChange={(event) => { setIntro(event.target.value) }} placeholder='반 설명을 간단히 입력하세요'></ModifyingInput>}
          </Row>
          <Row><DotTitle title={"학생 수"} /><BasicText>{!studentList ? 0 : studentList.length}명</BasicText></Row>
        </Board>
        <Board>
          <InfoText>Notice</InfoText>
          {(noticeList.length !== 0 && !isModifying) && noticeList.map((item, index) => {
            return <p key={item}>{index + 1}. {item}</p>
          })}
          {isModifying && <ModifyingTextarea value={notice} onChange={(event) => { setNotice(event.target.value) }}
            placeholder='공지를 작성해주세요. ^(눈웃음 기호)를 사용하여 줄바꿈할 수 있습니다.'></ModifyingTextarea>}
        </Board>
      </Row>
      {(userStatus === "master") &&
        <Row style={{ justifyContent: "flex-end", marginTop: "20px", gap: "20px" }}>
          {!isModifying && <MarginalText onClick={() => { setIsModifying((prev) => !prev) }}>정보 수정</MarginalText>}
          {!isModifying && <MarginalText onClick={handleCopyOnClick}>클래스 복제</MarginalText>}
          {!isModifying && <MarginalText onClick={handleDeleteOnClick}>클래스 삭제</MarginalText>}
          {isModifying && <MarginalText onClick={handleSaveOnClick}>변경 저장</MarginalText>}
          {isModifying && <MarginalText onClick={handleCancelOnClick}>취소</MarginalText>}
        </Row>}
      {(userStatus === "coTeacher") &&
        <Row style={{ justifyContent: "flex-end", marginTop: "20px", gap: "20px" }}>
          {!isModifying && <MarginalText onClick={handleDropOutOnClick}>코티칭 클래스 탈퇴</MarginalText>}
        </Row>}
    </Container>
  )
}

const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const Board = styled(Column)`
  width: 50%;
  padding: 12px;
  gap: 10px;
  border: 1px solid rgba(120,120,120,0.5);
  border-radius: 15px;
`
const BasicText = styled.p`
  margin:0;
`
const BoldText = styled.h2`
  color; #3a3a3a;
  display: flex;
  font-weight: bold;
  justify-content: center;
`
const SubjectText = styled.p`
  text-align: right;
  font-size: 20px;
  font-weight: 600;
  color: #3454d1;
`
const InfoText = styled.p`
  text-align: center;
  font-size: 16px;
  font-weight: 600;
`
const MarginalText = styled.p`
  font-size: 14px;
  color: rgb(120, 120, 120);
  text-decoration: underline;
  margin-bottom: 0;
  cursor: pointer;
  &:hover { color: #3454d1; }
`
const ModifyingInput = styled.input`
  width: 100%;
  height: 35px;
  border: 1px solid #3a3a3a;
  border-radius: 5px;
  margin: 10px auto;
  padding: 4px;
`
const ModifyingTextarea = styled.textarea`
  width: 100%;
  border: 1px solid #3a3a3a;
  height: 70px;
  border-radius: 5px;
  padding: 4px;
`

export default ClassBoardSection

