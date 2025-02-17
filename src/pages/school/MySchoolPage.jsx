//라이브러리
import useClientHeight from "../../hooks/useClientHeight"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setAllStudents } from "../../store/allStudentsSlice"
import styled from "styled-components"
//페이지
import SignupSection from "./SignupSection"
//컴포넌트
import MainPanel from "../../components/MainPanel"
import CardList from "../../components/List/CardList"
import ClassMemberModal from "../../components/Modal/ApplyClassModal"
import SearchBar from "../../components/Bar/SearchBar"
//hooks
import useFireBasic from "../../hooks/Firebase/useFireBasic"
import useFireClassData from "../../hooks/Firebase/useFireClassData"
import useFirePetData from "../../hooks/Firebase/useFirePetData"
import useMediaQuery from "../../hooks/useMediaQuery"
import useFireTransaction from "../../hooks/useFireTransaction"
import useFetchRtMyUserData from "../../hooks/RealTimeData/useFetchRtMyUserData"
import useFireUserData from "../../hooks/Firebase/useFireUserData"

//25.01.21 생성 -> 로직 수정(250216)-> 가입 섹션 분리(250218)
const MySchoolPage = () => {
  //준비
  const { myUserData: user } = useFetchRtMyUserData();
  useEffect(() => { setMySchool(user?.school) }, [user])
  const dispatcher = useDispatch();
  const { fetchDoc } = useFireBasic("school");
  const { fetchClassrooms, sortClassrooms } = useFireClassData();
  const { leaveSchoolTransaction } = useFireTransaction();
  const { fetchPets } = useFirePetData();
  const { updateUserArrayInfo } = useFireUserData();
  const [_mySchool, setMySchool] = useState(null);                       //가입된 학교
  useEffect(() => { fetchMemberList(); }, [_mySchool]);                  //가입 학교 멤버
  const [_findSchool, setFindSchool] = useState(null);                   //검색된 학교
  useEffect(() => { fetchSchoolData(); }, [_findSchool])
  const [_selectedSchool, setSelectedSchool] = useState(null);           //검색 선택 학교     
  const [memberList, setMemberList] = useState([]);
  useEffect(() => { sortMember() }, [memberList]);        //멤버 소팅
  const [teacherList, setTeacherList] = useState([]);
  const [_teacher, setTeacher] = useState(null);          //선택 교사 uid
  useEffect(() => { fetchClassroomList(); }, [_teacher]); //fetch 선택 교사 반 list
  const [subjKlassList, setSubjKlassList] = useState([]);
  const [_klass, setKlass] = useState(null);
  useEffect(() => { fetchPetList(); }, [_klass]);         //fetch 선택 반 pet list
  //모달
  const [isModal, setIsModal] = useState(false);
  //반응형
  const isMobile = useMediaQuery("(max-width: 768px)");
  const clientHeight = useClientHeight(document.documentElement);

  //------함수부------------------------------------------------  
  //학교 외 다른 정보 초기화
  const initData = () => {
    setTeacher(null);
    setFindSchool(null);
    setSelectedSchool(null);
    setSubjKlassList([]);
    setTeacherList([]);
  }
  //학교 조회_school Col
  const fetchSchoolData = () => {
    if (!_findSchool) return;
    const code = _findSchool.schoolCode;
    fetchDoc(code).then((info) => {
      setSelectedSchool(info)
    })
  }
  //학교 멤버 정보 가져오기_school Col
  const fetchMemberList = async () => {
    if (!_mySchool) return;
    initData();
    const code = _mySchool.schoolCode;
    if (!code) return;
    fetchDoc(code).then((info) => {
      setMemberList(info?.memberList ?? [])
    })
  }
  //멤버 분류하기
  const sortMember = () => {
    if (memberList.length === 0) return;
    let teacherList = []
    let studentList = []
    memberList.forEach((member) => {
      const isTeacher = member.isTeacher
      if (isTeacher === true) { teacherList.push(member) }
      else { studentList.push(member) }
    })
    setTeacherList(teacherList);
  }
  //선택 교사 클래스 가져오기 + 분류
  const fetchClassroomList = () => {
    if (!_teacher) return;
    fetchClassrooms("uid", _teacher).then((list) => {
      let sorted = sortClassrooms(list)
      setSubjKlassList(sorted.subjClassList);
    })
  }
  //선택 클래스 pet 가져오기
  const fetchPetList = () => {
    if (!_klass) return;
    fetchPets(_klass.id).then((list) => {
      dispatcher(setAllStudents(list))
    })
  }
  //공동 교사 신청
  const joinAsCoTeacher = (item, teacher) => {
    const madeBy = item.uid
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식
    const promises = [updateUserArrayInfo(madeBy, "onSubmitList", { klass: item, teacher, type: "co-teacher", applyDate: today }), updateUserArrayInfo(user.uid, "coTeachingList", { ...item, isApproved: false })]
    Promise.all(promises).then(() => { window.alert("신청 되었습니다.") })
  }
  //멤버 클릭
  const handleMemberOnClick = (item) => {
    setTeacher(item.uid)
  }
  //선택 해제
  const handleUnSelect = () => {
    setTeacher(null);
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
    else { setIsModal(true) }
  }
  //학교 변경
  const handleChangeOnClick = () => {
    const confirm = window.prompt("학교를 변경하려면 먼저 현재 학교에서 탈퇴하셔야합니다. 현재 학교로 개설된 모든 클래스와 학생정보가 삭제되며 복구할 수 없습니다. 진행하려면 '탈퇴합니다'를 입력해주세요");
    if (confirm === "탈퇴합니다") {
      leaveSchoolTransaction(user.school.schoolCode);
    } else {
      window.alert("문구가 제대로 입력되지 않았습니다.");
    }
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
            <Row style={{ justifyContent: "flex-end" }}><ClickableText onClick={handleChangeOnClick}>학교 변경</ClickableText></Row>
          </MainPanel>
          <MainPanel>
            {!isMobile && <><TitleText>{_mySchool?.schoolName} 등록 교사 명단</TitleText>
              {_mySchool && <CardList dataList={teacherList} type="teacher" onClick={handleMemberOnClick} selected={_teacher} />}</>}
            {(isMobile && !_teacher) && <><TitleText>{_mySchool?.schoolName} 등록 교사 명단</TitleText>
              {_mySchool && <CardList dataList={teacherList} type="teacher" onClick={handleMemberOnClick} selected={_teacher} />}</>}
            {(isMobile && _teacher) && <><TitleText onClick={handleUnSelect} style={{ textDecoration: "underLine", color: "royalBlue" }}>교사 목록 돌아가기</TitleText></>}
          </MainPanel>
          {_teacher && <MainPanel>
            {!isMobile && <SearchBar title="교과반 목록" type="classroom" list={subjKlassList} setList={setSubjKlassList} />}
            <CardList dataList={subjKlassList} type="classroom" onClick={handleKlassOnClick} />
          </MainPanel>}
        </>}
        {/* 학교 미가입자 */}
        {!_mySchool && <SignupSection myUserData={user} findSchool={_findSchool} selectedSchool={_selectedSchool} setFindSchool={setFindSchool}
          Row={Row} Wrapper={Wrapper} TitleText={TitleText} ClickableText={ClickableText} />}
      </Container>
      {isModal && <ClassMemberModal show={isModal} onHide={() => { setIsModal(false) }} klass={_klass} />}
    </>
  )
}

const Container = styled.div`
  box-sizing: border-box;
  width: 80%;
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
  justify-content: center;
`
const Wrapper = styled(Row)`
  margin: 0 auto;
  width: 80%;
`
const TitleText = styled.h5`
  display: flex;
  justify-content: center;
  color: #3a3a3a;
  font-weight: bold;
  margin: 10px auto;
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