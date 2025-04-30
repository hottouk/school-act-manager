import React, { useState } from 'react'
import styled from 'styled-components'
import MainBtn from '../../components/Btn/MainBtn'

const EmailLogin = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const handleSignIn = () => { }
  return (
    <Container onSubmit={handleSignIn}>
      <LoginWrapper>
        <InputWrapper>
          <StyledInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <StyledInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </InputWrapper>
        <MainBtn type="submit" onClick={() => { props.login(email, password) }} >로그인</MainBtn>
      </LoginWrapper>
      <TextWrapper>
        <p className="errMsg">{props.emailMsg || null}</p>
        <p onClick={() => { props.openEmailModal(true) }}>쫑알이가 처음이세요? 회원가입</p>
      </TextWrapper>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const LoginWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  gap: 20px;
`
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 10px;
`
const TextWrapper = styled.div`
  margin-top: 5px;
  p {
    text-align: left;
    color: black;
    margin-top: 0;
    cursor: pointer;
    &: hover {
      color: #3454d1;
    }
  }
  p.errMsg {
    color: red;
    margin: 0;
  }
`
const StyledInput = styled.input`
  height: 35px;
  border: 1px solid black;
  border-radius: 5px;
`

export default EmailLogin