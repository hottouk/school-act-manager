import React, { useState } from 'react'
import styled from 'styled-components'
import MainBtn from '../../components/Btn/MainBtn'
//수정(251109)
const EmailLoginSection = ({ login }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <Container >
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
        <MainBtn type="submit" onClick={() => login(email, password)} >로그인</MainBtn>
      </LoginWrapper>
      <span style={{ marginTop: "10px", fontSize: "14px" }}>
        이메일 회원가입은 더이상 지원하지 않습니다.<br />
        SNS로그인을 이용해주세요.
      </span>
    </Container >
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const Container = styled(Column)`
  box-sizing: border-box;
`
const LoginWrapper = styled(Row)`
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  gap: 20px;
`
const InputWrapper = styled(Column)`
  justify-content: space-around;
  gap: 10px;
`
const StyledInput = styled.input`
  height: 35px;
  border: 1px solid black;
  border-radius: 5px;
`
export default EmailLoginSection