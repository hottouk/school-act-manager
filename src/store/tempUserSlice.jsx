import { createSlice } from "@reduxjs/toolkit";

const initialState = {}

let tempUser = createSlice({
  name: "tempUser",
  initialState,
  reducers: {
    setTempUser(state, action) {
      return {
        ...state,
        uid: action.payload.uid,
        name: action.payload.name,
        email: action.payload.email,
        profileImg: action.payload.profileImg,
        customToken: action.payload.customToken,
      };
    }
  }
})

export const { setTempUser } = tempUser.actions
export default tempUser