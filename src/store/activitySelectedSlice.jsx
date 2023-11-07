import { createSlice } from "@reduxjs/toolkit"

let activitySelected = createSlice({
  name: 'activitySelected',
  initialState: [],
  reducers: {
    setSelectActivity(state, action) {
      let activityList = action.payload
      return [activityList]
    }
  }
})

export let { setSelectActivity } = activitySelected.actions
export default activitySelected