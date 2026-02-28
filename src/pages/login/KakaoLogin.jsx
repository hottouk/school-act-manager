//라이브러리
import { useCallback, useEffect } from 'react';
import kakaoBtn from '../../image/login/kakao_login_btn.png'
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
//hooks
import useLogin from '../../hooks/useLogin';
//생성(240724) => auth 추가(260227)
const KakaoSocialLogin = ({ setIsSnsModal }) => {
  const kakaoClientId = process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY; //id
  useEffect(() => { if (!window.Kakao.isInitialized()) { window.Kakao.init(kakaoClientId); } }, []) //1) 초기화
  const location = useLocation();
  const { kakaoLogin } = useLogin() //4) 최종 처리

  //**함수부**/
  //1) 버튼 클릭: 인가 코드 호출
  const handleLogin = () => {
    window.Kakao.Auth.authorize({
      redirectUri: process.env.REACT_APP_KAKAO_REDIRECT_URI
    });
  };

  //2) 토큰 호출
  const getKakaoToken = useCallback(async (code) => {
    console.log("1단계 코드:", code);
    const res = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.REACT_APP_KAKAO_REST_API_KEY,
        redirect_uri: process.env.REACT_APP_KAKAO_REDIRECT_URI,
        code: code
      }),
    });
    if (!res.ok) {
      const errorDetail = await res.text();
      throw new Error(`토큰 가져오기 실패: ${res.status} ${res.statusText} - ${errorDetail}`);
    }
    return res.json();
  }, []);

  //3) 리다이렉트 페이지(현재 페이지)로 토큰 및 사용자 정보 가져오기.
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    if (!code) return;
    const fetchToken = async () => {
      const tokenData = await getKakaoToken(code);//토큰 요청
      console.log("2단계 토큰:", tokenData);
      kakaoLogin({ access_token: tokenData.access_token, setIsSnsModal });
    }
    fetchToken(code);
  }, [location, getKakaoToken]);

  return <KakaoLoginBtn src={kakaoBtn} alt="카카오 버튼" onClick={handleLogin}></KakaoLoginBtn>
}
const KakaoLoginBtn = styled.img`
  cursor: pointer;
`
export default KakaoSocialLogin


