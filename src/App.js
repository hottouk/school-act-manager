//라이브러리
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Helmet } from "react-helmet";
import 'bootstrap/dist/css/bootstrap.min.css';
import { lazy, Suspense } from 'react';
import styled from 'styled-components';
//로그인
import LoginPage from './pages/login/LoginPage';
//필수
import LandingPage from './pages/main/LandingPage';
import Nav from './components/Bar/Nav';
import Footer from './components/Bar/Footer';
import LoadingSpinner from './components/Commons/LoadingSpinner';
//활동 관리
import ActivityMain from './pages/activity/ActivityMain';
import ActivityFormPage from './pages/activity/ActivitityFormPage';
import ActivitySortPage from './pages/activity/ActivitySortPage';
//교과반
import ClassroomMainPage from './pages/classroom/ClassroomMainPage';
import ClassroomDetailsPage from './pages/classroom/ClassroomDetailsPage';
import StudentDetailPage from './pages/classroom/StudentDetailPage';
import KlassAllStudentsPage from './pages/classroom/KlassAllStudentsPage';
import AllStudentByActiPage from './pages/classroom/AllStudentByActiPage';
//담임반
import HomeroomDetailsPage from './pages/homeroom/HomeroomDetailsPage';
import ClassSortSelection from './pages/classSetting/ClassSortSelection';
import ClassroomFormPage from './pages/classSetting/ClassroomFormPage';
import WhatsNewPage from './pages/main/WhatsNewPage';
import MySchoolPage from './pages/school/MySchoolPage';
//관리자
import MasterPage from './pages/main/MasterPage';
import Lab from './pages/lab/Lab';
// import HomeSeatChange from './pages/homeroom/HomeSeatChangePage';
//시험
import ExamMainPage from './pages/exam/ExamMainPage';
import ExamFormPage from './pages/exam/ExamFormPage';
import ExamItemPage from './pages/exam/ExamItemPage';
//결제
import WidgetCheckoutPage from './pages/purchase/WidgetCheckoutPage';
import WidgetSuccessPage from './pages/purchase/WidgetSuccessPage';
import PurchaseFailPage from './pages/purchase/PurchaseFailPage';
import AmountSelectPage from './pages/purchase/AmountSelectPage';
//내정보
import MyInfoPage from './pages/myInfo/MyInfoPage';
import SchoolSignUpPage from './pages/myInfo/SchoolSignUpPage';
//단어 배틀
const QuizActiFormPage = lazy(() => import('./pages/quizBattle/QuizActiFormPage'));
const GameSettingPage = lazy(() => import('./pages/quizBattle/GameSettingPage'));
const QuizBattleMultiPage = lazy(() => import('./pages/quizBattle/QuizBattleMultiPage'));
const QuizFormPage = lazy(() => import('./pages/quizBattle/QuizFormPage'));
const QuizMainPage = lazy(() => import('./pages/quizBattle/QuizMainPage'));
//상점
const ShopMainPage = lazy(() => import('./pages/shop/ShopMainPage'));
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
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={uid ? <LandingPage /> : <Navigate replace={true} to='/login' />} />
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
                <Route path="/homeroom/:id/student" element={uid ? <StudentDetailPage /> : <Navigate replace={true} to='/login' />} />
                <Route path="/homeroom/:id/allStudents" element={uid ? <KlassAllStudentsPage /> : <Navigate replace={true} to='/login' />} />
                <Route path="/homeroom/:id/allstudents/acti" element={uid ? <AllStudentByActiPage /> : <Navigate replace={true} to='/login' />} />
                {/* <Route path="/homeroom/:id/seat" element={uid ? <HomeSeatChange /> : <Navigate replace={true} to='/login' />} /> */}
                {/* 클래스 관리 */}
                <Route path="/classrooms" element={uid ? <ClassroomMainPage /> : <Navigate replace={true} to='/login' />} />
                <Route path="/classrooms/:id" element={uid ? <ClassroomDetailsPage /> : <Navigate replace={true} to='/login' />} />
                <Route path="/classrooms/:id/allstudents" element={uid ? <KlassAllStudentsPage /> : <Navigate replace={true} to='/login' />} />
                <Route path="/classrooms/:id/allstudents/acti" element={uid ? <AllStudentByActiPage /> : <Navigate replace={true} to='/login' />} />
                <Route path="/classrooms/:id/student" element={uid ? <StudentDetailPage /> : <Navigate replace={true} to='/login' />} />
                {/* 클래스 만들기, 교사 회원만 가능 */}
                <Route path="/classrooms_setting" element={user.isTeacher ? <ClassSortSelection /> : <Navigate replace={true} to='/' />} />
                <Route path="/classrooms_setting_details" element={user.isTeacher ? <ClassroomFormPage /> : <Navigate replace={true} to='/' />} />
                {/* 단어 관리 */}
                <Route path="/lab" element={uid ? <Lab /> : <Navigate replace={true} to='/login' />} />
                <Route path="/quiz" element={uid ? <QuizMainPage /> : <Navigate replace={true} to='/login' />} />
                <Route path="/quiz_setting" element={uid ? <QuizFormPage /> : <Navigate replace={true} to='/login' />} />
                <Route path="/activities_setting_quiz" element={uid ? <QuizActiFormPage /> : <Navigate replace={true} to='/login' />} />
                {/* 시험 관리 */}
                <Route path="/exam_setting" element={uid ? <ExamFormPage /> : <Navigate replace={true} to='/login' />} />
                <Route path="/exam" element={uid ? <ExamMainPage /> : <Navigate replace={true} to='/login' />} />
                <Route path="/exam_item" element={uid ? <ExamItemPage /> : <Navigate replace={true} to='/login' />} />
                {/* 학교 */}
                <Route path="/myschool" element={uid ? <MySchoolPage /> : <Navigate replace={true} to='/login' />} />
                {/* <Route path="/school" element={uid ? <SchoolMainPage /> : <Navigate replace={true} to='/login' />} /> */}
                <Route path="/store" element={uid ? <ShopMainPage /> : <Navigate replace={true} to='/login' />} />
                {/* 게임 */}
                <Route path="/game_setting" element={uid ? <GameSettingPage /> : <Navigate replace={true} to='/login' />} />
                <Route path="/multiplay" element={uid ? <QuizBattleMultiPage /> : <Navigate replace={true} to='/login' />} />
                {/* 새소식 관리 */}
                <Route path="/news" element={uid ? <WhatsNewPage /> : <Navigate replace={true} to='/' />} />
                {/* 로그인/회원가입 */}
                <Route path="/login" element={!uid ? <LoginPage /> : <Navigate replace={true} to='/' />} />
                {/* 관리자 */}
                <Route path="/master" element={user.isMaster ? <MasterPage /> : <Navigate replace={true} to='/' />} />
                {/* 충전하기 */}
                <Route path="/purchase" element={user.isTeacher ? <AmountSelectPage /> : <Navigate replace={true} to='/' />} />
                <Route path="/purchase/widget" element={user.isTeacher ? <WidgetCheckoutPage /> : <Navigate replace={true} to='/' />} />
                <Route path="/purchase/success" element={user.isTeacher ? <WidgetSuccessPage /> : <Navigate replace={true} to='/' />} />
                <Route path="/purchase/fail" element={user.isTeacher ? <PurchaseFailPage /> : <Navigate replace={true} to='/' />} />
                {/* 내정보 */}
                <Route path="/myinfo" element={uid ? <MyInfoPage /> : <Navigate replace={true} to='/' />} />
                <Route path="/myinfo/school" element={uid ? <SchoolSignUpPage /> : <Navigate replace={true} to='/' />} />
              </Routes>
            </Suspense>
          </Main>
          {uid && <Footer />}
        </AppLayout>
      </BrowserRouter>
    </>
  )
}
export const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;          /* 모바일 주소창 대응: 100vh 대신 100dvh 권장 */
`;
export const Main = styled.main`
  flex: 1;                     /* 본문 영역이 남는 높이를 차지 */
`;
export default App;
