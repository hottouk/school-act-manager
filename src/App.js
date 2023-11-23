import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';

//bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';

//components
import Login from './pages/login/Login';
import ClassMain from './pages/main/ClassMain';
import Nav from './components/Nav';
import Signup from './pages/signup/Signup';
import ActivityMain from './pages/activity/ActivityMain';
import ClassRoomMain from './pages/classRoom/ClassRoomMain';
import KakaoCallback from './pages/login/KakaoCallback';
import ClassRoomMakeForm from './pages/classRoom/ClassRoomMakeForm';
import ClassRoomDetails from './pages/classRoom/ClassRoomDetails';

function App() {
  const { isReady, user } = useAuthContext();
  console.log('App', user)


  return (
    <>
      {isReady ? (
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route path="/" element={user ? <ClassMain /> : <Navigate replace={true} to='/login' />} />
            <Route path="/kakaoLogin" element={<Login />} />
            <Route path="/kakaoLogin/callback" element={<KakaoCallback />} />
            <Route path="/activities" element={user ? <ActivityMain /> : <Navigate replace={true} to='/login' />} />
            <Route path="/classrooms" element={user ? <ClassRoomMain /> : <Navigate replace={true} to='/login' />} />
            <Route path='/classrooms/:id' element={<ClassRoomDetails />} />
            <Route path="/classrooms_setting" element={user ? <ClassRoomMakeForm /> : <Navigate replace={true} to='/login' />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate replace={true} to='/' />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate replace={true} to='/' />} />
          </Routes>
        </BrowserRouter>) : '로딩중...'}
    </>
  )
}

export default App;
