import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
//bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';
//로그인
import LoginPage from './pages/login/LoginPage';
import EmailSignupPage from './pages/login/EmailSignupPage';
//대문
import ClassMain from './pages/main/ClassMain';
import Nav from './components/Nav';
//활동 관리
import ActivityMain from './pages/activity/ActivityMain';
import ActivityFormPage from './pages/activity/ActivitityFormPage';
import ActivitySortPage from './pages/activity/ActivitySortPage';
//반 관리
import ClassRoomMain from './pages/classRoom/ClassRoomMain';
//담임반
import HomeroomDetailsPage from './pages/homeroom/HomeroomDetailsPage';
import HomeStudentDetailsPage from './pages/homeroom/HomeStudentDetailsPage';
import HomeClassAllStudentsPage from './pages/homeroom/HomeClassAllStudentsPage';

import ClassRoomDetailsPage from './pages/classRoom/ClassRoomDetailsPage';
import StudentDetail from './pages/student/StudentDetail';
import ClassAllStudentsPage from './pages/classRoom/ClassAllStudentsPage';
import ClassSortSelection from './pages/classSetting/ClassSortSelection';
import ClassRoomMakeForm from './pages/classSetting/ClassRoomMakeForm';
import News from './pages/main/News';
import Homework from './components/Homework';
import UserMain from './pages/student/UserMain';
import { useSelector } from 'react-redux';
import { Helmet } from "react-helmet";
//단어 배틀
import WordSetMain from './pages/wordBattle/WordSetMain';
import WordForm from './pages/wordBattle/WordForm';
//관리자
import MasterPage from './pages/main/MasterPage';

function App() {
  const user = useSelector(({ user }) => { return user; })
  const uid = user.uid
  return (
    <>
      <Helmet>
        <title>생기부 입력 도우미</title>
        {/* loDash 라이브러리 */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"
          integrity="sha512-WFN04846sdKMIP5LKNphMaWzU7YpMyCU245etK3g/2ARYbPK9Ub18eG+ljU96qKRCWh+quCY7yefSmlkQw1ANQ=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer">
        </script>
      </Helmet>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={uid ? <ClassMain /> : <Navigate replace={true} to='/login' />} />
          {/* 활동 관리 */}
          <Route path="/activities" element={uid ? <ActivityMain /> : <Navigate replace={true} to='/login' />} />
          <Route path="/activities_all" element={uid ? <ActivityMain /> : <Navigate replace={true} to='/login' />} />
          <Route path="/activities/:activityId" element={uid ? <ActivityFormPage /> : <Navigate replace={true} to='/login' />} />
          <Route path="/activities/:activityId/:studentId" element={uid ? <Homework /> : <Navigate replace={true} to='/login' />} />
          <Route path="/activities/others" element={uid ? <ActivityMain /> : <Navigate replace={true} to='/login' />} />
          {/* 활동 만들기, 교사 회원만 가능 */}
          <Route path="/activities_setting" element={uid ? <ActivitySortPage /> : <Navigate replace={true} to='/login' />} />
          <Route path="/activities_setting_details" element={uid ? <ActivityFormPage /> : <Navigate replace={true} to='/login' />} />
          {/* 담임반 관리 */}
          <Route path="/homeroom/:id" element={uid ? <HomeroomDetailsPage /> : <Navigate replace={true} to='/login' />} />
          <Route path="/homeroom/:id/:studentId" element={uid ? <HomeStudentDetailsPage /> : <Navigate replace={true} to='/login' />} />
          <Route path="/homeroom/:id/allStudents" element={uid ? <HomeClassAllStudentsPage /> : <Navigate replace={true} to='/login' />} />
          {/* 클래스 관리 */}
          <Route path="/classrooms" element={uid ? <ClassRoomMain /> : <Navigate replace={true} to='/login' />} />
          <Route path="/classrooms/:id" element={uid ? <ClassRoomDetailsPage /> : <Navigate replace={true} to='/login' />} />
          <Route path="/classrooms/:id/allStudents" element={uid ? <ClassAllStudentsPage /> : <Navigate replace={true} to='/login' />} />
          <Route path="/classrooms/:id/:studentId" element={uid ? <StudentDetail /> : <Navigate replace={true} to='/login' />} />
          {/* 클래스 만들기, 교사 회원만 가능 */}
          <Route path="/classrooms_setting" element={user.isTeacher ? <ClassSortSelection /> : <Navigate replace={true} to='/' />} />
          <Route path="/classrooms_setting_details" element={user.isTeacher ? <ClassRoomMakeForm /> : <Navigate replace={true} to='/' />} />
          {/* 학생 관리 */}
          <Route path="/users" element={uid ? <UserMain /> : <Navigate replace={true} to='/login' />} />
          {/* 단어장 관리 */}
          <Route path="/wordbattle" element={uid ? <WordSetMain /> : <Navigate replace={true} to='/login' />} />
          <Route path="/words_setting" element={uid ? <WordForm /> : <Navigate replace={true} to='/login' />} />
          {/* 새소식 관리 */}
          <Route path="/news" element={uid ? <News /> : <Navigate replace={true} to='/' />} />
          {/* 로그인/회원가입 */}
          <Route path="/login" element={!uid ? <LoginPage /> : <Navigate replace={true} to='/' />} />
          <Route path="/login/email" element={!uid ? <EmailSignupPage /> : <Navigate replace={true} to='/' />} />
          {/* 관리자 */}
          <Route path="/master" element={user.isMaster ? <MasterPage /> : <Navigate replace={true} to='/' />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App;
