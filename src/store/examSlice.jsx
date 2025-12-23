import { createSlice } from "@reduxjs/toolkit";

const initialState = {};
const exam = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setExamQuestionList(state, action) {
      return {
        ...state,           //현재 상태
        ...action.payload   //받아온 정보
      };
    },
  },
})

export const { setExamQuestionList } = exam.actions;
export default exam;