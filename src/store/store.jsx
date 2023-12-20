import { configureStore } from '@reduxjs/toolkit'
import studentSelected from './studentSelectedSlice'
import activitySelected from './activitySelectedSlice'
import allStudents from './allStudentsSlice'


export default configureStore({ //전역 변수 내보내기
  reducer: {
    studentSelected: studentSelected.reducer, //선택 학생
    activitySelected: activitySelected.reducer, //선택 활동
    allStudents: allStudents.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
  devTools: true,  // 기본 값이 true지만 배포할때 코드를 숨기기 위해서 false로 변환하기 쉽게 설정에 넣어놨다.
})