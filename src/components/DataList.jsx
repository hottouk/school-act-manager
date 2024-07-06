import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { setSelectClass } from '../store/classSelectedSlice'
import { setAppliedClassList, setJoinedClassList } from '../store/userSlice'
import useAddUpdFireData from '../hooks/useAddUpdFireData'
import useFetchFireData from '../hooks/useFetchFireData'
//컴포넌트
import SmallBtn from './Btn/SmallBtn'
//이미지
import unknown from '../image/icon/unkown_icon.png'
import MonImg from './MonImg'
import likeIcon from '../image/icon/like_icon.png'

//2024.01.09
const DataList = ({ dataList, type, setTeacherClassList }) => {//todo 데이터 리스트, 타입으로 정리하기
  //1. 변수
  const navigate = useNavigate()
  const user = useSelector(({ user }) => user)
  const [studentUser, setStudentUser] = useState(null);
  const { updateClassListInfo } = useAddUpdFireData("user")
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
        if (user.isTeacher) { navigate(`/activities/${item.id}`, { state: { acti: item } }) } //교사
        else { navigate(`/activities/${item.id}`, { state: { acti: item, student: studentUser } }) } //학생
        break;
      case "copiedActi":
        if (user.isTeacher) { navigate(`/activities/${item.id}`, { state: { acti: item } }) } //교사
        break;
      case "teacher":
        if (setTeacherClassList) {
          fetchDataList("classRooms", "uid", item.uid).then((classroomList) => {
            classroomList.sort((a, b) => a.subject.localeCompare(b.subject)) //정렬
            setTeacherClassList(classroomList)
          })
        } else {
          navigate(`/activities/others`, { state: { otherTrId: item.id } })
        }
        break;
      case "word":
        //todo 단어 목록 만들기
        break;
      default: return;
    }
  }

  return (
    <StyledListContainer>
      {type === "teacher" && dataList.map((item) => { //교사
        return (
          <StyledTeacherLi key={item.uid} onClick={() => { handleOnClick(item) }}>
            <div className="t_info">
              <p className="t_name">{item.name} 선생님</p>
              <p>{item.school.schoolName}</p>
              <p className="like_count"><img className={"like_icon"} src={likeIcon} alt={"받은좋아요"} />{item.likedCount ? item.likedCount : 0} </p>
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
        return (<ActiList key={item.id} onClick={() => { handleOnClick(item) }}>
          <div className="acti_info">
            <h4 >{item.title}</h4>
            <p>과목: {item.subject}</p>
            <p className="like_count"><img className={"like_icon"} src={likeIcon} alt={"받은좋아요"} />{item.likedCount ? item.likedCount : 0} </p>
            <p className="madeBy">by {item.madeBy ? `${item.madeBy} 선생님` : "어떤 선생님"}</p>
          </div>
          <div><MonImg monImg={item.monImg}></MonImg></div>
        </ActiList>)
      })}
      {type === "copiedActi" && dataList.map((item) => { //복사한 활동
        return (<ActiList key={item.id} onClick={() => { handleOnClick(item) }}>
          <div className="acti_info">
            <h4 style={{ color: '#FF69B4' }}>{item.title}</h4>
            <p>과목: {item.subject}</p>
            <p style={{ backgroundColor: '#FF69B4' }} className="madeBy">by {item.madeBy ? `${item.madeBy} 선생님` : "어떤 선생님"}</p>
          </div>
          <div><MonImg className="monImg" monImg={item.monImg}></MonImg></div>
        </ActiList>)
      })}
      {type === "word" && dataList.map((item) => { //단어
        return (<ActiList key={item.id} >
          <div>
            <h4>{item.setTitle}</h4>
            <StyledFlexDiv>
              <SmallBtn btnColor={"#3454d1"} btnName={"전투입장"} />
              <SmallBtn btnColor={"#B22222"} btnName={"편집하기"} btnOnClick={() => { navigate("/words_setting") }} />
            </StyledFlexDiv>
          </div>
          {/* <div><MonImg monImg={item.monImg}></MonImg></div> */}
        </ActiList>)
      })}
    </StyledListContainer>
  )
}
const StyledListContainer = styled.ul`
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
  h4 { 
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

const ActiList = styled.li`
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
const StyledFlexDiv = styled.div`
  display: flex;
`
export default DataList