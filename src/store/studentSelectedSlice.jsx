import { createSlice } from "@reduxjs/toolkit"

let studentSelected = createSlice({
  name: 'studentSelected',
  initialState: [],
  reducers: {
    setSelectStudent(state, action) {
      console.log(action.payload)
      let studnetList = action.payload
      return studnetList
    }
  }
})

export let { setSelectStudent } = studentSelected.actions
export default studentSelected