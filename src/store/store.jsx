import { combineReducers, configureStore } from '@reduxjs/toolkit'
//변수 파일
import studentSelected from './studentSelectedSlice'
import activitySelected from './activitySelectedSlice'
import classSelected from './classSelectedSlice';
import allStudents from './allStudentsSlice'
import allActivities from './allActivitiesSlice';
import user from './userSlice';
//리덕스 persist
import { persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session'
import tempUser from './tempUserSlice';

const reducers = combineReducers(
  {
    studentSelected: studentSelected.reducer, //선택 학생
    activitySelected: activitySelected.reducer, //선택 활동
    classSelected: classSelected.reducer, //선택 반
    allStudents: allStudents.reducer, //반 전체 학생
    allActivities: allActivities.reducer, //전체 활동
    user: user.reducer,
    tempUser: tempUser.reducer,
  }
)

const persistConfig = {
  key: "root",
  storage: storageSession,  // 세션Storage에 저장합니다. 브라우져 종료하면 재로그인이 필요함.
  whiteList: ['allStudents', 'user', 'classSelected'], //계속 저장해둘 값
  blacksList: ['studentSelected', 'activitySelected', 'tempUser'], //휘발성 값
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({ //전역 변수 내보내기
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
  devTools: true,  // 기본 값이 true지만 배포할때 코드를 숨기기 위해서 false로 변환하기 쉽게 설정에 넣어놨다.
})