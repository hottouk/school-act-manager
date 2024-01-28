import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import useGetMyUserInfo from '../../hooks/useGetMyUserInfo'
import useEnrollClass from '../../hooks/useEnrollClass'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../store/userSlice'
import EmptyResult from '../../components/EmptyResult'

const StudentManagement = () => {
  const user = useSelector(({ user }) => { return user })
  const { myUserInfo, errByGetMyUserInfo } = useGetMyUserInfo()
  const [_errByGetMyUserInfo, setErrByGetMyUserInfo] = useState(null)
  const { approveMembership, denyMembership } = useEnrollClass()
  const dispatch = useDispatch()

  useEffect(() => {
    if (myUserInfo) {
      dispatch(setUser(myUserInfo)) //서버에서 갓잡은 내 정보를 전역변수화
    }
    if (errByGetMyUserInfo) {
      setErrByGetMyUserInfo(errByGetMyUserInfo)
    }
  }, [myUserInfo])

  const handleBtnClick = (event, params) => {
    switch (event.target.id) {
      case "approval_btn":
        approveMembership(params)
        break;
      case "deny_btn":
        denyMembership(params)
        break;
      default: return
    }
  }

  return (
    <StyledContainer>
      <StyledMain>
        {(!user.appliedStudentClassList || user.appliedStudentClassList.length === 0) && <EmptyResult comment="현재 신청 내역이 없습니다." />}
        {_errByGetMyUserInfo && <strong>_errByGetMyUserInfo</strong>}
        <ul>
          {user.appliedStudentClassList && user.appliedStudentClassList.map((params) => {
            let studentInfo = params.studentInfo;
            let petInfo = params.petInfo;
            let classInfo = params.classInfo
            let key = params.id
            return (<li key={key}>
              <p>
                <span className='important_info'>{studentInfo.studentNumber} {studentInfo.name}</span>학생이
                <span className='important_info'>{classInfo.grade}</span>학년
                <span className='important_info'>{classInfo.subject} {classInfo.classTitle}</span>의
                <span className='important_info'>{petInfo.label}</span>을(를) 구독 신청했습니다.
              </p>
              <StyledBtnDiv>
                <button id="approval_btn" onClick={(event) => { handleBtnClick(event, params) }}>승인</button>
                <button id="deny_btn" onClick={(event) => { handleBtnClick(event,params) }}>거부</button>
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
  margin-top: 50px;
  border-left: 12px #3454d1 double;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
  li { 
    display: flex;
    justify-content: space-between;
    align-items: center; 
    padding: 10px;
  }
  p {
    margin: 0; 
  }
  span.important_info {
    color: #3454d1;
    font-weight: bold;
  }
  @media screen and (max-width: 767px){
    margin-top: 0;
    border-left: none;
    border-top: 12px #3454d1 double;
    box-shadow: none;
  }
`
const StyledBtnDiv = styled.div`
  button {
    margin-left: 15px;
  }
`
export default StudentManagement