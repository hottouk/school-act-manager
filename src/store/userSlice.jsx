import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  uid: "",
  name: "",
  email: "",
  isTeacher: undefined,
  school: "",
}

let user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return {
        ...state,
        uid: action.payload.uid,
        name: action.payload.displayName,
        email: action.payload.email,
        isTeacher: undefined,
        school: undefined
      };
    }
  },
  extraReducers: builder => { //로그아웃 시에 state를 초기화한다.
    builder.addCase(PURGE, () => initialState);
  },
})

export const { setUser } = user.actions
export default user