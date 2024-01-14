import KakaoLogin from "react-kakao-login";

const KakaoSocialLogin = () => {
  const kakaoClientId = process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY;
  const kakaoOnSuccess = async (data) => {
    console.log(data)
    const idToken = data.response.access_token  // 엑세스 토큰 백엔드로 전달
    console.log(idToken)
  }
  const kakaoOnFailure = (error) => {
    console.log(error);
  };
  return (
    <KakaoLogin
      token={kakaoClientId}
      onSuccess={kakaoOnSuccess}
      onFail={kakaoOnFailure} />
  )
}

export default KakaoSocialLogin
