import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import useGetMyUserInfo from '../../hooks/useGetMyUserInfo'
import useEnrollClass from '../../hooks/useEnrollClass'
import { useSelector } from 'react-redux'
import EmptyResult from '../../components/EmptyResult'
import { useNavigate } from 'react-router-dom'
import useAddUpdFireData from '../../hooks/useAddUpdFireData'
import RewardModal from '../../components/Modal/RewardModal'
import useDoActivity from '../../hooks/useDoActivity'

//todo 문서쓰기
const News = () => {
  const user = useSelector(({ user }) => { return user })
  const { errByGetMyUserInfo } = useGetMyUserInfo()
  const [_errByGetMyUserInfo, setErrByGetMyUserInfo] = useState(null)
  const [signUpNewsList, setSignUpNewsList] = useState(null) //가입 소식
  const [homeworkNewsList, setHomeworkNewsList] = useState(null) //과제 소식
  const [reward, setReward] = useState(null)
  const [isModalShown, setIsModalShown] = useState(false)

  const { approveMembership, confirmApplyResult, denyMembership } = useEnrollClass()
  const { confirmHomeworkResult } = useDoActivity()
  const { getInfo } = useAddUpdFireData("activities")
  const navigate = useNavigate()

  useEffect(() => {
    if (errByGetMyUserInfo) {
      setErrByGetMyUserInfo(errByGetMyUserInfo)
    }
  }, [errByGetMyUserInfo])

  useEffect(() => {
    if (user.isTeacher) { //todo
    } else {
      if (user.classNewsList) { //새소식 존재?
        setSignUpNewsList(user.classNewsList.filter((item) => { return item.type === "class" })) //가입 소식
        setHomeworkNewsList(user.classNewsList.filter((item) => { return item.type === "homework" })) //과제 소식
      }
    }
  }, [user])

  const handleBtnClick = (event, params) => { //prams는 actiInfo
    switch (event.target.id) {
      case "approval_btn":
        approveMembership(params)
        break;
      case "deny_btn":
        denyMembership(params)
        break;
      case "check_homework_btn":
        let studentId = params.id.split("/")[0]
        let actId = params.id.split("/")[1]
        getInfo(actId, "acti").then((acti) => {
          let particiList = acti.data().particiList
          let actInfo = { id: acti.id, ...acti.data() }
          let student = particiList.find((item) => { return item.uid === studentId })
          navigate(`/activities/${actId}/${studentId}`, { state: { acti: actInfo, student } })
        })
        break;
      case "signup_result_btn":
        confirmApplyResult(params, callRewardModal)
        break;
      case "homework_result_btn":
        confirmHomeworkResult(params, callRewardModal)
        break;
      default: return
    }
  }

  const callRewardModal = (reward) => { //보상 Modal 부르기
    setIsModalShown(true)
    setReward(reward)
  }

  return (<><StyledContainer>
    {/* 교사용 */}
    {user.isTeacher && <>
      <p>클래스 가입 신청</p>
      <StyledMain>
        {(!user.appliedStudentClassList || user.appliedStudentClassList.length === 0) && <EmptyResult comment="현재 신청 내역이 없습니다." />}
        {_errByGetMyUserInfo && <strong>_errByGetMyUserInfo</strong>}
        <ul>
          {user.appliedStudentClassList && user.appliedStudentClassList.map((item) => {
            let studentInfo = item.studentInfo;
            let petInfo = item.petInfo;
            let classInfo = item.classInfo
            let key = item.id
            return (<li key={key} className="class_sign_up_li">
              <pre>
                <span className="important">{studentInfo.studentNumber} {studentInfo.name}</span> 학생이
                <span className="important">{classInfo.grade}</span>학년
                <span className="important">{classInfo.subject} {classInfo.classTitle}</span>의
                <span className="important">{petInfo.label}</span>을(를) 구독 신청했습니다.
              </pre>
              <StyledBtnDiv>
                <StyledBtn18 id="approval_btn" onClick={(event) => { handleBtnClick(event, item) }}>승인</StyledBtn18>
                <StyledBtn18 id="deny_btn" $color="redish" onClick={(event) => { handleBtnClick(event, item) }}>거부</StyledBtn18>
              </StyledBtnDiv>
            </li>)
          })}
        </ul>
      </StyledMain>
      <p>과제 제출</p>
      <StyledMain>
        {(!user.homeworkList || user.homeworkList.length === 0) && <EmptyResult comment="현재 과제 제출 내역이 없습니다." />}
        {_errByGetMyUserInfo && <strong>_errByGetMyUserInfo</strong>}
        <ul>
          {user.homeworkList && user.homeworkList.map((item) => {
            return (<li key={item.id} className="class_sign_up_li">
              <pre>
                <span className="important">{item.studentName}</span> 학생이 <span className="important">{item.actTitle}</span> 활동 과제를 제출했습니다.
              </pre>
              <StyledBtnDiv>
                <StyledBtn18 id="check_homework_btn" onClick={(event) => { handleBtnClick(event, item) }}>과제 확인하기</StyledBtn18>
              </StyledBtnDiv>
            </li>)
          })}
        </ul>
      </StyledMain>
    </>}
    {/* 학생용 */}
    {!user.isTeacher && <>
      <p>클래스 신청 결과</p>
      <StyledMain>
        {(!signUpNewsList || signUpNewsList.length === 0) && <EmptyResult comment="현재 승인 내역이 없습니다." />}
        {_errByGetMyUserInfo && <strong>_errByGetMyUserInfo</strong>}
        {signUpNewsList && <ul>
          {signUpNewsList.map((item) => {
            let isApproved
            if (item.isApproved) { isApproved = "승인" } else { isApproved = "거부" }
            return (<li key={item.id}>
              <pre>
                <span className="important">{item.subject}</span> 과목 <span className="important">{item.classTitle}</span>
                반 신청이 <span className="important">{isApproved}</span>되었습니다.</pre>
              <StyledBtnDiv>
                <StyledBtn18 id="signup_result_btn" onClick={(event) => { handleBtnClick(event, item) }}>확인</StyledBtn18>
              </StyledBtnDiv>
            </li>);
          })}
        </ul>}
      </StyledMain>
      <p>과제 결과</p>
      <StyledMain>
        {(!homeworkNewsList || homeworkNewsList.length === 0) && < EmptyResult comment="과제 결과 내역이 없습니다." />}
        {homeworkNewsList && <ul>
          {homeworkNewsList.map((item) => {
            return (<li key={item.id}>
              {item.isApproved && <pre><span className="important">{item.title}</span> 활동의 과제가 <span className="important">승인</span> 되었습니다. </pre>}
              {!item.isApproved && <pre><span className="important">{item.actTitle}</span> 활동의 과제가 <span className="important">{item.feedback}</span>의 사유로 <span className="important">반려</span>
                되었습니다.</pre>}
              <StyledBtnDiv>
                <StyledBtn18 id="homework_result_btn" onClick={(event) => { handleBtnClick(event, item) }}>확인</StyledBtn18>
              </StyledBtnDiv>
            </li>)
          })}
        </ul>}
      </StyledMain>
    </>}
  </StyledContainer>
    <RewardModal show={isModalShown} onHide={() => { setIsModalShown(false) }} rewards={reward} />
  </>)
}

