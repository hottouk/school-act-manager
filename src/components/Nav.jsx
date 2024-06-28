//라이브러리
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Badge } from 'react-bootstrap';
//모달
import MyInfoModal from './Modal/MyInfoModal'
//CSS
import styled from 'styled-components'
//이미지
import brandLogo from "../image/icon/h-logo.png";
import unknown from '../image/icon/unkown_icon.png'
//hooks
import useGetMyUserInfo from '../hooks/useGetMyUserInfo';

//24.02.22
const Nav = () => {
  //1. 변수
  const user = useSelector(({ user }) => { return user })
  const [_profileImg, setProfileImg] = useState(null)
  const { errByGetMyUserInfo } = useGetMyUserInfo()
  console.log(user, errByGetMyUserInfo)
  //모달
  const [isMyInfoShow, setIsMyInfoShow] = useState(false)
  const [_isNew, setIsNew] = useState(false) //새소식 아이콘
  const navigate = useNavigate()

  useEffect(() => {
    setProfileImg(user.profileImg)//프로필 사진
    if (user.isTeacher) { //교사
      if ((user.appliedStudentClassList && user.appliedStudentClassList.length > 0) || ((user.homeworkList && user.homeworkList.length > 0))) {
        setIsNew(true)
      } else { setIsNew(false) }
    } else if (!user.isTeacher) { //학생
      if (user.classNewsList && user.classNewsList.length > 0) {
        setIsNew(true)
      } else { setIsNew(false) }
    }
  }, [user])

  //2. 함수
  const handleBtnClick = (event) => {
    switch (event.target.id) {

      case "my_info_btn":
        setIsMyInfoShow(true)
        break;
      default: return;
    }
  }

  return (<StyledNav>
    <Helmet>
      {/*폰트어썸 라이브러리*/}
      <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer" />
    </Helmet>
    <img className="logo" src={brandLogo} alt="로고" />
    <h3>생기부 쫑알이</h3>
    {!user.uid && <>
      <ul className='menu_container'>
        <li><i className="fa-solid fa-key"></i><Link to='/login'>로그인</Link></li>
      </ul></>}
    {(user.uid && user.isTeacher) && <>
      {/* 교사 */}
      <div className='welcome'><p>{user.name} 선생님 사랑합니다.</p></div>
      <ul className='menu_container'>
        <li id="home_btn" ><Link to="/"><i className="fa-solid fa-house"></i>
          <span className="pcOnly">Home</span></Link></li>
        <li id="acti_btn" ><Link to="/activities"><i className="fa-solid fa-scroll"></i>
          <span className="pcOnly">활동 관리</span></Link></li>
        <li id="class_btn" ><Link to="/classRooms"><i className="fa-solid fa-school"></i>
          <span className="pcOnly">클래스 관리</span></Link></li>
        <li id="student_btn" ><Link to="/users"><i className="fa-solid fa-user-group"></i>
          <span className="pcOnly">사람 찾기</span></Link></li>
        <li id="word_btn" ><Link to="/wordbattle"><i className="fa-solid fa-khanda"></i>
          <span className="pcOnly">단어 배틀</span></Link></li>
        {user.isMaster && <li id="master_btn" ><Link to="/master"><i className="fa-solid fa-key"></i>
          <span className="pcOnly">마스터</span></Link></li>}
        <li className="news_btn" >
          {_isNew && <StyledNewIcon><Badge bg="danger">new</Badge></StyledNewIcon>}
          <Link to="/news"><i className="fa-solid fa-bell"></i></Link></li>
        {/* 모바일 전용 */}
        <li className="mobileOnly"><i id="my_info_btn" className="fa-solid fa-user" onClick={handleBtnClick}></i></li>
      </ul>
      {_profileImg && <img className="profileImg" src={_profileImg} alt="프로필 이미지" onClick={() => setIsMyInfoShow(true)} />}
      {!_profileImg && <img className="profileImg" src={unknown} alt="프로필 이미지" onClick={() => setIsMyInfoShow(true)} />}
    </>}
    {/* 학생 */}
    {(user.uid && !user.isTeacher) && <>
      <div className='welcome'><p>{user.name} 학생 사랑합니다.</p></div>
      <ul className="menu_container">
        <li id="home_btn"><Link to="/"><i className="fa-solid fa-house"></i>
          <span className="pcOnly">Home</span></Link></li>
        <li id="acti_btn"><Link to="/activities"><i className="fa-solid fa-scroll"></i>
          <span className="pcOnly">참여 활동</span></Link></li>
        <li id="class_btn"><Link to="/classRooms"><i className="fa-solid fa-school"></i>
          <span className="pcOnly">참여 클래스</span></Link></li>
        <li className="news_btn">
          {_isNew && <StyledNewIcon><Badge bg="danger">new</Badge></StyledNewIcon>}
          <Link to="/news" ><i className="fa-solid fa-bell" /></Link>
        </li>
        {/* 모바일 전용 */}
        <li className="mobileOnly"><i id="my_info_btn" className="fa-solid fa-user" onClick={handleBtnClick}></i></li>
      </ul>
      {_profileImg && <img className="profileImg" src={_profileImg} alt="프로필 이미지" onClick={() => setIsMyInfoShow(true)} />}
      {!_profileImg && <img className="profileImg" src={unknown} alt="프로필 이미지" onClick={() => setIsMyInfoShow(true)} />}

    </>}
    {/*개인 정보 수정 Modal 창 */}
    <MyInfoModal
      user={user}
      show={isMyInfoShow}
      onHide={() => setIsMyInfoShow(false)}
    />
  </StyledNav >
  )
}

const StyledNav = styled.nav`
  width: 100%;
  display: flex;
  background-color: #3454d1;
  align-items: center;
  padding: 20px 30px;
  color: #efefef;
  h3 {
    margin: 0;
    display: flex;
    align-items: center;
    color: #efefef;
    font-weight: bold;   
  }
  .welcome {
    display: flex;
    align-items: center;
    margin-left: 20px;
    p{
      margin: 0
    }
  }
  .mobileOnly {
    display: none;
  }
  ul.menu_container{
    margin-bottom: 0;
    padding: 0 30px;
    flex-grow: 2;
    display: flex;
    justify-content: right;
    align-items: center;
    gap: 30px;
  }
  li.news_btn {
    position: relative;
  }

  i {
    margin-right: 5px;
  }
  a {
    color: #efefef;
    text-decoration: none;
  }
  img.profileImg {
    width: 50px;
    height: 50px;
    border-radius: 25px;
  }
  img.logo {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }

  @media screen and (max-width: 767px){
    display: flex;
    position: fixed; 
    bottom: 0;
    height: 10%;
    background-color: #efefef;
    padding: 5px;
    z-index: 999;
    h3 {
      display: none;
    }
    .welcome {
      display: none;
    }
    .logo {
      display: none;
    }
    .pcOnly {
      display: none;
    }
    ul.menu_container {
      width: 100%;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      padding: 0;
      gap: 0;
    }
    .mobileOnly {
      display: flex;
      font-size: 12px;
    }
    li {      
      flex-grow: 1;
      color: #3454d1;
      display: flex;
      flex-direction: column;
      text-align: center; 
    }
    i {
      font-size: 25px;
      margin: 0;
    }
    a {
      color: #3454d1;
      font-size: 12px;
    }
    img.profileImg {
      display: none;
      cursor: pointer;
    }
  }
`
const StyledNewIcon = styled.div`
  position: absolute;
  top: -25px;
  right: -8px;
`
export default Nav