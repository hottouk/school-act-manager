import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import useLogout from '../../hooks/useLogout';
import styled from 'styled-components';

const MyInfoModal = (props) => {
  const { logout } = useLogout();
  const user = props.user
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>{user.name}님의 Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <label htmlFor="">이메일:&nbsp;&nbsp;</label>
          {user.email}
        </div>
        <div>
          <label htmlFor="">고유번호:&nbsp;&nbsp;</label>
          {user.uid}
        </div>
        <StyledLogoutBtn className='button-16' type='button' onClick={() => {
          props.onHide()
          logout()
        }}>로그아웃</StyledLogoutBtn>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => { props.onHide() }}>확인</Button>
      </Modal.Footer>
    </Modal>
  )
}

const StyledLogoutBtn = styled.button`
  position: relative;
  left: 21%;
  width: 200px;
  margin: 20px auto;
  align-items: center;
  background-color: #0A66C2;
  border: 0;
  border-radius: 100px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font-family: -apple-system, system-ui, system-ui, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 20px;
  max-width: 480px;
  min-height: 40px;
  min-width: 0px;
  overflow: hidden;
  padding: 0px;
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;
  touch-action: manipulation;
  transition: background-color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s, box-shadow 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s, color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;

&:hover {
    background: cornflowerblue;
    color: white;
    transition: 0.5s;
  }
&: active {
  background: #09223b;
  color: rgb(255, 255, 255, .7);
}

&:disabled { 
  cursor: not-allowed;
  background: rgba(0, 0, 0, .08);
  color: rgba(0, 0, 0, .3);
}
`

export default MyInfoModal