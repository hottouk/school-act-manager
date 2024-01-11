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

//24.01.09
const Nav = () => {
  //1. 변수
  const user = useSelector(({ user }) => { return user })
  const { logout } = useLogout();
  console.log('Nav', user)

  return (<StyledNav>
    <h3>생기부 입력 도우미</h3>
    {!user.uid && <>
      <ul>
        <li><Link to='/login'>로그인</Link></li>
        <li><Link to='/signup'>가입하기</Link></li>
      </ul></>}
    {user.uid && <>
      <ul>
        <li>{user.displayName}선생님 환영합니다.</li>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/activities'>활동 관리</Link></li>
        <li><Link to='/classRooms'>클래스 관리</Link></li>
        <li><StyledBtn type='button' onClick={logout}>로그아웃</StyledBtn></li>
      </ul>
    </>}
    <img src={brandLogo} alt='로고' />
  </StyledNav>
  )
}

const StyledNav = styled.nav`
  display: flex;
  background-color: #3454d1;
  padding: 20px 30px;
  h3 {
    display: flex;
    align-items: center;
    color: #efefef;
    font-weight: bold;   
  }
  ul {
    flex-grow: 2;
    display: flex;
    justify-content: right;
    align-items: center;
    gap: 30px;
    padding: 0 30px;
  }
  li {
    color: white;
  }
  a {
    color: white;
    text-decoration: none;
  }
  img { 
    width: 55px;
    height: 55px;
  }
`
const StyledBtn = styled.button`
  background-color: #fff;
  border: 1px solid #d5d9d9;
  border-radius: 8px;
  box-shadow: rgba(213, 217, 217, .5) 0 2px 5px 0;
  box-sizing: border-box;
  color: #0f1111;
  cursor: pointer;
  display: inline-block;
  font-family: "Amazon Ember",sans-serif;
  font-size: 13px;
  line-height: 29px;
  padding: 0 10px 0 11px;
  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  width: 100px;
  &:hover {
    background-color: #f7fafa;
  }
  &:focus {
    border-color: #008296;
    box-shadow: rgba(213, 217, 217, .5) 0 2px 5px 0;
    outline: 0;
  }
`
export default Nav