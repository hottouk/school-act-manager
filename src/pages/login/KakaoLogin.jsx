import { KEYS } from '../../keys'

const KakaoSocialLogin = () => {
  const Rest_api_key = KEYS.KAKAO_REST_API_KEY //REST API KEY
  const redirect_uri = KEYS.KAKAO_REDIRECT_URL //Redirect URI
  // oauth 요청 URL
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
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

