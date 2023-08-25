import axios from "axios";
import { useEffect } from "react";
import { KEYS } from "../../keys";

const KakaoCallback = () => {
  useEffect(() => {
    const params = new URL(document.location.toString()).searchParams;
    const code = params.get('code');
    const REST_API_KEY = KEYS.KAKAO_REST_API_KEY //REST API KEY
    const REDIRECT_URI = KEYS.KAKAO_REDIRECT_URL //Redirect URI

    axios.post(
      `https://kauth.kakao.com/oauth/token`,
      {},
      {
        headers: { "Content-type": "application/x-www-form-urlencoded;charset=utf-8" },
        params:
        {
          grant_type: 'authorization_code',
          client_id: REST_API_KEY,
          code,
          redirect_uri: REDIRECT_URI
        }
      }
    )
      .then((res) => {
        console.log(res);
        const { access_token } = res.data;
        axios.post(
          `https://kapi.kakao.com/v2/user/me`,
          {},
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            }
          }
        )
          .then((res) => {
            console.log('2번째', res);
          })
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <>
    </>
  )
}

export default KakaoCallback