//라이브러리
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectClass } from '../../store/classSelectedSlice';
//컴포넌트
import Container from '../../components/MainPanel';
import TwoRadios from '../../components/Radio/TwoRadios';
import DotTitle from '../../components/Title/DotTitle';
//hooks
import useFireClassData from '../../hooks/Firebase/useFireClassData';
import useDeleteFireData from '../../hooks/Firebase/useDeleteFireData';
import useFireUserData from '../../hooks/Firebase/useFireUserData';
//분리 생성(250211) => 기능 분산(250909)
const ClassBoardSection = ({ userStatus, klassData, studentList }) => {
  useEffect(() => { bindKlassData(); }, [klassData]);
  const user = useSelector(({ user }) => user);
  const navigate = useNavigate();
  const dispatcher = useDispatch();
  const { updateUserInfo } = useFireUserData();
  const { deleteClassWithStudents } = useDeleteFireData();
  const { updateClassroom, deleteKlassroomArrayInfo, copyKlassroom } = useFireClassData();
  const [_title, setTitle] = useState('');
  const [_intro, setIntro] = useState('');
  const [_notice, setNotice] = useState('');
  const [noticeList, setNoticeList] = useState([]);
  const [_isPublic, setIsPublic] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  //변경 가능 데이터 바인딩
  const bindKlassData = () => {
    if (!klassData) return;
    const { classTitle, intro, notice, isPublic } = klassData;
    dispatcher(setSelectClass(klassData));
    setTitle(classTitle || '정보 없음');
    setIntro(intro || '정보 없음');
    setNotice(notice || '공지 없음');
    splitNotice(notice || []);
    setIsPublic(isPublic || false);
  }
  //공지사항 list 변환
  const splitNotice = (notice) => {
    if (notice.length === 0) { setNoticeList([]); }
    else {
      const arr = notice.split("^").map((item) => item.trim()).slice(0, 3);
      setNoticeList(arr);
    }
  }
  //변경 저장
  const handleSaveOnClick = () => {
    const confirm = window.confirm("이대로 클래스 정보를 변경하시겠습니까?");
    if (confirm) {
      const classInfo = { title: _title, intro: _intro, notice: _notice, isPublic: _isPublic };
      updateClassroom(classInfo, klassData.id);
      setIsModifying(false);
    }
  }
  //변경 취소
  const handleCancelOnClick = () => {
    bindKlassData();
    setIsModifying(false);
  }
  //클래스 복제
  const handleCopyOnClick = () => {
    const { classTitle } = klassData;
    const copyConfrim = window.prompt("클래스를 복제하시겠습니까? 클래스 이름을 입력하세요.", `2학기 ${classTitle} 사본`);
    if (copyConfrim === null) return;
    if (copyConfrim !== '') {
      copyKlassroom(klassData, studentList, copyConfrim).then(() => {
        alert("복제 되었습니다");
        navigate("/classRooms");
      })
    } else alert("클래스 제목을 입력해주세요.");
  }
  //클래스 삭제
  const handleDeleteOnClick = () => {
    const deleteConfirm = window.prompt("클래스를 삭제하시겠습니까? 반 학생정보도 함께 삭제됩니다. 삭제하시려면 '삭제합니다'를 입력하세요.");
    if (deleteConfirm === "삭제합니다") {
      deleteClassWithStudents(klassData.id).then(() => {
        alert("클래스와 모든 학생 정보가 삭제 되었습니다.")
        navigate("/classRooms");
      })
    } else alert("문구가 제대로 입력되지 않았습니다.");
  }
  //코티칭 탈퇴
  const handleDropOutOnClick = () => {
    const confirm = window.confirm("코티칭 클래스를 탈퇴하시겠습니까?");
    if (confirm) {
      const deletedList = user.coTeachingList.filter((item) => item.id !== klassData?.id);
      updateUserInfo("coTeachingList", deletedList);                                     //유저 코티칭 list에서 삭제
      deleteKlassroomArrayInfo(klassData.id, "coTeacher", user.uid);                     //클래스 코티쳐 list에서 삭제
      navigate("/classRooms");
    }
  }
  return (
    <Container>
      {!isModifying && <BoldText>{_title}</BoldText>}
      {isModifying && <ModifyingInput type='text' value={_title} onChange={(event) => { setTitle(event.target.value) }} placeholder='반 제목을 수정해주세요'></ModifyingInput>}
      <SubjectText>{klassData?.subject || "담임"}-{klassData?.subjDetail || "담임"}</SubjectText>
      <Row style={{ gap: "15px", justifyContent: "center" }}>
        <Board>
          <InfoText>Class Info.</InfoText>
          <Row><DotTitle title={"반 정보"} />
            {!isModifying
              ? <BasicText>{_intro}</BasicText>
              : <ModifyingInput type='text' value={_intro} onChange={(event) => { setIntro(event.target.value) }} placeholder='반 설명을 간단히 입력하세요'></ModifyingInput>}
          </Row>
          <Row><DotTitle title={"학생 수"} /><BasicText>{!studentList ? 0 : studentList.length}명</BasicText></Row>
          <Row>
            <DotTitle title={"학생 공개 여부"} />
            {!isModifying
              ? <BasicText>{klassData?.isPublic ? "공개" : "비공개"}</BasicText>
              : <TwoRadios name="isPublic"
                id={["public", "private"]}
                label={["공개 활동", "비공개 활동"]}
                value={_isPublic}
                onChange={() => { setIsPublic(!_isPublic); }}
              />
            }
          </Row>
        </Board>
        <Board>
          <InfoText>Notice</InfoText>
          {(noticeList.length !== 0 && !isModifying) && noticeList.map((item, index) => {
            return <p key={item}>{index + 1}. {item}</p>
          })}
          {isModifying && <ModifyingTextarea value={_notice} onChange={(event) => { setNotice(event.target.value) }}
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

