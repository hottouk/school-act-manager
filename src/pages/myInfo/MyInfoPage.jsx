import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '../../store/userSlice'
//section
import MyinfoSection from '../../components/section/MyinfoSection'
import MySchoolSection from '../../components/section/MySchoolSection'
//component
import MainContainer from '../../components/Styled/MainContainer'
import MainWrapper from '../../components/Styled/MainWrapper'
import MainBtn from '../../components/Btn/MainBtn'
import Title from '../../components/Title/Title'
//hooks
import useFireUserData from '../../hooks/Firebase/useFireUserData'
import useFireSchoolData from '../../hooks/Firebase/useFireSchoolData'
import useLogout from '../../hooks/useLogout'
import ClickableText from '../../components/Styled/ClickableText'
import styled from 'styled-components'
import UpperTab from '../../components/UpperTab'
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
  //
  const [schoolInfo, setSchoolInfo] = useState(null);

  const [tab, setTab] = useState(1);
  const [subjectGptExList, setSubjectGptExList] = useState(["아무말", "저런말", "이런말"]);
  const [isEdit, setIsEdit] = useState(false);
  const handleSaveOnClick = async () => {
    const confirm = window.confirm("저장하시겠어여?");
    if (!confirm) return;
    try {
      await updateUserInfo(subjectGptExList);
      alert("저장되었습니다.");
    } catch (error) {
      alert("뭔가 문제 발생");
    }
  }
  //**함수부**
  return (
    <MainContainer styles={{ gap: "10px", paddingTop: "20px" }}>
      <MainWrapper>
        <MyinfoSection userRtData={userRtData} updateUserInfo={updateUserInfo} isFromInfoPage={true} />
      </MainWrapper>
      <MainWrapper>
        <MySchoolSection mySchooInfo={schoolInfo} leaveSchoolTx={leaveSchoolTx} isFromInfoPage={true} />
      </MainWrapper>
      <Row>
        <UpperTab>과세특</UpperTab>
        <UpperTab>행발</UpperTab>
      </Row>
      <MainWrapper>
        <Title>GPT 내 스타일 설정</Title>
        {!subjectGptExList && "데이터가 없습니다."}
        {subjectGptExList.map((rec, idx) => {
          return <textarea key={idx} type="text" value={subjectGptExList[idx]}
            onChange={(event) =>
              setSubjectGptExList((prev) => {
                const updated = [...prev];
                updated[idx] = event.target.value;
                return updated;
              })
            }
            disabled={!isEdit}
          />
        })}
        <Row style={{ gap: "10px" }}>
          {!isEdit && <ClickableText onClick={() => setIsEdit(true)}>편집</ClickableText>}
          {isEdit && <>
            <ClickableText onClick={handleSaveOnClick}>저장</ClickableText>
            <ClickableText onClick={() => setIsEdit(false)}>취소</ClickableText>
          </>}
        </Row>

      </MainWrapper>
      <MainBtn styles={{ width: "75%", margin: "0 auto" }} onClick={() => logout()}>로그아웃</MainBtn>
    </MainContainer >
  )
}
export default MyInfoPage

const Row = styled.div`
  display: flex;
`

const Textarea = styled.textarea`

  & disabled {
    background-color: #ddd;
  }
`