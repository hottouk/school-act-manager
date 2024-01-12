//라이브러리
import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
//hooks
import useLogout from '../hooks/useLogout'
//CSS
import styled from 'styled-components'
//이미지
import brandLogo from "../image/icon/h-logo.png";
import { Helmet } from 'react-helmet'

//24.01.09
const Nav = () => {
  //1. 변수
  const user = useSelector(({ user }) => { return user })
  const { logout } = useLogout();
  console.log('Nav', user)

  return (<StyledNav>
    <Helmet>
      <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer" />
    </Helmet>
    <h3>생기부 입력 도우미</h3>
    {!user.uid && <>
      <ul className='menu_container'>
        <li><i className="fa-solid fa-key"></i><Link to='/login'>로그인</Link></li>
        <li><i class="fa-solid fa-user-plus"></i><Link to='/signup'>가입하기</Link></li>
      </ul></>}
    {user.uid && <>
      <div className='welcome'><p>{user.name} 선생님 사랑합니다.</p></div>
      <ul className='menu_container'>
        <li><i className="fa-solid fa-house"></i><Link to='/'>Home</Link></li>
        <li><i className="fa-solid fa-scroll"></i><Link to='/activities'>활동 관리</Link></li>
        <li><i className="fa-solid fa-children"></i><Link to='/classRooms'>클래스 관리</Link></li>
        <li className='mobileOnly'><i class="fa-solid fa-user"></i>MyInfo</li>
      </ul>
    </>}
    <ImgDiv>
      <img src={brandLogo} alt='로고' />
      <button className='button-16' type='button' onClick={logout}>로그아웃</button>
    </ImgDiv>
  </StyledNav >
  )
}

const StyledNav = styled.nav`
  width: 100%;
  display: flex;
  background-color: #3454d1;
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
  i {
    margin-right: 5px;
  }
  a {
    color: #efefef;
    text-decoration: none;
  }
  @media screen and (max-width: 767px){
    position: fixed;
    bottom: 0;
    height: 7%;
    background-color: #efefef;
    padding: 0;
    z-index: 999;
    h3 {
      display: none;
    }
    .welcome {
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
      font-size: 23px;
      margin: 0;
    }
    a {
      color: #3454d1;
      font-size: 12px;
    }
  }
`
const ImgDiv = styled.div`
  position: relative;
  cursor: pointer;
  img {
    width: 55px;
    height: 55px;
  }
 .button-16 {
  display: none;
  position: fixed;
  right: 0;
  margin-top: 5px;
  background-color: #f8f9fa;
  border: 1px solid #f8f9fa;
  border-radius: 4px;
  color: #3c4043;
  cursor: pointer;
  font-family: arial,sans-serif;
  font-size: 14px;
  height: 36px;
  line-height: 27px;
  min-width: 54px;
  padding: 0 16px;
  text-align: center;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: pre;
}
.button-16:hover {
  border-color: #dadce0;
  box-shadow: rgba(0, 0, 0, .1) 0 1px 1px;
  color: #202124;
}
.button-16:focus {
  border-color: #4285f4;
  outline: none;
}
&:hover button { 
  display: block;
  }
}
@media screen and (max-width: 767px) {
  img { display: none;}
}
`

export default Nav