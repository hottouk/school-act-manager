
const KakaoSocialLogin = () => {
  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY
  const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI
  // oauth 요청 URL
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`
  const handleLogin = () => {
    window.location.href = kakaoURL
  }

  return (
    <>
      <button onClick={handleLogin}>카카오 로그인</button>
    </>
  )
}

export default KakaoSocialLogin

