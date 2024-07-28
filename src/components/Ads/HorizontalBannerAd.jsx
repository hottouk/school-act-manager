import React, { useEffect } from 'react'
import styled from 'styled-components';

const HorizontalBannerAd = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [])
  return (
    <StyledAdContainer>
      <ins className="kakao_ad_area"
        style={{ display: 'none' }}
        data-ad-unit="DAN-j7yl6yzSKsZiIKvT"     //AdFit에서 발급 받은 광고단위코드 값
        data-ad-width="728"                     // 광고단위 가로 사이즈
        data-ad-height="90"                     // 광고단위 세로 사이즈
      >
      </ins>
    </StyledAdContainer>
  )
}

const StyledAdContainer = styled.div`
  display: flex;
  justify-content: center;
`
export default HorizontalBannerAd