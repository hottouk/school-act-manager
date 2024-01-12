import { createSlice } from '@reduxjs/toolkit'

const pageEndSignifier = createSlice({
  name: 'pageEndSignifier',
  initialState: false,
  reducers: {
    setEndSignal(state, action) {
      const endSignal = action.payload
      return endSignal
    }
  }
})

export const { setEndSignal } = pageEndSignifier.actions;
export default pageEndSignifier