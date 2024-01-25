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
        name: action.payload.name,
        email: action.payload.email,
        isTeacher: action.payload.isTeacher,
        school: undefined,
        //학생 전용
        appliedClassList: action.payload.appliedClassList,
        joinedClassList: action.payload.joinedClassList,
        //교사 전용
        appliedStudentClassList: action.payload.appliedStudentClassList
      };
    },
    setAppliedClassList(state, action) {
      return {
        ...state,
        appliedClassList: action.payload
      }
    },
    setNewsBoxList(state, action) {
      return {
        ...state,
        appliedStudentClassList: action.payload
      }
    }
  },
  extraReducers: builder => { //로그아웃 시에 state를 초기화한다.
    builder.addCase(PURGE, () => initialState);
  },
})

export const { setUser, setAppliedClassList, setNewsBoxList } = user.actions
export default user