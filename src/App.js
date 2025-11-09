//라이브러리
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Helmet } from "react-helmet";
import 'bootstrap/dist/css/bootstrap.min.css';
//로그인
import LoginPage from './pages/login/LoginPage';
import EmailSignupPage from './pages/login/EmailSignupPage';
//대문
import ClassMain from './pages/main/ClassMain';
import Nav from './components/Bar/Nav';
//활동 관리
import ActivityMain from './pages/activity/ActivityMain';
import ActivityFormPage from './pages/activity/ActivitityFormPage';
import ActivitySortPage from './pages/activity/ActivitySortPage';
//교과반
import ClassroomMainPage from './pages/classroom/ClassroomMainPage';
import ClassroomDetailsPage from './pages/classroom/ClassroomDetailsPage';
import StudentDetailPage from './pages/classroom/StudentDetailPage';
import ClassAllStudentsPage from './pages/classroom/ClassAllStudentsPage';
//담임반
import HomeroomDetailsPage from './pages/homeroom/HomeroomDetailsPage';
import HomeStudentDetailsPage from './pages/homeroom/HomeStudentDetailsPage';
import HomeClassAllStudentsPage from './pages/homeroom/HomeClassAllStudentsPage';
import ClassSortSelection from './pages/classSetting/ClassSortSelection';
import ClassroomFormPage from './pages/classSetting/ClassroomFormPage';
import WhatsNewPage from './pages/main/WhatsNewPage';
import MySchoolPage from './pages/school/MySchoolPage';
//단어 배틀
import GameSettingPage from './pages/quizBattle/GameSettingPage';
import QuizBattleMultiPage from './pages/quizBattle/QuizBattleMultiPage';
import QuizFormPage from './pages/quizBattle/QuizFormPage';
import QuizActiFormPage from './pages/quizBattle/QuizActiFormPage';
import QuizMainPage from './pages/quizBattle/QuizMainPage';
//관리자
import MasterPage from './pages/main/MasterPage';
import Lab from './pages/lab/Lab';
import HomeSeatChange from './pages/homeroom/HomeSeatChangePage';
//상점
import ShopMainPage from './pages/shop/ShopMainPage';
import IndividualPage from './pages/individual/IndividualPage';
import WidgetCheckoutPage from './pages/purchase/WidgetCheckoutPage';
import WidgetSuccessPage from './pages/purchase/WidgetSuccessPage';
import PurchaseFailPage from './pages/purchase/PurchaseFailPage';
import AmountSelectPage from './pages/purchase/AmountSelectPage';
import Footer from './components/Bar/Footer';
import styled from 'styled-components';

