import React, { useState } from 'react'
import styled from 'styled-components'
import MainBtn from '../../components/Btn/MainBtn'
//수정(251109) -> 기능변경(260203)
const TestLoginSection = ({ login }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <Section>
      <InputWrapper>
        <LoginInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <LoginInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </InputWrapper>
      <Column>
        <MainBtn type="submit" onClick={() => login(email, password)} >로그인</MainBtn>
        <span style={{ fontSize: "14px", color: "#efefef", marginTop: "10px", }}>
          이메일 로그인은 더이상 지원하지 않습니다.<br />
          SNS로그인을 이용해주세요.
        </span>
      </Column>
    </Section >
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const Section = styled(Column)`
  box-sizing: border-box;
  gap: 20px;
  background-color: #ffffff50;
  padding: 30px;
  border-radius: 10px;
`
const InputWrapper = styled(Column)`
  margin-top: 10px;
  gap: 15px;
`
const LoginInput = styled.input`
  height: 35px;
  border: none;
  border-radius: 5px;
  padding: 0 10px;
`
export default TestLoginSection