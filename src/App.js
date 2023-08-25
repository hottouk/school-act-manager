import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login/Login';
import ClassMain from './pages/main/ClassMain';
import Nav from './components/Nav';

import Signup from './pages/signup/Signup';
import { useAuthContext } from './hooks/useAuthContext';
import ActivityMain from './pages/activity/ActivityMain';

function App() {
  const { isReady, user } = useAuthContext();
  console.log('App',user)

  return (
    <>
      {isReady ? (
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route path="/" element={user? <ClassMain />: <Navigate replace={true} to='/login' />} />
            <Route path="/login" element={!user? <Login />: <Navigate replace={true} to='/'/>  } />
            <Route path="/signup" element={!user? <Signup />: <Navigate replace={true} to='/'/>  } />
            <Route path="/activities" element={<ActivityMain/>}/>
          </Routes>
        </BrowserRouter>) : '로딩중...'}
    </>
  )
}

export default App;
