import { createSlice } from "@reduxjs/toolkit";

let teacherClasses = createSlice({
  name: "teacherClass",
  initialState: [],
  reducers: {
    setTeacherClasses(state, action) {
      let setTeacherClasses = action.payload
      return setTeacherClasses
    }
  }
})

export const { setTeacherClasses } = teacherClasses.actions;
export default teacherClasses