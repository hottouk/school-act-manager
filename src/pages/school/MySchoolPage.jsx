import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Badge } from "react-bootstrap"
import styled from "styled-components"
//components
import MainContainer from "../../components/Styled/MainContainer"
import MainWrapper from "../../components/Styled/MainWrapper"
import SubNav from "../../components/Bar/SubNav"
import CardList from "../../components/List/CardList"
import SearchBar from "../../components/Bar/SearchBar"
import Pagenation from "../../components/Pagenation"
import AnimMaxHightOpacity from "../../anim/AnimMaxHightOpacity"
import ClickableIcon from "../../components/Styled/ClickableIcon"
import EmptyResult from "../../components/EmptyResult"
import MidBtn from "../../components/Btn/MidBtn"
import Title from "../../components/Title/Title"
import ClassMemberModal from "../../components/Modal/ApplyClassModal"
//hooks
import useFireClassData from "../../hooks/Firebase/useFireClassData"
import useMediaQuery from "../../hooks/useMediaQuery"
import useFireTransaction from "../../hooks/useFireTransaction"
import useFireUserData from "../../hooks/Firebase/useFireUserData"
import useFireSchoolData from "../../hooks/Firebase/useFireSchoolData"
//생성(250121) -> 로직 수정(250216)-> 가입 섹션 분리(250218) -> 탈퇴 분리(260210)
const MySchoolPage = () => {
  const navigate = useNavigate();
  const { userRtData, userDataListener, updateUserArrayInfo, } = useFireUserData();
  const { schoolRtData, schoolDataListener, changeSchoolMaster } = useFireSchoolData();
  const { fetchClassrooms, sortClassrooms } = useFireClassData();
  const { changeIsTeacherTransaction } = useFireTransaction();
  //멤버, 권한
  const { teacherList, studentList, isMaster } = useMemo(() => {
    if (!schoolRtData || !userRtData) return { memberList: [], teacherList: [], studentList: [], isMaster: false };
    const memberList = schoolRtData?.memberList ?? [];
    const isMaster = schoolRtData.schoolMaster === userRtData?.uid;
    if (!memberList || memberList.length === 0) { return { memberList: [], teacherList: [], studentList: [], isMaster }; }
    const teachers = [];
    const students = [];
    memberList.forEach((item) => {
      if (item.uid === userRtData?.uid) return;
      if (item.isTeacher) { teachers.push(item); }
      else { students.push(item); }
    });
    return { memberList, teacherList: teachers, studentList: students, isMaster };
  }, [schoolRtData, userRtData]);
  //담당자 모드
  const [mode, setMode] = useState("general");
  const nextModes = { general: "roleChange", roleChange: "masterChange", masterChange: "general" };
  //선택 멤버
  const [selectedMember, setSelectedMember] = useState(null);
  //선택 멤버 변경
  useEffect(() => {
    if (!selectedMember || mode !== "general") return;
    if (selectedMember.isTeacher) {
      const fetchKlassrooms = async () => {
        const list = await fetchClassrooms("uid", selectedMember.uid);
        const { subjClassList } = sortClassrooms(list);
        setKlassList(subjClassList);
      };
      fetchKlassrooms();
    }
  }, [mode, selectedMember, fetchClassrooms, sortClassrooms]);
  const [klassList, setKlassList] = useState([]);
  const [selectedKlass, setSelectedKlass] = useState(null);
  //페이지네이션
  const itemsPerPage = 20;
  const [currentStudentPage, setCurrentStudentPage] = useState(1);
  const [studentPageData, setStudentPageData] = useState([]);
  //모달
  const [isKlassMemberModal, setIsKlassMemberModal] = useState(false);
  //반응형
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isShowStudent, setIsShowStudent] = useState(false);
  //**useEffect**/
  //유저
  useEffect(() => userDataListener(), []);
  //학교
  useEffect(() => {
    if (!userRtData) return;
    const code = userRtData.school?.schoolCode || null;
    if (!code) return;
    schoolDataListener(code);
  }, [userRtData]);
  //모드 변경
  useEffect(() => {
    setSelectedMember(null);
    setKlassList([]);
    setSelectedKlass(null);
  }, [mode]);

  //페이지네이션 데이터 나누기
  useEffect(() => {
    const devideDataToPage = () => {
      const start = (currentStudentPage - 1) * itemsPerPage;
      const end = currentStudentPage * itemsPerPage;
      setStudentPageData(studentList?.slice(start, end));
    };
    devideDataToPage();
  }, [studentList, currentStudentPage]);
  //**함수부**
  //세팅 메뉴
  const handleChangeMode = () => {
    if (!isMaster) { alert("담당자 권한이 없습니다."); return; }
    setMode((prev) => nextModes[prev]);
  }
  //**교사**
  //코티칭 체크
  const coTeachingCheck = (klassId) => {
    const coTeachingList = userRtData?.coTeachingList || [];
    const isApplied = coTeachingList?.find((item) => item.id === klassId);      //이미 신청 확인
    if (isApplied) return { isValid: false, msg: "이미 신청한 클래스입니다." }
    return { isValid: true, msg: "유효성 검사 통과" }
  };
  //코티칭 신청
  const joinAsCoTeacher = async (item, teacher) => {
    const madeBy = item.uid;
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식
    const result = coTeachingCheck(item.id);
    if (!result.isValid) { alert(result.msg); return; }
    const promises = [
      updateUserArrayInfo(madeBy, "onSubmitList", { klass: item, teacher, type: "co-teacher", applyDate: today }),
      updateUserArrayInfo(userRtData?.uid, "coTeachingList", { ...item, isApproved: false })
    ];
    await Promise.all(promises).then(() => { window.alert("신청되었습니다.") });
  }
  //클래스 클릭
  const handleKlassOnClick = (item) => {
    setSelectedKlass(item);
    let confirm;
    if (userRtData.isTeacher) { confirm = window.confirm(`${item.classTitle} 클래스에 공동 담당 교사로 신청하시겠습니까?`); }
    else { confirm = window.confirm(`${item.classTitle}에 가입 신청하시겠습니까?`); }
    if (!confirm) return;
    if (userRtData.isTeacher) { joinAsCoTeacher(item, userRtData); }
    else { setIsKlassMemberModal(true); }
  }
  //**모드별 핸들러**
  //멤버 선택
  const handleMemberOnClick = useCallback((item) => {
    setSelectedMember(prev => prev === item ? null : item);
  }, []);
  //교사/학생 변경
  const handleRoleChangeOnClick = useCallback(async (member) => {
    let confirm;
    if (member.isTeacher) { confirm = window.confirm(`${member.name} 교사를 학생으로 바꾸시겠습니까?`); }
    else { confirm = window.confirm(`${member.name} 학생을 교사로 바꾸시겠습니까?`); }
    if (!confirm) return;
    await changeIsTeacherTransaction(schoolRtData?.schoolCode, member.uid);
    alert("변경되었습니다.");
  }, [schoolRtData?.schoolCode, changeIsTeacherTransaction]);
  //담당자 변경
  const handleMasterChangeOnClick = useCallback(async (member) => {
    if (!member.isTeacher) { alert("학생은 담당자로 변경할 수 없습니다.🙅‍♂️"); return; }
    const prompt = window.prompt(`담당자를 ${member.name} 교사로 바꾸시겠습니까? 진행하려면 '변경합니다'를 입력해주세요`);
    if (prompt !== "변경합니다") { alert("문구가 제대로 입력되지 않았습니다."); return; }
    await changeSchoolMaster(schoolRtData?.schoolCode, member.uid);
    alert("변경 되었습니다.");
    setMode("general");
  }, [schoolRtData?.schoolCode, changeSchoolMaster]);
  //종합
  const handleByMode = useCallback((item) => {
    if (mode === "roleChange") return handleRoleChangeOnClick(item);
    if (mode === "masterChange") return handleMasterChangeOnClick(item);
    return handleMemberOnClick(item);
  }, [mode, handleMemberOnClick, handleRoleChangeOnClick, handleMasterChangeOnClick]);
  return (
    <>
      <MainContainer styles={{ gap: "10px" }}>
        <SubNav>
          <ClickableIcon className={"fa solid fa-gear"} onClick={handleChangeMode} />
          {mode === "roleChange" && <Badge>교사/학생 변경</Badge>}
          {mode === "masterChange" && <Badge>담당자 이양</Badge>}
        </SubNav>
        {/* 학교 가입자 */}
        {!schoolRtData && <MainWrapper>
          <Center>
            <EmptyResult comment={"가입된 학교가 없습니다."} />
            <MidBtn onClick={() => navigate("/myinfo/school")}>학교 가입하러 가기</MidBtn>
          </Center>
        </MainWrapper>}
        {(!isMobile && schoolRtData) && <MainWrapper>
          <Title>{schoolRtData?.schoolName} 등록 교사 명단</Title>
          <CardList
            dataList={teacherList}
            type="member"
            onClick={handleByMode}
            selected={selectedMember?.uid} />
          <ClikableTitle onClick={() => { setIsShowStudent(!isShowStudent) }}>{schoolRtData?.schoolName} 등록 학생 명단 ▼ </ClikableTitle>
          <AnimMaxHightOpacity isVisible={isShowStudent}>
            <CardList dataList={studentPageData} type="member" onClick={handleByMode} selected={selectedMember?.uid} />
            <Row style={{ justifyContent: "center" }}><Pagenation totalItems={studentList?.length ?? 1} itemsPerPage={20} currentPage={currentStudentPage} onPageChange={setCurrentStudentPage} /></Row>
          </AnimMaxHightOpacity>
        </MainWrapper>}
        {/* 교과반*/}
        {selectedMember?.isTeacher && <MainWrapper>
          {!isMobile && <SearchBar title="교과반 목록" type="classroom" list={klassList} setList={setKlassList} />}
          <CardList dataList={klassList} type="subjKlass" onClick={handleKlassOnClick} />
        </MainWrapper>}
      </MainContainer >
      {isKlassMemberModal && <ClassMemberModal show={isKlassMemberModal} onHide={() => { setIsKlassMemberModal(false) }} klass={selectedKlass} myUserData={userRtData} />}
    </>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const Center = styled(Column)`
  align-items: center;
`
const TitleText = styled.h5`
  display: flex;
  justify-content: center;
  color: #3a3a3a;
  font-weight: bold;
  margin: 10px auto;
`
const ClikableTitle = styled(TitleText)`
  cursor: pointer;
`
export default MySchoolPage