import { createSlice } from "@reduxjs/toolkit";

let classSelected = createSlice({
  name: 'classSelected',
  initialState: null,
  reducers: {
    setSelectClass(state, action) {
      const selectedClass = action.payload
      return selectedClass
    },
  },
})

export const { setSelectClass } = classSelected.actions;
export default classSelected