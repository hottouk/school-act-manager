import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { setSelectClass } from '../store/classSelectedSlice'
import { setAppliedClassList, setJoinedClassList } from '../store/userSlice'
import useFirestore from '../hooks/useFirestore'
import useFetchFireData from '../hooks/useFetchFireData'
//이미지
import unknown from '../image/icon/unkown_icon.png'

//2024.01.09
const DataList = ({ dataList, type, setTeacherClassList }) => {//todo 데이터 리스트, 타입으로 정리하기
  //1. 변수
  const navigate = useNavigate()
  const user = useSelector(({ user }) => user)
  const [studentUser, setStudentUser] = useState(null);
  const { updateClassListInfo } = useFirestore("user")
  const { fetchDataList } = useFetchFireData()
  //전역변수
  const dispatcher = useDispatch()

  useEffect(() => { //공용
    if (user.isTeacher) { } //todo
    else { setStudentUser({ email: user.email, name: user.name, studentNumber: user.studentNumber, uid: user.uid }) }
  }, [user])

  //3. 함수
  const handleOnClick = (item) => {
    switch (type) {
      case "classroom":
        if (item.subject) {
          dispatcher(setSelectClass(item))   //선택한 교실 비휘발성 전역변수화
          navigate(`/classrooms/${item.id}`) //url 이동
        } else { //교사가 클래스 삭제 -> 가입 교실 갱신. 
          let newList = user.joinedClassList.filter((joinedClass) => { return joinedClass.id !== item.id })
          updateClassListInfo(newList, "joinedClassList")
          dispatcher(setJoinedClassList(newList))
        } break;
      case "appliedClassList":
        if (item.subject) {
          dispatcher(setSelectClass(item))   //선택한 교실 비휘발성 전역변수화
          navigate(`/classrooms/${item.id}`) //url 이동
        } else { //교사가 클래스 삭제 -> 가입 신청 중 교실 갱신
          let newList = user.appliedClassList.filter((appliedClassList) => { return appliedClassList.id !== item.id })
          updateClassListInfo(newList, "appliedClassList")
          dispatcher(setAppliedClassList(newList))
        } break;
      case "activity":
        if (user.isTeacher) { navigate(`/activities/${item.id}`, { state: { acti: item } }) }
        else { navigate(`/activities/${item.id}`, { state: { acti: item, student: studentUser } }) }
        break;
      case "teacher":
        fetchDataList("classRooms", "uid", item.uid).then((classroomList) => {
          classroomList.sort((a, b) => a.subject.localeCompare(b.subject)) //정렬
          setTeacherClassList(classroomList)
        })
        break;
      default: return;
    }
  }

  return (
    <StyledListContainer>
      {type === "teacher" && dataList.map((item) => { //교사
        return (<StyledTeacherLi key={item.uid} onClick={() => { handleOnClick(item) }}>
          <div className="t_info">
            <p className="t_name">{item.name} 선생님</p>
            <p>소속: {item.school.schoolName}</p>
          </div>
          <div><img src={item.profileImg ? item.profileImg : unknown} alt="프사" /></div>
        </StyledTeacherLi>)
      })}
      {(type === "classroom" || type === "appliedClassList") && dataList.map((item) => { //교실
        return (<StyledClassroomLi key={item.id} onClick={() => { handleOnClick(item) }}>
          <h4>{item.classTitle}</h4>
          <p>{item.intro}</p>
          <p>{item.subject ? `과목: ${item.subject}` : "교사가 삭제한 클래스입니다."} </p>
        </StyledClassroomLi>)
      })}
      {type === "activity" && dataList.map((item) => { //활동
        return (<StyledSubjectLi key={item.id} onClick={() => { handleOnClick(item) }}>
          <h4>{item.title}</h4>
          <p>{item.content}</p>
          <p>과목: {item.subject}</p>
        </StyledSubjectLi>)
      })}
    </StyledListContainer>
  )
}
const StyledListContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  li {
    width: 280px;
    height: 155px;
    margin: 10px;
    padding: 15px 25px;
    border: rgb(120, 120, 120, 0.5) 1.5px solid;
    border-radius: 15px;
    cursor: pointer;  
  }
  h4 { 
    margin: 0 0 8px;
    color: royalBlue;
    font-weight: 600;
  }
  @media screen and (max-width: 767px){
    flex-direction: column;
    align-items: center;
    padding: 0;
  }
`

const StyledClassroomLi = styled.li`
`

const StyledTeacherLi = styled.li`
  display: flex;
  .t_info {
    flex-grow: 1;
  }
  p.t_name {
    font-size: 20px;
    font-weight: bold;
  }
  img {
    width: 50px;
    height: 50px;
    padding: 2px;
    border-radius: 25px;
  }
`

const StyledSubjectLi = styled.li`
`
export default DataList