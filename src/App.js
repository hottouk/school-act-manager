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

function App() {
  const user = useSelector(({ user }) => { return user; })
  const uid = user.uid
  console.log('App', user)

  return (
    <>
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
          <Route path='/classrooms/:id/allStudents' element={<ClassAllStudents />} />
          <Route path='/classrooms/:id/:studentId' element={<StudentDetail />} />
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
