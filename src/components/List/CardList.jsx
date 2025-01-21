//라이브러리
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectClass } from '../../store/classSelectedSlice'
import { setAppliedClassList, setJoinedClassList } from '../../store/userSlice'
//hooks
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData'
//css
import styled from 'styled-components'
import CardListItem from './ListItem/CardListItem'
import EmptyResult from '../EmptyResult'

//2024.01.09 -> 25.01.22(onClick 로직 분리)
const CardList = ({ dataList, type, onClick, selected }) => {//todo 데이터 리스트, 타입으로 정리하기
  //----1.변수부--------------------------------
  const navigate = useNavigate()
  const user = useSelector(({ user }) => user)
  const [studentUser, setStudentUser] = useState(null);
  const { updateClassListInfo } = useAddUpdFireData("user")
  //전역변수

  useEffect(() => { //공용
    if (user.isTeacher) { } //todo
    else { setStudentUser({ email: user.email, name: user.name, studentNumber: user.studentNumber, uid: user.uid }) }
  }, [user])

  //----2.함수부--------------------------------
  // const handleOnClick = (item) => {
  //   switch (type) {
  //     case "classroom":
  //       if (item.subject) {
  //       } else { //교사가 클래스 삭제 -> 가입 교실 갱신. 
  //         let newList = user.joinedClassList.filter((joinedClass) => { return joinedClass.id !== item.id })
  //         updateClassListInfo(newList, "joinedClassList")
  //         dispatcher(setJoinedClassList(newList))
  //       } break;
  //     case "appliedClassList":
  //       if (item.subject) {
  //         dispatcher(setSelectClass(item))   //선택한 교실 비휘발성 전역변수화
  //         navigate(`/classrooms/${item.id}`) //url 이동
  //       } else { //교사가 클래스 삭제 -> 가입 신청 중 교실 갱신
  //         let newList = user.appliedClassList.filter((appliedClassList) => { return appliedClassList.id !== item.id })
  //         updateClassListInfo(newList, "appliedClassList")
  //         dispatcher(setAppliedClassList(newList))
  //       } break;
  //     default: return;
  //   }
  // }

  return (
    <Container>
      {/* 데이터 없음 */}
      {(!dataList || dataList.length === 0) && <>
        <EmptyResult comment={"데이터가 없어요"} />
      </>}
      {/* 교사 */}
      {(type === "teacher") && dataList?.map((item) => {
        return (<CardListItem key={item.uid} item={item} onClick={onClick} type={"teacher"} styles={{ backgroundColor: `${item.uid === selected ? "rgba(52, 84, 209, 0.4)" : "white"}` }} />)
      })}
      {/* 교과반 */}
      {(type === "classroom" || type === "appliedClassList") && dataList?.map((item) => {
        return (<CardListItem key={item.id} item={item} onClick={onClick} type={"classroom"} />)
      })}
      {/* 담임반 */}
      {(type === "homeroom") && dataList?.map((item) => {
        return (<CardListItem key={item.id} item={item} onClick={onClick} type={"homeroom"} />)
      })}
      {/* 교과활동 */}
      {type === "activity" && dataList?.map((item) => {
        return (<CardListItem key={item.id} item={item} onClick={onClick} type={"subjActi"} />)
      })}
      {/* 업어온 활동 */}
      {type === "copiedActi" && dataList?.map((item) => {
        return (<CardListItem key={item.id} item={item} onClick={() => { navigate(`/activities/${item.id}`, { state: { acti: item } }) }} type={"copiedActi"} styles={{ hoverColor: "rgba(255, 105, 180, 0.2)" }} />)
      })}
      {/* 퀴즈 활동*/}
      {type === "quizActi" && dataList?.map((item) => {
        return (<CardListItem key={item.id} item={item} onClick={onClick} type={"quizActi"} styles={{ hoverColor: "rgba(9, 138, 15,0.2)" }} />)
      })}
      {/* 단어 세트 */}
      {(type === "quiz") && dataList?.map((item) => {
        return (<CardListItem key={item.id} item={item} onClick={() => { navigate('/quiz_setting', { state: item }) }} type={"quiz"} />)
      })}
    </Container>
  )
}
const Container = styled.ul`
  border-top: 1px solid rgba(120, 120, 120, 0.5);;
  border-bottom: 1px solid rgba(120, 120, 120, 0.5);
  margin: 5px auto 5px;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  list-style: none;
  
  @media screen and (max-width: 767px){
    flex-direction: column;
    align-items: center;
    padding: 0;  
    border: none;
    border-top: 1px solid #3454d1;
    border-bottom: 1px solid #3454d1;
  }
`
export default CardList