function App() {
  const user = useSelector(({ user }) => { return user; })
  const uid = user.uid;
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
        <AppLayout>
          <Nav />
          <Main>
            <Routes>
              <Route path="/" element={uid ? <ClassMain /> : <Navigate replace={true} to='/login' />} />
              {/* 활동 관리 */}
              <Route path="/activities" element={uid ? <ActivityMain /> : <Navigate replace={true} to='/login' />} />
              <Route path="/activities_all" element={uid ? <ActivityMain /> : <Navigate replace={true} to='/login' />} />
              <Route path="/activities/:activityId" element={uid ? <ActivityFormPage /> : <Navigate replace={true} to='/login' />} />
              <Route path="/activities/others" element={uid ? <ActivityMain /> : <Navigate replace={true} to='/login' />} />
              {/* 활동 만들기, 교사 회원만 가능 */}
              <Route path="/activities_setting" element={uid ? <ActivitySortPage /> : <Navigate replace={true} to='/login' />} />
              <Route path="/activities_setting_details" element={uid ? <ActivityFormPage /> : <Navigate replace={true} to='/login' />} />
              {/* 담임반 관리 */}
              <Route path="/homeroom/:id" element={uid ? <HomeroomDetailsPage /> : <Navigate replace={true} to='/login' />} />
              <Route path="/homeroom/:id/:studentId" element={uid ? <HomeStudentDetailsPage /> : <Navigate replace={true} to='/login' />} />
              <Route path="/homeroom/:id/allStudents" element={uid ? <HomeClassAllStudentsPage /> : <Navigate replace={true} to='/login' />} />
              <Route path="/homeroom/:id/seat" element={uid ? <HomeSeatChange /> : <Navigate replace={true} to='/login' />} />
              {/* 클래스 관리 */}
              <Route path="/classrooms" element={uid ? <ClassroomMainPage /> : <Navigate replace={true} to='/login' />} />
              <Route path="/classrooms/:id" element={uid ? <ClassroomDetailsPage /> : <Navigate replace={true} to='/login' />} />
              <Route path="/classrooms/:id/allstudents" element={uid ? <ClassAllStudentsPage /> : <Navigate replace={true} to='/login' />} />
              <Route path="/classrooms/:id/:studentId" element={uid ? <StudentDetailPage /> : <Navigate replace={true} to='/login' />} />
              {/* 클래스 만들기, 교사 회원만 가능 */}
              <Route path="/classrooms_setting" element={user.isTeacher ? <ClassSortSelection /> : <Navigate replace={true} to='/' />} />
              <Route path="/classrooms_setting_details" element={user.isTeacher ? <ClassroomFormPage /> : <Navigate replace={true} to='/' />} />
              {/* 학생 관리 */}
              {/* 퀴즈 관리 */}
              <Route path="/lab" element={uid ? <Lab /> : <Navigate replace={true} to='/login' />} />
              <Route path="/quiz" element={uid ? <QuizMainPage /> : <Navigate replace={true} to='/login' />} />
              <Route path="/quiz_setting" element={uid ? <QuizFormPage /> : <Navigate replace={true} to='/login' />} />
              <Route path="/activities_setting_quiz" element={uid ? <QuizActiFormPage /> : <Navigate replace={true} to='/login' />} />
              {/* 학교 */}
              <Route path="/myschool" element={uid ? <MySchoolPage /> : <Navigate replace={true} to='/login' />} />
              {/* <Route path="/school" element={uid ? <SchoolMainPage /> : <Navigate replace={true} to='/login' />} /> */}
              <Route path="/store" element={uid ? <ShopMainPage /> : <Navigate replace={true} to='/login' />} />
              {/* 개인 페이지 */}
              <Route path="/individual" element={uid ? <IndividualPage /> : <Navigate replace={true} to='/login' />} />
              {/* 게임 */}
              <Route path="/game_setting" element={uid ? <GameSettingPage /> : <Navigate replace={true} to='/login' />} />
              <Route path="/multiplay" element={uid ? <QuizBattleMultiPage /> : <Navigate replace={true} to='/login' />} />
              {/* 새소식 관리 */}
              <Route path="/news" element={uid ? <WhatsNewPage /> : <Navigate replace={true} to='/' />} />
              {/* 로그인/회원가입 */}
              <Route path="/login" element={!uid ? <LoginPage /> : <Navigate replace={true} to='/' />} />
              <Route path="/login/email" element={!uid ? <EmailSignupPage /> : <Navigate replace={true} to='/' />} />
              {/* 관리자 */}
              <Route path="/master" element={user.isMaster ? <MasterPage /> : <Navigate replace={true} to='/' />} />
              {/* 충전하기 */}
              <Route path="/purchase" element={user.isMaster ? <AmountSelectPage /> : <Navigate replace={true} to='/' />} />
              <Route path="/purchase/widget" element={user.isMaster ? <WidgetCheckoutPage /> : <Navigate replace={true} to='/' />} />
              <Route path="/purchase/success" element={user.isMaster ? <WidgetSuccessPage /> : <Navigate replace={true} to='/' />} />
              <Route path="/purchase/fail" element={user.isMaster ? <PurchaseFailPage /> : <Navigate replace={true} to='/' />} />
            </Routes>
          </Main>
          {uid && <Footer />}
        </AppLayout>
      </BrowserRouter>
    </>
  )
}
export const AppLayout = styled.div`
  min-height: 100dvh;          /* 모바일 주소창 대응: 100vh 대신 100dvh 권장 */
  display: flex;
  flex-direction: column;
`;
export const Main = styled.main`
  flex: 1;                     /* 본문 영역이 남는 높이를 차지 */
`;
export default App;
