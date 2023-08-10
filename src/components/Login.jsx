import React from 'react'
//로그인 관련
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { KEYS } from "../keys";
import { useNavigate } from 'react-router-dom'


const Login = () => {
  const navigate = useNavigate()

  return (
    <div>
      <h3>호롤로 건강썜의 생기부 도우미</h3>
      {/* 구글 로그인 버튼 */}
      <GoogleOAuthProvider clientId={KEYS.google}>
        <GoogleLogin
          onSuccess={(res) => {
            console.log(res);
            navigate('/classMain') //이동
          }}   
          onFailure={(err) => {
            console.log(err);
          }}
        />
      </GoogleOAuthProvider>
    </div >
  )
}

export default Login

