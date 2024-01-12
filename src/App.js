import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
//bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';
//components
import Login from './pages/login/Login';
import ClassMain from './pages/main/ClassMain';
import Nav from './components/Nav';
import Signup from './pages/signup/Signup';
import KakaoCallback from './pages/login/KakaoCallback';
import ActivityMain from './pages/activity/ActivityMain';
import ActivityDetails from './pages/activity/ActivityDetails';
import ClassRoomMain from './pages/classRoom/ClassRoomMain';
import ClassRoomDetails from './pages/classRoom/ClassRoomDetails';
import StudentDetail from './pages/student/StudentDetail';
import ClassAllStudents from './pages/classRoom/ClassAllStudents';
import ClassSortSelection from './pages/classSetting/ClassSortSelection';
import ClassRoomMakeForm from './pages/classSetting/ClassRoomMakeForm';
import { useSelector } from 'react-redux';
import SignUpWithSNS from './pages/signup/SignUpWithSNS';
import { Helmet } from "react-helmet";

function App() {
  const user = useSelector(({ user }) => { return user; })
  const uid = user.uid
  return (
    <>
      <Helmet>
        <title>생기부 입력 도우미</title>
        {/* loDash 라이브러리 */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js" integrity="sha512-WFN04846sdKMIP5LKNphMaWzU7YpMyCU245etK3g/2ARYbPK9Ub18eG+ljU96qKRCWh+quCY7yefSmlkQw1ANQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
      </Helmet>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={uid ? <ClassMain /> : <Navigate replace={true} to='/login' />} />
          {/* <Route path="/kakaoLogin" element={<Login />} />
          <Route path="/kakaoLogin/callback" element={<KakaoCallback />} /> */}
          {/* 활동 관리 */}
          <Route path="/activities" element={uid ? <ActivityMain /> : <Navigate replace={true} to='/login' />} />
          <Route path="/activities/:activityId" element={uid ? <ActivityDetails /> : <Navigate replace={true} to='/login' />} />
          <Route path="/activities_setting" element={uid ? <ActivityDetails /> : <Navigate replace={true} to='/login' />} />
          {/* 클래스 관리 */}
          <Route path="/classrooms" element={uid ? <ClassRoomMain /> : <Navigate replace={true} to='/login' />} />
          <Route path='/classrooms/:id' element={<ClassRoomDetails />} />
          <Route path='/classrooms/:id/allStudents' element={uid ? <ClassAllStudents /> : <Navigate replace={true} to='/login' />} />
          <Route path='/classrooms/:id/:studentId' element={uid ? <StudentDetail /> : <Navigate replace={true} to='/login' />} />
          {/* //클래스 만들기 */}
          <Route path="/classrooms_setting" element={uid ? <ClassSortSelection /> : <Navigate replace={true} to='/login' />} />
          <Route path="/classrooms_setting_details" element={uid ? <ClassRoomMakeForm /> : <Navigate replace={true} to='/login' />} />
          {/* 로그인/회원가입 */}
          <Route path="/login" element={!uid ? <Login /> : <Navigate replace={true} to='/' />} />
          <Route path="/signUpWithSNS" element={!uid ? <SignUpWithSNS /> : <Navigate replace={true} to='/' />} />
          <Route path="/signup" element={!uid ? <Signup /> : <Navigate replace={true} to='/' />} />
          {/* // : <Navigate replace={true} to='/' */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
