import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import MainPanel from '../../components/MainPanel';
import styled from 'styled-components';
import useFireUserData from '../../hooks/Firebase/useFireUserData';
//생성(250721)
const IndividualPage = () => {
	const location = useLocation();
	const { state } = location;
	useEffect(() => { bindUserData(); }, [state])
	const { fetchUserData } = useFireUserData();
	const [userInfo, setUserInfo] = useState();
	const bindUserData = () => {
		if (!state) return;
		const { uid } = state;
		fetchUserData(uid).then((data) => {
			console.log(data);
			setUserInfo(data);
		})
	}
	return (
		<Container>
			<MainPanel>
				개인페이지 제작 중..
			</MainPanel>
		</Container>
	)
}

const Container = styled.div`
  box-sizing: border-box;
  width: 80%;
	margin: 0 auto 50px;

`
export default IndividualPage
