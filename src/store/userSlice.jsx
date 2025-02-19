import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {}
let user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      return {
        ...state,           //현재 상태
        ...action.payload   //받아온 정보
      };
    },

    setUserPersonalInfo(state, action) {
      return {
        ...state,
        email: action.payload.email,
        phoneNumber: action.payload.phoneNumber,
        isTeacher: action.payload.isTeacher,
        studentNumber: action.payload.studentNumber,
        profileImg: action.payload.profileImg,
      }
    },
    setClassNewsList(state, action) {
      return {
        ...state,
        classNewsList: action.payload
      }
    },
    setmyPetList(state, action) {
      return {
        ...state,
        myPetList: action.payload
      }
    },
  },
  extraReducers: builder => { //로그아웃 시에 state를 초기화한다.
    builder.addCase(PURGE, () => initialState);
  },
})

export const { setUser, setUserPersonalInfo, setAppliedClassList, setJoinedClassList, setNewsBoxList, setMyHomeworkList, setHomeworkList, setClassNewsList, setmyPetList } = user.actions
export default user