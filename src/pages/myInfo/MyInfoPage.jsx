import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '../../store/userSlice'
import styled from 'styled-components'
//section
import MyinfoSection from '../../components/section/MyinfoSection'
import MySchoolSection from '../../components/section/MySchoolSection'
//component
import MainContainer from '../../components/Styled/MainContainer'
import MainWrapper from '../../components/Styled/MainWrapper'
import MainBtn from '../../components/Btn/MainBtn'
//hooks
import useFireUserData from '../../hooks/Firebase/useFireUserData'
import useFireSchoolData from '../../hooks/Firebase/useFireSchoolData'
import useLogout from '../../hooks/useLogout'
//생성(260209)
const MyInfoPage = () => {
  const { userRtData, userDataListener, updateUserInfo } = useFireUserData();
  const { fetchSchoolByCode, leaveSchoolTx } = useFireSchoolData();
  const dispatcher = useDispatch();
  const { logout } = useLogout(); //로그아웃
  useEffect(() => userDataListener(), []);
  useEffect(() => {
    if (!userRtData) return;
    dispatcher(setUser(userRtData));
    const fetchSchoolData = async () => {
      const schoolCode = userRtData.school?.schoolCode;
      if (!schoolCode) { setSchoolInfo(null); return; }
      const schoolData = await fetchSchoolByCode(schoolCode);
      setSchoolInfo(schoolData);
    }
    fetchSchoolData();
  }, [userRtData]);
  const [schoolInfo, setSchoolInfo] = useState(null);
  return (
    <MainContainer styles={{ gap: "10px", paddingTop: "20px" }}>
      <MainWrapper>
        <MyinfoSection userRtData={userRtData} updateUserInfo={updateUserInfo} isFromInfoPage={true} />
      </MainWrapper>
      <MainWrapper>
        <MySchoolSection mySchooInfo={schoolInfo} leaveSchoolTx={leaveSchoolTx} isFromInfoPage={true} />
      </MainWrapper>
      <MainBtn styles={{ width: "75%", margin: "0 auto" }} onClick={() => logout()}>로그아웃</MainBtn>
    </MainContainer >
  )
}
export default MyInfoPage

const Row = styled.div`
  display: flex;
`