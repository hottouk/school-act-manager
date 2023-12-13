import { configureStore } from '@reduxjs/toolkit'
import studentSelected from './studentSelectedSlice'
import activitySelected from './activitySelectedSlice'


export default configureStore({ //전역 변수 내보내기
  reducer: {
    studentSelected: studentSelected.reducer, //선택 학생
    activitySelected: activitySelected.reducer //선택 활동
  }
})