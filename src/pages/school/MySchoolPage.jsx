//라이브러리
import useClientHeight from "../../hooks/useClientHeight"
import { useEffect, useState } from "react"
import { useDispatch, } from "react-redux"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { setAllStudents } from "../../store/allStudentsSlice"
//페이지
import SignupSection from "./SignupSection"
import MySchoolSelectorSection from "./MySchoolSelectorSection"
//컴포넌트
import MainPanel from "../../components/MainPanel"
import CardList from "../../components/List/CardList"
import ClassMemberModal from "../../components/Modal/ApplyClassModal"
import SearchBar from "../../components/Bar/SearchBar"
import Pagenation from "../../components/Pagenation"
import UpperTab from "../../components/UpperTab"
import AnimMaxHightOpacity from "../../anim/AnimMaxHightOpacity"
//hooks
import useFireBasic from "../../hooks/Firebase/useFireBasic"
import useFireClassData from "../../hooks/Firebase/useFireClassData"
import useFirePetData from "../../hooks/Firebase/useFirePetData"
import useMediaQuery from "../../hooks/useMediaQuery"
import useFireTransaction from "../../hooks/useFireTransaction"
import useFetchRtMyUserData from "../../hooks/RealTimeData/useFetchRtMyUserData"
import useFireUserData from "../../hooks/Firebase/useFireUserData"
import useFireSchoolData from "../../hooks/Firebase/useFireSchoolData"
import useFireActiData from "../../hooks/Firebase/useFireActiData"

