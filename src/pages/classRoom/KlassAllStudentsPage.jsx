import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useReactToPrint } from "react-to-print"
import Select from 'react-select'
import { useSelector } from "react-redux"
import styled from "styled-components"
//컴포넌트
import MainContainer from "../../components/Styled/MainContainer"
import ExportAsExcel from "../../components/ExportAsExcel"
import SubNav from "../../components/Bar/SubNav"
import BackBtn from "../../components/Btn/BackBtn"
import ClickableIcon from "../../components/Styled/ClickableIcon"
import UpperTab from "../../components/UpperTab"
import EmptyResult from "../../components/EmptyResult"
//hooks
import useGetByte from "../../hooks/useGetByte"
import useFetchRtMyStudentData from "../../hooks/RealTimeData/useFetchRtMyStudentListData"
import useFirePetData from "../../hooks/Firebase/useFirePetData"
//최근 업데이트(241027) -> actList 직접 읽기(250718) -> 1/2학기, 담임반 통합(260121)
const ClassAllStudents = () => {
  //시작
  const user = useSelector(({ user }) => user);
  useEffect(() => setIsVisible(true), []);
  //준비
  const params = useParams(); //id와 param의 key-value(id:'id') 오브젝트로 반환
  const navigate = useNavigate();
  //학급
  const classId = params.id
  const { state } = useLocation();
  const { semester } = state || {};
  const thisKlass = useSelector(({ classSelected }) => classSelected);
  //탭
  const [_semester, setSemester] = useState(semester || 1);
  const [_tabType, setTabType] = useState(1);
  //활동
  const allActivityList = useSelector((state) => state.allActivities);
  //★학생
  const { studentDataList } = useFetchRtMyStudentData("classRooms", classId, "students", "studentNumber");
  useEffect(() => bindStudentInfo(), [studentDataList]);
  const [_studentList, setStudentList] = useState([]);
  const { updateAllPetInfo } = useFirePetData();
  const { getByteLengthOfString } = useGetByte();
  //★종합
  const [_studentActiInfoList, setStudentActiInfoList] = useState([]);
  //행 수정
  const [isModifying, setIsModifying] = useState('');
  const [_origin, setOrigin] = useState(null);
  //에니메이션
  const [isVisible, setIsVisible] = useState(false);
  //인쇄
  const printRef = useRef({});
  const handlePrint = useReactToPrint({ contentRef: printRef });
  //css
  const nameFontStyle = { cursor: "pointer", fontWeight: "bold", textDecoration: "underline" };
  //------함수부------------------------------------------------
  const bindStudentInfo = () => {
    if (!studentDataList) return;
    const infoList = studentDataList.map(student => {
      const { studentNumber, writtenName, behaviorOpinion } = student;
      const actiList = student.actList ?? [];
      const result = sortByKlassType(actiList, behaviorOpinion);
      return { id: student.id, studentNumber, writtenName, ...result };
    });
    setStudentActiInfoList(infoList);
    setStudentList(studentDataList);
  };
  //분류
  const sortByKlassType = (actiList, behaviorOpinion) => {
    const firstList = [];
    const secondList = [];
    const thirdList = [];
    if (thisKlass.type === "homeroom") {
      for (const acti of actiList) {
        if (acti.subjDetail === "자율") firstList.push(acti);
        else if (acti.subjDetail === "진로") secondList.push(acti);
      }
      thirdList.push({ uid: user.uid, record: behaviorOpinion || '' });
    } else {
      for (const acti of actiList) {
        (acti.semester === 2 ? secondList : firstList).push(acti);
      }
    }
    return { firstList, secondList, thirdList, };
  }
  //실시간 acc
  const getAccRec = (list) => list?.reduce((acc, cur) => acc + " " + cur.record, '');
  //수정 버튼
  const handleEditOnClick = (key) => {
    setOrigin(JSON.parse(JSON.stringify(_studentActiInfoList))); //깊은 복사(배열, obj는 메모리 참조)
    setIsModifying(key);
  }
  //취소 버튼
  const handleCacncelOnClick = () => {
    setIsModifying('');
    setStudentActiInfoList(JSON.parse(JSON.stringify(_origin))); //깊은 복사
  }
  //키 분류
  const getKeyByKlassType = () => {
    return thisKlass.type === "subject"
      ? (_semester === 1 ? "firstList" : "secondList")
      : (_tabType === 1 ? "firstList" : _tabType === 2 ? "secondList" : "thirdList");
  }
  //활동 추가
  const handleAddActiOnClick = (id) => {
    const assignedDate = new Date().toISOString();
    setStudentActiInfoList(prev => prev.map((student) => {
      if (student.id !== id) return student;
      const randomId = crypto.randomUUID();
      const key = getKeyByKlassType();
      const newActi = {
        id: randomId, title: "임의기록", record: "", uid: user.uid, assignedDate,
        ...(thisKlass.type === "subject" ? { semester: _semester } : {})
      };
      return { ...student, [key]: [...student[key], newActi] };
    })
    )
  }
  //활동 삭제
  const handleDeleteOnClick = (id, actiIdx) => {
    setStudentActiInfoList(prev => prev.map((student) => {
      if (student.id !== id) return student;
      const key = getKeyByKlassType();
      const nextList = [...student[key].slice(0, actiIdx), ...student[key].slice(actiIdx + 1)];
      return { ...student, [key]: nextList };
    })
    )
  }
  //활동 셀렉터 옵션
  const renderOptions = () => {
    if (thisKlass.type === "subject") return allActivityList.map((item) => ({ label: item.title, value: item }));
    else {
      return allActivityList
        .filter(acti => acti.subjDetail === (_tabType === 1 ? "자율" : "진로"))
        .map((item) => ({ label: item.title, value: item }));
    }
  }
  //활동 문구 변경
  const handleActiRecordOnChage = ({ record, studentId, actiIndex, actiId, madeBy, uid }) => {
    setStudentActiInfoList(prev => prev.map((student) => {
      if (student.id !== studentId) return student;
      const key = getKeyByKlassType();
      const nextList = student[key].map((acti, subIdx) => {
        if (subIdx !== actiIndex) return acti;
        if (actiId) return { ...acti, record, actiId, madeBy, uid };
        else return { ...acti, record, };
      })
      return { ...student, [key]: nextList }
    }))
  }
  //순서 섞기
  const shuffleOrder = (list) => {
    if (list && list.length > 1) {
      for (let i = list.length - 1; i > 0; i--) { //랜덤 섞기
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
    }
    return list;
  }
  //개인 활동 순서 섞기
  const handleShuffleOnClick = (id) => {
    setStudentActiInfoList(prev => prev.map((student) => {
      if (student.id !== id) return student;
      const key = getKeyByKlassType();
      return { ...student, [key]: shuffleOrder(student[key]) };
    }))
  }
  //전체 활동 순서 섞기
  const handleShuffleAllOnClick = () => {
    setStudentActiInfoList(prev => prev.map((student) => {
      const key = getKeyByKlassType();
      return { ...student, [key]: shuffleOrder(student[key]) };
    }))
  };
  //전체 저장 버튼
  const handleSaveOnClick = async () => {
    if (!window.confirm("이대로 저장하시겠습니까?")) return;
    const studentInfoList = _studentActiInfoList.map((info) => {
      const { id, firstList, secondList, thirdList } = info;
      console.log(thirdList);
      const student = _studentList.find((item) => item.id === id);
      return {
        ...student, actList: [...firstList, ...secondList],
        ...(thisKlass.type === "homeroom" ? { behaviorOpinion: thirdList[0].record || '' } : {})
      };
    })
    console.log(studentInfoList)
    try {
      await updateAllPetInfo(classId, studentInfoList);
      alert("저장되었습니다.");
    }
    catch (error) { alert(error); console.log(error); };
  };
  //셀렉터 스타일
  const customStyles = (width) => ({
    container: (base) => ({
      ...base,
      width,
    }),
  });
  return (
    <MainContainer>
      <SubNav>
        <p>※수정은 PC에서 가능함</p>
        <BackBtn />
        {user.userStatus === "master" && <ClickableIcon className={"fa-solid fa-recycle"} onClick={handleShuffleAllOnClick} />}
        <ClickableIcon className={"fa-solid fa-floppy-disk"} onClick={() => handleSaveOnClick()} styles={{ fontSize: "36px", border: "1px dotted black" }} />
        <ExportAsExcel allStudentList={_studentList} />
        <ClickableIcon className={"fa-solid fa-print"} onClick={() => handlePrint()} />
      </SubNav>
      <AnimWrapper $isVisible={isVisible}>
        <GridContainer style={{ position: "relative" }} ref={printRef}>
          {thisKlass.type === "subject" && <Row style={{ position: "absolute", top: "-34px", left: "28px" }}>
            <UpperTab className={"tab1"} top={"-33px"} left={"15px"} value={_semester} onClick={() => setSemester(1)}>1학기</UpperTab>
            <UpperTab className={"tab2"} top={"-33px"} left={"83px"} value={_semester} onClick={() => setSemester(2)}>2학기</UpperTab>
          </Row>}
          {thisKlass.type === "homeroom" && <Row style={{ position: "absolute", top: "-34px", left: "28px" }}>
            <UpperTab className={"tab1"} top={"-33px"} left={"15px"} value={_tabType} onClick={() => setTabType(1)}>자율</UpperTab>
            <UpperTab className={"tab2"} top={"-33px"} left={"74px"} value={_tabType} onClick={() => setTabType(2)}>진로</UpperTab>
            <UpperTab className={"tab3"} top={"-33px"} left={"133px"} value={_tabType} onClick={() => setTabType(3)}>행발</UpperTab>
          </Row>}
          <GridRowWrapper>
            <Header>연번</Header>
            <Header>학번</Header>
            <Header>이름</Header>
            <Header>생기부</Header>
            <Header>Byte</Header>
            <Header>수정</Header>
          </GridRowWrapper>
          {_studentActiInfoList?.length === 0 && <Row style={{ gridColumn: "1/9", backgroundColor: "#78787890", borderRadius: "0 0 5px 5px" }}>
            <EmptyResult comment={"등록된 학생이 없습니다."} color={"#black"} />
          </Row>}
          {_studentActiInfoList?.length > 0 && _studentActiInfoList.map((info, index) => {
            const { id, studentNumber, writtenName, firstList, secondList, thirdList } = info;
            const key = id;
            let actiList;
            if (thisKlass.type === "subject") { actiList = _semester === 2 ? secondList : firstList; }
            else { actiList = _tabType === 1 ? firstList : _tabType === 2 ? secondList : thirdList; }
            const accRecord = getAccRec(actiList);
            const bytes = (accRecord ? getByteLengthOfString(accRecord) : 0);
            const thisModifying = (isModifying === key);
            return <GridRowWrapper key={index + id}>
              {/* 연번 */}
              <GridItem>{index + 1}</GridItem>
              {/* 학번 */}
              <GridItem>{studentNumber}</GridItem>
              <GridItem><p onClick={() => { navigate(`/classrooms/${classId}/${key}`) }} style={nameFontStyle}>{writtenName || "미등록"}</p></GridItem>   {/* 이름 */}
              <GridItem style={{ justifyContent: "flex-start" }}>
                {!thisModifying && accRecord}
                {thisModifying && <Column style={{ width: "100%", gap: "5px" }}>
                  {actiList?.map((acti, actiIndex) => {
                    const { record, id, uid } = acti;
                    return <Row key={actiIndex + id} style={{ position: "relative", gap: "5px", alignItems: "center" }}>
                      {(_tabType !== 3 || thisKlass.type === "subject") && <Select
                        styles={customStyles("100px")}
                        placeholder={"활동"}
                        options={renderOptions()}
                        onChange={(event) => {
                          const { record, id, madeBy, uid } = event.value;
                          handleActiRecordOnChage({ record, studentId: key, actiIndex, actiId: id, madeBy, uid });
                        }}
                        isDisabled={user.uid !== uid}
                      />}
                      <Textarea
                        placeholder="이 곳에 새로운 활동을 기록하세요"
                        value={record}
                        onChange={(event) => handleActiRecordOnChage({ record: event.target.value, studentId: key, actiIndex })}
                        disabled={user.uid !== uid}
                      />
                      {user.uid === uid && <XBtn onClick={() => { handleDeleteOnClick(key, actiIndex) }}>X</XBtn>}
                    </Row>
                  })}
                  {(_tabType !== 3 || thisKlass.type === "subject") && <Row style={{ justifyContent: "center" }}>
                    <ClickableIcon className="fa-solid fa-plus" onClick={() => handleAddActiOnClick(key)} /></Row>}
                </Column>}
              </GridItem>
              {/* 바이트 */}
              <GridItem>{bytes}</GridItem>
              {/* 수정 */}
              <GridItem>
                {(!isModifying && ["master", "coTeacher"].includes(user.userStatus)) && <Column>
                  <ClickableIcon className={"fa-solid fa-edit"} onClick={() => handleEditOnClick(key)} />
                  <ClickableIcon className={"fa-solid fa-recycle"} onClick={() => handleShuffleOnClick(key)} />
                </Column>}
                {thisModifying && <Column>
                  <ClickableIcon className={"fa-solid fa-check"} onClick={() => setIsModifying('')} />
                  <ClickableIcon className={"fa-solid fa-x"} onClick={() => handleCacncelOnClick()} />
                </Column>
                }
              </GridItem>
            </GridRowWrapper>
          })}
        </GridContainer >
      </AnimWrapper>
    </MainContainer>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const AnimWrapper = styled(Column)`
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transition: opacity 0.7s ease;
  gap: 10px;
`
const GridContainer = styled.div`
  display: grid;
	width: 85%;
  margin: 30px auto;
  justify-content: center;
  grid-template-columns: 70px 100px 100px 1fr 60px 100px; 
  grid-template-rows: 40px;
  @media print {
    @page { margin: 5mm; }
  };
`
// lastChild의 범위를 명확하게 하기 위함.
const GridRowWrapper = styled.div` 
  display: contents;
`
const Header = styled.div`
  display: flex;
  background-color: #3453d1a1;
  color: white;
  padding: 10px;
  font-weight: bold;
  justify-content: center;
  &: first-child { border-top-left-radius: 5px; }
  &: last-child { border-top-right-radius: 5px; }
`
const GridItem = styled(Row)`
  justify-content: center;
  color: black;
  padding: 10px;
  background-color: #dddddd90;
  border: 1px solid #78787880;
  border-radius: 5px;
  &.left-align { text-align: left; }
`
const Textarea = styled.textarea`
  width: 100%;
  min-height: 5rem;
  border-radius: 10px;
  white-space: pre-wrap;
`
const XBtn = styled.p`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  background-color: rgba(120,120,120,0.5);
  border-radius: 3px;
  cursor: pointer;
`
export default ClassAllStudents