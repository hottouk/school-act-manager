import { configureStore } from '@reduxjs/toolkit'
import studentSelected from './studentSelectedSlice'
import activitySelected from './activitySelectedSlice'


export default configureStore({
  reducer: {
    studentSelected: studentSelected.reducer,
    activitySelected: activitySelected.reducer
  }
})