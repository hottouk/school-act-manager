//라이브러리
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
//컴포넌트
import MainSelector from './MainSelector.jsx';
import StudentList from '../../components/StudentList';
////파이어베이스 Hooks
import useCollection from '../../hooks/useCollection';
import useSubCollection from '../../hooks/useSubCollection';
import useFirestore from '../../hooks/useFirestore.jsx';
//리덕스
import { useDispatch, useSelector } from 'react-redux';
import { setAllStudents } from '../../store/allStudentsSlice';
import { setAllActivities } from '../../store/allActivitiesSlice.jsx';
//스타일
import styled from 'styled-components';

//2924.01.08 
const ClassRoomDetails = () => {
  //전역 변수
  const dispatcher = useDispatch()
  const user = useSelector(({ user }) => { return user; })
  const thisClass = useSelector(({ classSelected }) => { return classSelected })
  //1.변수
  //개별 클래스 구별해주는 변수
  const navigate = useNavigate()
  //데이터 통신 변수
  const { subDocuments, subColErr } = useSubCollection('classRooms', thisClass.id, 'students', 'studentNumber') //모든 학생 List
  const { documentList, colErr } = useCollection('activities', ['uid', '==', user.uid, 'subject', '==', thisClass.subject], 'title') //활동 List)
  const { deleteDocument } = useFirestore("classRooms")
  //편집 모드
  const [isEditable, setIsEditable] = useState(false)

  console.log(thisClass.id, '반 활동List', documentList)
  console.log(thisClass.id, '반 학생List', subDocuments)

  //2.UseEffect
  useEffect(() => {
    dispatcher(setAllStudents(subDocuments)) //전체 학생 전역변수화
    dispatcher(setAllActivities(documentList)) //전체 활동 전역변수화
  }, [subDocuments, documentList])

  //3.함수
  const handleBtnClick = (event) => {
    switch (event.target.id) {
      case "back_btn":
        navigate("/classRooms")
        break;
      case "edit_btn":
        setIsEditable(true)
        break;
      case "delete_btn":
        let deleteConfirm = window.prompt('클래스를 삭제하시겠습니까? 반 학생정보도 함께 삭제됩니다. 삭제하시려면 "삭제합니다"를 입력하세요.')
        if (deleteConfirm === '삭제합니다') {
          deleteDocument(thisClass.id)
          navigate(-1)
        } else {
          window.alert('문구가 제대로 입력되지 않았습니다.');
          return;
        }
        break;
      case "save_btn":
        if (window.confirm('반 정보를 이대로 저장하시겠습니까?')) {
          //todo
        }
        break;
      default: return
    }
    return null
  }

  return (
    <>
      {/* todo document 정리하기 */}
      {!thisClass && <StyledContainer><h3>반 정보를 불러올 수 없습니다.</h3></StyledContainer>}
      {thisClass &&
        <StyledContainer>
          <StyeldHeader>
            <StyledClassTitle>{thisClass.classTitle}</StyledClassTitle>
            <p>{!subDocuments ? 0 : subDocuments.length}명의 학생들이 있습니다.</p>
            <p>{thisClass.intro}</p>
          </StyeldHeader>
          {/* 셀렉터 */}
          <StyledMain>
            <MainSelector studentList={subDocuments} activitiyList={documentList} classId={thisClass.id} />
          </StyledMain>
          <StyledMain>
            {/* 학생 상세 보기 */}
            {!subDocuments ? <h3>반에 학생들이 등록되어 있지 않습니다. {subColErr}</h3>
              : subDocuments.length === 0 ? <h3>반에 학생들이 등록되어 있지 않습니다. {subColErr}</h3>
                : <StudentList studentList={subDocuments} />}
          </StyledMain>
          <StyledMain>
            <h4>3단계 - 개별화하기</h4>
            <StyledMoveBtn onClick={() => { navigate('allStudents', { state: subDocuments }) }}>반 전체 세특보기</StyledMoveBtn>
          </StyledMain>
          <StyeldBtnDiv>
            <StyledBtn id='back_btn' onClick={handleBtnClick}>반 목록</StyledBtn>
            {!isEditable
              ? <StyledBtn id='edit_btn' onClick={handleBtnClick}>수정</StyledBtn>
              : <StyledBtn id='save_btn' onClick={handleBtnClick}>저장</StyledBtn>
            }
            <StyledBtn id='delete_btn' onClick={handleBtnClick}>반 삭제</StyledBtn>
          </StyeldBtnDiv>
        </StyledContainer>
      }
    </>
  )
}
const StyledContainer = styled.main`
  box-sizing: border-box;
  width: 80%;
  margin: 0 auto 50px;
  @media screen and (max-width: 767px){
    width: 100%;
    height: 2000px;
    margin: 0;
  }
`
const StyeldHeader = styled.header`
  margin-top: 25px;
  padding: 25px;
  border-left: 12px #6495ed double;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
  @media screen and (max-width: 767px){
    margin-top: 0;
    border-top: 12px #6495ed double;
    border-left: none;
    box-shadow: none;
  }
`
const StyledMain = styled.main`
  padding: 5px;
  margin-top: 50px;
  border-left: 12px #6495ed double;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
  h4 {
    display: flex;
    justify-content: center;
    margin: 10px auto;
  }
  @media screen and (max-width: 767px){
    margin-top: 0;
    border-left: none;
    border-top: 12px #6495ed double;
    box-shadow: none;
  }
`
const StyledClassTitle = styled.h2`
  display: flex;
  justify-content: center;
`
const StyledMoveBtn = styled.button`
  display: block;
  margin: 50px auto;
  width: 240px;
  height: 50px;
  background-color: #6495ed;
  border: none;
  border-radius: 5px;
  color: white;
  padding: 0.25em 1em;
`
const StyeldBtnDiv = styled.div`
  display: flex;
  justify-content: space-between;
`
const StyledBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  width: 250px;
  color: royalBlue;
  background-color: transparent;
  border-radius: 15px;
  border: 2px solid royalBlue;
  padding: 25px;
  @media screen and (max-width: 767px){
    width: 110px;
    height: 40px;
  }
`
export default ClassRoomDetails