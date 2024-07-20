import { createSlice } from "@reduxjs/toolkit";

let allActivities = createSlice({
  name: 'allActivities',
  initialState: [],
  reducers: {
    setAllActivities(state, action) {
      let allActiList = action.payload
      return allActiList
    }
  }
})

export let { setAllActivities } = allActivities.actions
export default allActivities