//생성(250121) -> 로직 수정(250216)-> 가입 섹션 분리(250218)
const MySchoolPage = () => {
  //준비
  const { myUserData: user } = useFetchRtMyUserData();
  useEffect(() => {
    if (!user) return;
    setMySchool(user?.school);
    fetchAllActis("uid", user?.uid, "subject", "담임").then((actiList) => { setActiList(actiList); });
  }, [user])
  const dispatcher = useDispatch();
  const navigate = useNavigate();
  const { fetchDoc } = useFireBasic("school");
  const { changeSchoolMaster } = useFireSchoolData();
  const { fetchClassrooms, sortClassrooms } = useFireClassData();
  const { leaveSchoolTransaction, changeIsTeacherTransaction } = useFireTransaction();
  const { fetchPets } = useFirePetData();
  const { updateUserArrayInfo } = useFireUserData();
  const { fetchAllActis } = useFireActiData();
  //시작
  const [_mySchool, setMySchool] = useState(null);                       //가입된 학교
  useEffect(() => {
    fetchHomeroomListInfo();                                             //가입 학교 담임반    
    fetchSchoolInfo();                                                   //가입 학교 정보
  }, [_mySchool]);
  const [_findSchool, setFindSchool] = useState(null);                   //검색된 학교
  useEffect(() => { fetchSchoolData(); }, [_findSchool])
  const [_selectedSchool, setSelectedSchool] = useState(null);           //검색 선택 학교
  const [schoolMaster, setSchoolMaster] = useState(null);
  const [memberList, setMemberList] = useState([]);
  useEffect(() => { sortMember(); }, [memberList]);                      //멤버 소팅
  const [teacherList, setTeacherList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  useEffect(() => { devideDataToPage() }, [studentList]);
  const [_selectedMember, setSelectedMember] = useState(null);           //선택 멤버 obj
  useEffect(() => { onSelectedMemberUpdate() }, [_selectedMember]);      //fetch 선택 교사 반 list
  const [subjKlassList, setSubjKlassList] = useState([]);
  const [_klass, setKlass] = useState(null);
  useEffect(() => { fetchPetListInfo(); }, [_klass]);                    //fetch 선택 반 pet list
  //페이지네이션
  const itemsPerPage = 20;
  const [currentStudentPage, setCurrentStudentPage] = useState(1);
  const [studentPageData, setStudentPageData] = useState([]);
  useEffect(() => { devideDataToPage(); }, [currentStudentPage]);
  //자율/진로 입력창
  const [tab, setTab] = useState(1);
  const [homeroomList, setHomeroomList] = useState([]);
  const [actiList, setActiList] = useState([]);
  //모달
  const [isKlassMemberModal, setIsKlassMemberModal] = useState(false);
  //반응형
  const isMobile = useMediaQuery("(max-width: 768px)");
  const clientHeight = useClientHeight(document.documentElement);
  const [isShowStudent, setIsShowStudent] = useState(false);
  //데이터
  //------함수부------------------------------------------------  
  //학교 외 다른 정보 초기화
  const initData = () => {
    setSelectedMember(null);
    setFindSchool(null);
    setSelectedSchool(null);
    setSubjKlassList([]);
    setTeacherList([]);
  }
  //학교 담임반 가져오기
  const fetchHomeroomListInfo = () => {
    const code = _mySchool?.schoolCode ?? null;
    if (!code) return;
    fetchClassrooms("schoolCode", code).then((list) => { setHomeroomList(list); });
  }
  //선택 멤버 변경시
  const onSelectedMemberUpdate = () => {
    if (!_selectedMember) return;
    if (_selectedMember.isTeacher) { fetchKlassroomsInfoByTeacher(); }
  }
  //학교 조회_school Col
  const fetchSchoolData = () => {
    if (!_findSchool) return;
    const code = _findSchool.schoolCode;
    fetchDoc(code).then((info) => {
      setSelectedSchool(info)
    })
  }
  //학교 정보 가져오기_(내 학교 정보)school Col
  const fetchSchoolInfo = async () => {
    initData();
    const code = _mySchool?.schoolCode ?? null;
    if (!code) return;
    fetchDoc(code).then((info) => {
      setSchoolMaster(info?.schoolMaster ?? null);
      setMemberList(info?.memberList ?? []);
    })
  }
  //멤버 분류하기
  const sortMember = () => {
    if (memberList.length === 0) return;
    const teacherList = [];
    const studentList = [];
    memberList.forEach((item) => {
      if (item.uid === user.uid) return; // 나 자신은 제외
      if (item.isTeacher === true) { teacherList.push(item); }
      else { studentList.push(item); }
    });
    setTeacherList(teacherList);
    setStudentList(studentList);
  }
  //선택 교사 클래스 가져오기 + 분류
  const fetchKlassroomsInfoByTeacher = () => {
    if (!_selectedMember) return;
    fetchClassrooms("uid", _selectedMember?.uid).then((list) => {
      const sorted = sortClassrooms(list)
      setSubjKlassList(sorted.subjClassList);
    })
  }
  //선택 클래스 pet 가져오기
  const fetchPetListInfo = () => {
    if (!_klass) return;
    fetchPets(_klass.id).then((list) => {
      dispatcher(setAllStudents(list))
    })
  }
  //페이지네이션 데이터 나누기
  const devideDataToPage = () => {
    const start = (currentStudentPage - 1) * itemsPerPage;
    const end = currentStudentPage * itemsPerPage;
    setStudentPageData(studentList?.slice(start, end));
  }
  //코티칭 체크
  const coTeachingCheck = (klassId) => {
    const coTeachingList = user.coTeachingList || [];
    const isApplied = coTeachingList?.find((item) => item.id === klassId)      //이미 신청 확인
    if (isApplied) return { isValid: false, msg: "이미 신청한 클래스입니다." }
    return { isValid: true, msg: "유효성 검사 통과" }
  }
  //공동 교사 신청
  const joinAsCoTeacher = (item, teacher) => {
    const madeBy = item.uid
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식
    const result = coTeachingCheck(item.id);
    if (!result.isValid) { window.alert(result.msg); }
    else {
      const promises = [updateUserArrayInfo(madeBy, "onSubmitList", { klass: item, teacher, type: "co-teacher", applyDate: today }), updateUserArrayInfo(user.uid, "coTeachingList", { ...item, isApproved: false })]
      Promise.all(promises).then(() => { window.alert("신청되었습니다.") })
    }
  }
  //멤버 클릭
  const handleMemberOnClick = (item) => { setSelectedMember(item); }
  //학생 클릭
  const handleStudentOnClick = (item) => { navigate(`/individual`, { state: { ...item } }) }
  //선택 해제
  const handleUnSelect = () => {
    setSelectedMember(null);
    setKlass(null);
  }
  //반 클릭
  const handleKlassOnClick = (item) => {
    setKlass(item);
    let confirm;
    if (user.isTeacher) { confirm = window.confirm(`${item.classTitle} 클래스에 공동 담당 교사로 신청하시겠습니까?`) }
    else { confirm = window.confirm(`${item.classTitle}에 가입 신청하시겠습니까?`); }
    if (!confirm) return;
    if (user.isTeacher) { joinAsCoTeacher(item, user) }
    else { setIsKlassMemberModal(true) }
  }
  //교사 학생 변경
  const handleIsTeacherChangeOnClick = () => {
    let messsage
    if (!_selectedMember) { alert(`교사/학생을 바꾸려는 멤버를 선택해주세요`); }
    else {
      if (_selectedMember.isTeacher) { messsage = window.confirm(`${_selectedMember.name} 교사를 학생으로 바꾸시겠습니까?`); }
      else { messsage = window.confirm(`${_selectedMember.name} 학생을 교사로 바꾸시겠습니까?`); }
    }
    if (messsage) { changeIsTeacherTransaction(_mySchool?.schoolCode, _selectedMember.uid).then(() => { alert("변경되었습니다.") }); }
  }
  //담당자 변경
  const handleMasterChangeOnClick = () => {
    let messsage
    if (_selectedMember) {
      if (!_selectedMember.isTeacher) {
        alert("학생은 담당자로 변경할 수 없습니다.🙅‍♂️");
        setSelectedMember(null);
        return;
      }
      messsage = window.prompt(`담당자를 ${_selectedMember.name} 교사로 바꾸시겠습니까? 진행하려면 '변경합니다'를 입력해주세요`);
    } else { alert("담당자를 바꾸시려면 먼저 교사를 선택해주세요"); }
    if (messsage === "변경합니다") { changeSchoolMaster(_mySchool?.schoolCode, _selectedMember.uid).then(() => { alert("변경되었습니다.") }); }
    else { alert("문구가 제대로 입력되지 않았습니다."); }
  }
  //학교 변경
  const handleChangeOnClick = () => {
    const confirm = window.prompt("학교를 변경하려면 먼저 현재 학교에서 탈퇴하셔야합니다. 현재 학교로 개설된 모든 클래스와 학생정보가 삭제되며 복구할 수 없습니다. 진행하려면 '탈퇴합니다'를 입력해주세요");
    if (confirm === "탈퇴합니다") { leaveSchoolTransaction(user.school.schoolCode); }
    else { alert("문구가 제대로 입력되지 않았습니다."); }
  }
  return (
    <>
      <Container $clientheight={clientHeight}>
        {/* 학교 가입자 */}
        {_mySchool && <>
          <MainPanel>
            <TitleText>{_mySchool?.schoolName}</TitleText>
            <p>{_mySchool?.eduOfficeName}</p>
            <p>{_mySchool?.address}</p>
            <p>{_mySchool?.schoolTel}</p>
            {_mySchool && <p>학교 코드: {_mySchool?.schoolCode}</p>}
            <p>담당자: {schoolMaster?.slice(0, 4) + "******" || "없음"}</p>
            <Row style={{ justifyContent: "flex-end", gap: "20px" }}>
              {user.uid === schoolMaster && <>
                <ClickableText onClick={handleIsTeacherChangeOnClick}>교사 학생 변경</ClickableText>
                <ClickableText onClick={handleMasterChangeOnClick}>담당자 변경</ClickableText>
              </>}
              <ClickableText onClick={handleChangeOnClick}>학교 탈퇴</ClickableText>
              <ClickableText onClick={() => { alert("학교 탈퇴 후에 회원 탈퇴를 진행하실 수 있습니다") }}>쫑알이 회원 탈퇴</ClickableText>
            </Row>
          </MainPanel>
          {/* 교사/학생명단 */}
          <MainPanel>
            {/* PC */}
            {!isMobile && <>
              <TitleText>{_mySchool?.schoolName} 등록 교사 명단</TitleText>
              {_mySchool && <CardList dataList={teacherList} type="member" onClick={handleMemberOnClick} selected={_selectedMember?.uid} />}
              <ClikableTitle onClick={() => { setIsShowStudent(!isShowStudent) }}>{_mySchool?.schoolName} 등록 학생 명단 ▼ </ClikableTitle>
              {_mySchool && <AnimMaxHightOpacity isVisible={isShowStudent}>
                <CardList dataList={studentPageData} type="member" onClick={handleStudentOnClick} selected={_selectedMember?.uid} />
                <Row style={{ justifyContent: "center" }}><Pagenation totalItems={studentList?.length ?? 1} itemsPerPage={20} currentPage={currentStudentPage} onPageChange={setCurrentStudentPage} /></Row>
              </AnimMaxHightOpacity>}
            </>}
            {/* 모바일 */}
            {(isMobile && !_selectedMember) && <><TitleText>{_mySchool?.schoolName} 등록 교사 명단</TitleText>
              {_mySchool && <CardList dataList={teacherList} type="member" onClick={handleMemberOnClick} selected={_selectedMember?.uid} />}</>}
            {(isMobile && _selectedMember) && <><TitleText onClick={handleUnSelect} style={{ textDecoration: "underLine", color: "royalBlue" }}>교사 목록 돌아가기</TitleText></>}
          </MainPanel>
          {/* 교과반/학생정보 */}
          {_selectedMember?.isTeacher && <MainPanel>
            {!isMobile && <SearchBar title="교과반 목록" type="classroom" list={subjKlassList} setList={setSubjKlassList} />}
            <CardList dataList={subjKlassList} type="classroom" onClick={handleKlassOnClick} />
          </MainPanel>}
          {/* 자율/진로 입력 */}
          {user?.isTeacher && <MainPanel styles={{ marginTop: "55px" }}>
            <TabWrapper>
              <UpperTab className="tab1" value={tab} top="-70px" onClick={() => { setTab(1) }}>자율</UpperTab>
              <UpperTab className="tab2" value={tab} top="-70px" left="59px" onClick={() => { setTab(2) }}>진로</UpperTab>
              <TitleText>자율/진로 입력창</TitleText>
              <MySchoolSelectorSection tab={tab} homeroomList={homeroomList} actiList={actiList} />
            </TabWrapper>
          </MainPanel>}
        </>}
        {/* 학교 미가입자 */}
        {!_mySchool && <SignupSection myUserData={user} findSchool={_findSchool} selectedSchool={_selectedSchool} setFindSchool={setFindSchool} TitleText={TitleText} ClickableText={ClickableText} />}
      </Container >
      {isKlassMemberModal && <ClassMemberModal show={isKlassMemberModal} onHide={() => { setIsKlassMemberModal(false) }} klass={_klass} myUserData={user} />}
    </>
  )
}

const Container = styled.div`
  box-sizing: border-box;
  width: 80%;
  min-height: 350px;
  margin: 0 auto 50px;
  @media (max-width: 768px){
    margin: 0;
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
const Row = styled.div`
  display: flex;
`
const TabWrapper = styled.div`
  position: relative;
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
const ClickableText = styled.p`
  margin: 0;
  color: gray;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    font-weight: bold;
    color: #3454d1;
  }
`
export default MySchoolPage