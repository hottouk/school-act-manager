import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import useGetMyUserInfo from '../../hooks/useGetMyUserInfo'
import useEnrollClass from '../../hooks/useEnrollClass'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../store/userSlice'

const StudentManagement = () => {
  //서버에서 갓잡은 싱싱한 내 정보를 전역변수화
  const user = useSelector(({ user }) => { return user })
  const { myUserInfo, errByGetMyUserInfo } = useGetMyUserInfo()
  const [_errByGetMyUserInfo, setErrByGetMyUserInfo] = useState(null)
  const { approveMembership, denyMembership } = useEnrollClass()
  const dispatch = useDispatch()

  useEffect(() => {
    if (myUserInfo) {
      dispatch(setUser(myUserInfo))
    }
    if (errByGetMyUserInfo) {
      setErrByGetMyUserInfo(errByGetMyUserInfo)
    }
  }, [myUserInfo])

  const handleBtnClick = (event, studentInfo, classInfo) => {
    switch (event.target.id) {
      case "approval_btn":
        console.log(classInfo, studentInfo)
        approveMembership(classInfo, studentInfo)
        break;
      case "deny_btn":
        console.log(classInfo, studentInfo)
        denyMembership(classInfo, studentInfo)
        break;
      default: return
    }
  }

  return (
    <StyledContainer>
      <StyledMain>
        {(!user.appliedStudentClassList || user.appliedStudentClassList.length === 0) && <p>로딩중</p>}
        {_errByGetMyUserInfo && <strong>_errByGetMyUserInfo</strong>}
        <ul>
          {user.appliedStudentClassList && user.appliedStudentClassList.map((info) => {
            let studentInfo = info.student
            let classInfo = info.classInfo
            let key = `${studentInfo.uid}${classInfo.id}`
            return (<li key={key}>
              <p>{studentInfo.name}학생이 {classInfo.classTitle}반 가입을 신청했습니다.</p>
              <StyledBtnDiv>
                <button id="approval_btn" onClick={(event) => { handleBtnClick(event, studentInfo, classInfo) }}>승인</button>
                <button id="deny_btn" onClick={(event) => { handleBtnClick(event, studentInfo, classInfo) }}>거부</button>
              </StyledBtnDiv>
            </li>
            )
          })}
        </ul>
      </StyledMain>
    </StyledContainer>
  )
}

const StyledContainer = styled.main`
  box-sizing: border-box;
  width: 80%;
  margin: 0 auto 50px;
  @media screen and (max-width: 767px){
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    margin: 0;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
const StyledMain = styled.main`
  padding: 5px;
  margin-top: 50px;
  border-left: 12px #3454d1 double;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
  h4 {
    display: flex;
    justify-content: center;
    margin: 10px auto;
  }
  @media screen and (max-width: 767px){
    margin-top: 0;
    border-left: none;
    border-top: 12px #3454d1 double;
    box-shadow: none;
  }
`

const StyledBtnDiv = styled.div`

`
export default StudentManagement