//라이브러리
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectClass } from '../../store/classSelectedSlice'
import { setAppliedClassList, setJoinedClassList } from '../../store/userSlice'
//hooks
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData'
//이미지
import unknown from '../../image/icon/unkown_icon.png'
import MonImg from '../MonImg'
import likeIcon from '../../image/icon/like_icon.png'
//css
import styled from 'styled-components'

//2024.01.09
const DataList = ({ dataList, type }) => {//todo 데이터 리스트, 타입으로 정리하기
  //----1.변수부--------------------------------
  const navigate = useNavigate()
  const user = useSelector(({ user }) => user)
  const [studentUser, setStudentUser] = useState(null);
  const { updateClassListInfo } = useAddUpdFireData("user")
  //전역변수
  const dispatcher = useDispatch()

  useEffect(() => { //공용
    if (user.isTeacher) { } //todo
    else { setStudentUser({ email: user.email, name: user.name, studentNumber: user.studentNumber, uid: user.uid }) }
  }, [user])

  //----2.함수부--------------------------------
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
      case "homeroom":
        dispatcher(setSelectClass(item)) //선택한 교실 비휘발성 전역변수화
        navigate(`/homeroom/${item.id}`) //url 이동
        break;
      case "activity":
        console.log(item)
        if (item.subject === "담임") { navigate(`/activities/${item.id}?sort=homeroom`, { state: { acti: item } }) }
        else { navigate(`/activities/${item.id}?sort=subject`, { state: { acti: item } }) }
        break;
      case "copiedActi":
        navigate(`/activities/${item.id}`, { state: { acti: item } })
        break;
      case "word":
        //todo 단어 목록 만들기
        break;
      default: return;
    }
  }

  return (
    <Container>
      {(type === "classroom" || type === "appliedClassList") && dataList.map((item) => { //교실
        return (<StyledClassroomLi key={item.id} onClick={() => { handleOnClick(item) }}>
          <h5>{item.classTitle}</h5>
          <p>{item.intro}</p>
          <p>{item.subject ? `${item.subject}과` : "교사가 삭제한 클래스입니다."}{item.subjDetail ? '-' + item.subjDetail : ''} </p>
        </StyledClassroomLi>)
      })}
      {(type === "homeroom") && dataList.map((item) => { //담임반
        return (<StyledHomeroomLi key={item.id} onClick={() => { handleOnClick(item) }}>
          <h5>{item.classTitle}</h5>
          <h5 className="klass_info">{item.grade}</h5><span>학년</span><h5 className="klass_info">{item.classNumber}</h5><span>반</span>
          <p>{item.intro}</p>
        </StyledHomeroomLi>)
      })}
      {type === "activity" && dataList.map((item) => { //활동
        return (<ActiLi key={item.id} onClick={() => { handleOnClick(item) }}>
          <div className="acti_info">
            <h5 >{item.title}</h5>
            <p>{item.subject}{item.subjDetail ? '-' + item.subjDetail : ''}</p>
            <p className="like_count"><img className={"like_icon"} src={likeIcon} alt={"받은좋아요"} />{item.likedCount ? item.likedCount : 0} </p>
            <p className="madeBy">by {item.madeBy ? `${item.madeBy} 선생님` : "어떤 선생님"}</p>
          </div>
          <div><MonImg monImg={item.monImg}></MonImg></div>
        </ActiLi>)
      })}
      {type === "copiedActi" && dataList.map((item) => { //복사한 활동
        return (<ActiLi key={item.id} onClick={() => { handleOnClick(item) }}>
          <div className="acti_info">
            <h5 style={{ color: '#FF69B4' }}>{item.title}</h5>
            <p>{item.subject}{item.subjDetail ? '-' + item.subjDetail : ''}</p>
            <p style={{ backgroundColor: '#FF69B4' }} className="madeBy">by {item.madeBy ? `${item.madeBy} 선생님` : "어떤 선생님"}</p>
          </div>
          <div><MonImg className="monImg" monImg={item.monImg}></MonImg></div>
        </ActiLi>)
      })}

    </Container>
  )
}
const Container = styled.ul`
  display: flex;
  width: 100%;
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
  h5 { 
    width: 80%;
    margin: 0 0 8px;
    color: royalBlue;
    font-weight: 600;
    overflow: hidden;
    white-space: nowrap;   /* 텍스트를 한 줄로 표시 */
    text-overflow: ellipsis; 
  }
  @media screen and (max-width: 767px){
    flex-direction: column;
    align-items: center;
    padding: 0;
  }
`
const StyledClassroomLi = styled.li`
  h5 { color: #3454d1;  }
  h5.klass_info { display: inline;}  
`
const StyledHomeroomLi = styled.li`
  h5 { color: #3454d1;  }
  h5.klass_info { display: inline;}  
  p { margin-top: 15px; }
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
  p.like_count {
    font-size: 18px;
    color: #3454d1;
    font-weight: bold;
  }
  img.like_icon {
    width: 30px;
    height: 30px; 
    margin-right: 5px;
    margin-bottom: 7px;
  }
  img {
    width: 50px;
    height: 50px;
    padding: 2px;
    border-radius: 25px;
  }
`

const ActiLi = styled.li`
  position: relative;
  display: flex;
  .acti_info {
    width: 77%;
    flex-grow: 1;
  }
  .madeBy {
    position: absolute;
    bottom: 1px;
    right: 4px;
    background-color: #3454d1b3;
    color: white;
    padding: 2px;
    border-radius:5px;
    margin-bottom: 4px
  }
  p.like_count {
    font-size: 18px;
    color: #3454d1;
    font-weight: bold;
  }
  img.like_icon {
    width: 30px;
    height: 30px; 
    margin-right: 5px;
    border: none;
    margin-bottom: 7px;
  }
  img {
    width: 60px;
    height: 60px;
    padding: 2px;
    border: 1px solid rgba(25, 31, 52, 0.3);
    border-radius: 30px;
  }
`
export default DataList