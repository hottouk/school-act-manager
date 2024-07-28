import { useEffect } from 'react';
import kakaoBtn from '../../image/login/kakao_login_btn.png'
import { useLocation } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';
import styled from 'styled-components';

//2024.07.24
const KakaoSocialLogin = (props) => {
  //1. 변수
  const kakaoClientId = process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY; //id
  useEffect(() => { //1) 초기화
    if (!window.Kakao.isInitialized()) { window.Kakao.init(kakaoClientId); }
  }, [])
  const location = useLocation();
  useEffect(() => {  //2) 인가 코드
    let searchParams = new URLSearchParams(location.search);
    let code = searchParams.get('code');
    if (code) fetchTokenAndUserInfo(code).then((userInfo) => {
      kakaoLogin(userInfo, props.openModal)
    })
  }, [location]);

  const { kakaoLogin } = useLogin() //3) 최종 처리

  //2. 함수
  //1) 토큰 
  const getKakaoToken = async (code) => {//
    let response = await fetch('https://kauth.kakao.com/oauth/token', {
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
    if (!response.ok) {
      let errorDetail = await response.text();
      throw new Error(`토큰 가져오기 실패: ${response.status} ${response.statusText} - ${errorDetail}`);
    }
    return response.json();
  }

  //2) 사용자 정보
  const getKakaoUserInfo = async (accessToken) => {
    const response = await fetch('https://kapi.kakao.com/v2/user/me', { //요청 보내기
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(`사용자 정보 가져오기 실패: ${response.status} ${response.statusText} - ${errorDetail}`);
    }

    return response.json();
  };

  //3) 가져 오기
  const fetchTokenAndUserInfo = async (code) => {
    try {
      if (code) {
        let tokenData = await getKakaoToken(code)                         //토큰 요청
        let userInfo = await getKakaoUserInfo(tokenData.access_token);    //유저 정보 요청
        return userInfo
      }
    } catch (err) {
      console.error('오류 발생', err);
    }
  }
  //4) 버튼 클릭
  const handleLogin = () => {
    window.Kakao.Auth.authorize({
      redirectUri: process.env.REACT_APP_KAKAO_REDIRECT_URI
    });
  };

  return (
    <KakaoLoginBtn src={kakaoBtn} alt="카카오 버튼" onClick={handleLogin}></KakaoLoginBtn>
  )
}

const KakaoLoginBtn = styled.img`
  cursor: pointer;
`

export default KakaoSocialLogin


