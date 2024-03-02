import { createSlice } from "@reduxjs/toolkit";

let classSelected = createSlice({
  name: "classSelected",
  initialState: null,
  reducers: {
    setSelectClass(state, action) {
      const selectedClass = action.payload
      return selectedClass
    },
    
    setAppliedStudentList(state, action) {
      return {
        ...state,
        appliedStudentList: action.payload
      }
    }
  },
})

export const { setSelectClass, setAppliedStudentList } = classSelected.actions;
export default classSelected