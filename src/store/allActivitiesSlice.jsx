import { createSlice } from "@reduxjs/toolkit";

let allActivities = createSlice({
  name: 'allActivities',
  initialState: [],
  reducers: {
    setAllActivities(state, action) {
      let AllActivities = action.payload
      return AllActivities
    }
  }
})

export let { setAllActivities } = allActivities.actions
export default allActivities