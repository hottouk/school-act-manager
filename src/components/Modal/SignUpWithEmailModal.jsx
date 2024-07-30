import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components'
import LongW100Btn from '../Btn/LongW100Btn';
import useLogin from '../../hooks/useLogin';

const SignUpWithEmailModal = (props) => {
  //id
  const [email, setEmail] = useState('')
  //hooks
  const { sendEmailSignInLink, emailMsg } = useLogin()
  //상태
  const [sentEmail, setSentEmail] = useState(false)

  //회원가입 버튼
  const handleSubmit = (event) => {
    event.preventDefault();
    sendEmailSignInLink(email)
    setSentEmail(true)
  }

  return (
    <Modal
      show={props.show}
      backdrop={props.backdrop}
      onHide={props.onHide}>
      <Modal.Header>
        <legend>회원 가입</legend>
      </Modal.Header>
      <Modal.Body>
        <StyledForm onSubmit={handleSubmit}>
          <fieldset>
            <p>id로 사용할 Email을 입력하세요</p>
            <InputWrapper>
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />
            </InputWrapper>
            <p>{emailMsg}</p>
          </fieldset>
          <BtnWrapper>
            {!sentEmail && <LongW100Btn type="submit" btnName={"이메일 인증"} />}
            <LongW100Btn type="button" btnName={sentEmail ? "닫기" : "취소"} btnOnClick={() => { props.onHide() }} />
          </BtnWrapper>
        </StyledForm>
      </Modal.Body>
    </Modal>)
}

const StyledForm = styled.form`
  max-width: 540px;
  margin: 0 auto;
  padding: 20px;
  color: #efefef;
  background-color: #3454d1;
  border-radius: 10px;
  border: rgb(120, 120, 120, 0.5) 1px solid;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  @media screen and (max-width: 767px) {
    width: 100%;
    margin-top: 0;
  }
`
const InputWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  p {
    display: flex;
    align-items: center;
    width: 30%; 
    margin: 0;
  }
  input {
    height: 35px;
    border: 1px solid black;
    border-radius: 5px;
  }
`

const BtnWrapper = styled.div`
  display: flex;
  gap: 10px;
`
export default SignUpWithEmailModal