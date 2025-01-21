//라이브러리
import useClientHeight from "../../hooks/useClientHeight"
import { useEffect, useState } from "react"
//컴포넌트
import CardList from "../../components/List/CardList"
//hooks
import styled from "styled-components"
import FindSchoolSelect from "../../components/FindSchoolSelect"
import useFireBasic from "../../hooks/Firebase/useFireBasic"
import useFireClassData from "../../hooks/Firebase/useFireClassData"
import SearchBar from "../../components/Bar/SearchBar"
//25.01.21 생성
const UserMainPage = () => {
  //준비
  const { fetchDoc } = useFireBasic("school")
  const { fetchClassrooms, sortClassrooms } = useFireClassData();
  const [school, setSchool] = useState(null);
  useEffect(() => { fetchMemberList(); }, [school])       //fetch 학교 멤버 list
  const [memberList, setMemberList] = useState([]);
  useEffect(() => { sortMember() }, [memberList])         //멤버 소팅
  const [teacherList, setTeacherList] = useState([]);
  const [_selectedTeacher, setSelectedTeacher] = useState(null)         //선택 교사 uid
  useEffect(() => { fetchClassroomList(); }, [_selectedTeacher]) //fetch 선택 교사 반
  const [subjKlassList, setSubjKlassList] = useState([])
  const [homeKlassList, setHomeKlassList] = useState([])
  //모니터
  const clientHeight = useClientHeight(document.documentElement)

  //------함수부------------------------------------------------  
  //학교 외 다른 정보 초기화
  const initData = () => {
    setSelectedTeacher(null);
    setSubjKlassList([]);
    setHomeKlassList([]);
    setTeacherList([]);
  }

  //학교 멤버 정보 가져오기
  const fetchMemberList = async () => {
    if (!school) return;
    initData();
    let code = school.schoolCode
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
    if (!_selectedTeacher) return;
    fetchClassrooms("uid", _selectedTeacher).then((list) => {
      let sorted = sortClassrooms(list)
      setSubjKlassList(sorted.subjClassList);
      setHomeKlassList(sorted.homeroomClassList);
    })
  }

  //멤버 클릭
  const handleMemberOnClick = (item) => {
    setSelectedTeacher(item.uid)
  }

  //반 클릭
  const handleClassOnClick = (item) => {
    let confirm = window.confirm(`${item.classTitle}에 가입 신청하시겠습니까?`)
  }

  return (
    <Container $clientheight={clientHeight}>
      <h4 style={{ fontWeight: "bold", margin: "10px" }}>학교 찾기</h4>
      <Row style={{ borderTop: "1px solid rgba(120,120,120,0.5)", padding: "15px 0" }}>
        <SchoolFinderWrapper>
          <FindSchoolSelect setSchool={setSchool} />
        </SchoolFinderWrapper>
      </Row>
      {school && <>
        <SearchBar title="교사 목록" />
        < CardList dataList={teacherList} type="teacher" onClick={handleMemberOnClick} selected={_selectedTeacher} /></>}
      {_selectedTeacher && <>
        <SearchBar title="교과반 목록" type="classroom" list={subjKlassList} setList={setSubjKlassList} />
        <CardList dataList={subjKlassList} type="classroom" onClick={handleClassOnClick} />
        <SearchBar title="담임반 목록" />
        <CardList dataList={homeKlassList} type="homeroom" />
      </>}
    </Container>
  )
}
const Container = styled.div`
  box-sizing: border-box;
  margin: 15px 0;
  @media screen and (max-width: 767px){
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
const SchoolFinderWrapper = styled.div`
  width: 60%;

`
export default UserMainPage