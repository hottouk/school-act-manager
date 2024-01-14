import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uid: "",
  name: "",
  email: "",
  isTeacher: undefined,
  school: "",
}

let tempUser = createSlice({
  name: 'tempUser',
  initialState,
  reducers: {
    setTempUser(state, action) {
      return {
        ...state,
        uid: action.payload.uid,
        name: action.payload.name,
        email: action.payload.email,
        isTeacher: undefined,
        school: undefined
      };
    }
  }
})

export const { setTempUser } = tempUser.actions
export default tempUser