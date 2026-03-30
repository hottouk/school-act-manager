import { createSlice } from "@reduxjs/toolkit";

const allActivities = createSlice({
  name: 'allActivities',
  initialState: [],
  reducers: {
    setAllActivities(state, action) {
      const allActiList = action.payload;
      return allActiList;
    },
  }
})

export const { setAllActivities } = allActivities.actions;
export default allActivities;