const StyledContainer = styled.main`
  box-sizing: border-box;
  width: 80%;
  margin: 0 auto 50px;
  p {
    margin-bottom: 0;
    margin-top: 1rem;
  }
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
  margin: 5px 0 40px;
  padding: 4px;
  border-left: 12px #3454d1 double;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
  ul {
    margin: 10px auto;
  }
  li {
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  li.class_sign_up_li { 
    align-items: center; 
    padding: 10px;
  }
  pre {
    margin: 0; 
  }
  span.important {
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
    margin-right: 15px;
  }
`

const StyledBtn18 = styled.button`
  align-items: center;
  background-color: ${(props) => {
    return props.$color ? "#C70039" : "#3454d1"
  }};
  border: 0;
  border-radius: 100px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font-family: -apple-system, system-ui, system-ui, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 20px;
  max-width: 480px;
  min-height: 40px;
  min-width: 0px;
  overflow: hidden;
  padding: 0px;
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;
  touch-action: manipulation;
  transition: background-color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s, box-shadow 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s, color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;
  &:hover, focus {
    background-color: ${(props) => { return props.$color ? "#900C3F" : "#16437E" }};
    color: #ffffff;
  }
  &:active {
    background: #09223b;
    color: rgb(255, 255, 255, .7);
  }
  &:disabled {
    cursor: not - allowed;
    background: rgba(0, 0, 0, .08);
    color: rgba(0, 0, 0, .3);
  }
`
export default News