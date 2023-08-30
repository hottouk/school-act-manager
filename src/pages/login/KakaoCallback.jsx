import { useEffect } from "react";

const KakaoCallback = () => {
  useEffect(() => {
    const href = window.location.href //현재 윈도우창의 주소
    let params = new URL(href).searchParams; //현재 주소에서 파라미터 찾기(?)
    let code = params.get('code'); //파라미터 안에서 코드값을 가져옴
    console.log(code)
  }, [])

  return (
    <>
    <h2>잠시만 기다려 주세요. 카카오로 로그인 중입니다.</h2>
    </>
  )
}

export default KakaoCallback