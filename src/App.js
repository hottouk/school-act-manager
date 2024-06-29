import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
//bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';
//components
import Login from './pages/login/Login';
import ClassMain from './pages/main/ClassMain';
import Nav from './components/Nav';
import ActivityMain from './pages/activity/ActivityMain';
import ClassRoomMain from './pages/classRoom/ClassRoomMain';
import ClassRoomDetails from './pages/classRoom/ClassRoomDetails';
import StudentDetail from './pages/student/StudentDetail';
import ClassAllStudents from './pages/classRoom/ClassAllStudents';
import ClassSortSelection from './pages/classSetting/ClassSortSelection';
import ClassRoomMakeForm from './pages/classSetting/ClassRoomMakeForm';
import News from './pages/main/News';
import ActivityForm from './pages/activity/ActivitityForm';
import Homework from './components/Homework';
import UserMain from './pages/student/UserMain';
import { useSelector } from 'react-redux';
import { Helmet } from "react-helmet";
//단어 배틀
import WordSetMain from './pages/wordBattle/WordSetMain';
import WordBattle from './pages/wordBattle/WordBattle';
import WordForm from './pages/wordBattle/WordForm';

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
          {/* 활동 관리 */}
          <Route path="/activities" element={uid ? <ActivityMain /> : <Navigate replace={true} to='/login' />} />
          <Route path="/activities_all" element={uid ? <ActivityMain /> : <Navigate replace={true} to='/login' />} />
          <Route path="/activities/:activityId" element={uid ? <ActivityForm /> : <Navigate replace={true} to='/login' />} />
          <Route path="/activities/:activityId/:studentId" element={uid ? <Homework /> : <Navigate replace={true} to='/login' />} />
          <Route path="/activities_setting" element={uid ? <ActivityForm /> : <Navigate replace={true} to='/login' />} />
          <Route path="/activities/others" element={uid ? <ActivityMain /> : <Navigate replace={true} to='/login' />} />
          {/* 클래스 관리 */}
          <Route path="/classrooms" element={uid ? <ClassRoomMain /> : <Navigate replace={true} to='/login' />} />
          <Route path="/classrooms/:id" element={uid ? <ClassRoomDetails /> : <Navigate replace={true} to='/login' />} />
          <Route path="/classrooms/:id/allStudents" element={uid ? <ClassAllStudents /> : <Navigate replace={true} to='/login' />} />
          <Route path="/classrooms/:id/:studentId" element={uid ? <StudentDetail /> : <Navigate replace={true} to='/login' />} />
          {/* //클래스 만들기, 교사 회원만 가능 */}
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
          <Route path="/login" element={!uid ? <Login /> : <Navigate replace={true} to='/' />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App;
