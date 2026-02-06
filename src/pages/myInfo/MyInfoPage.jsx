import React, { useEffect } from 'react'
import MainContainer from '../../components/Styled/MainContainer'
import MyinfoSection from '../../components/section/MyinfoSection'
import MainWrapper from '../../components/Styled/MainWrapper'
import useFireUserData from '../../hooks/Firebase/useFireUserData'

const MyInfoPage = () => {
  
  const { userRtData, userDataListener } = useFireUserData();
  console.log(userRtData);
  useEffect(() => { userDataListener(); }, []);
  return (
    <MainContainer>
      <MainWrapper>
        <MyinfoSection myUserData={userRtData} />
      </MainWrapper>
    </MainContainer>
  )
}

export default MyInfoPage
