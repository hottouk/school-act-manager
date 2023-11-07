import { createSlice } from "@reduxjs/toolkit"

let studentSelected = createSlice({
  name: 'studentSelected',
  initialState: [],
  reducers: {
    setSelectStudent(state, action) {
      let studnetList = action.payload
      return [studnetList]
    }
  }
})

export let { setSelectStudent } = studentSelected.actions
export default studentSelected