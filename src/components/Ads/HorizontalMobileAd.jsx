import React, { useEffect } from 'react'
import styled from 'styled-components';
//생성(251105)
const HorizontalMobileAd = () => {
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
		<Container>
			<ins className="kakao_ad_area"
				style={{ display: 'none' }}
				data-ad-unit="DAN-SW68umm6HcRpixrd"
				data-ad-width="320"
				data-ad-height="100">
			</ins>
		</Container>
	)
}
const Container = styled.div`
  display: flex;
  justify-content: center;
`
export default HorizontalMobileAd