import React, { useState } from 'react'
import styles from './Signup.module.css'
import useSignup from '../../hooks/useSignup'

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const { err, isPending, signUp } = useSignup();
  

  const handleOnChange = (event) => {
    if (event.target.type === 'email') {
      setEmail(event.target.value)
    } else if (event.target.type === 'password') {
      setPassword(event.target.value)
    } else if (event.target.type === 'text') {
      setDisplayName(event.target.value)
    } 
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(email, password)
    signUp(email, password, displayName)
  }

  return (
    <form className={styles.signup_form} onSubmit={handleSubmit}>
      <fieldset>
        <legend>회원가입</legend>

        <label htmlFor='myEmailId'>Email ID</label>
        <input type='email' id='myEmailId' onChange={handleOnChange} value={email} required />

        <label htmlFor='myPassword'>비밀번호</label>
        <input type='password' id='myPassword' onChange={handleOnChange} value={password} required />

        <label htmlFor='myName'>이름</label>
        <input type='text' id='myName' onChange={handleOnChange} value={displayName} required />

        <button className={styles.btn} type='submit'>회원가입</button>
      </fieldset>
    </form>
  )
}

export default Signup