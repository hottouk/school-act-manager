import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {}

let user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      return {
        ...state, //현재 상태
        uid: action.payload.uid,
        name: action.payload.name,
        email: action.payload.email,
        isTeacher: action.payload.isTeacher,
        phoneNumber: action.payload.phoneNumber,
        profileImg: action.payload.profileImg,
        school: action.payload.school,
        //학생 전용
        studentNumber: action.payload.studentNumber,
          //교실 가입        
        appliedClassList: action.payload.appliedClassList,
        joinedClassList: action.payload.joinedClassList,
        myPetList: action.payload.myPetList,
          //과제
        myActList: action.payload.myActList,
        myHomeworkList: action.payload.myHomeworkList,
        myDoneActList: action.payload.myDoneActList,
        classNewsList: action.payload.classNewsList,
        //교사 전용
        appliedStudentClassList: action.payload.appliedStudentClassList,
        homeworkList: action.payload.homeworkList
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

    setAppliedClassList(state, action) {
      return {
        ...state,
        appliedClassList: action.payload
      }
    },

    setJoinedClassList(state, action) {
      return {
        ...state,
        joinedClassList: action.payload
      }
    },

    setClassNewsList(state, action) {
      return {
        ...state,
        classNewsList: action.payload
      }
    },

    setNewsBoxList(state, action) {
      return {
        ...state,
        appliedStudentClassList: action.payload
      }
    },

    setmyPetList(state, action) {
      return {
        ...state,
        myPetList: action.payload
      }
    },

    setMyActList(state, action) {
      return {
        ...state,
        myActList: action.payload
      }
    },

    setMyHomeworkList(state, action) { //학생용
      return {
        ...state,
        myHomeworkList: action.payload
      }
    },

    setHomeworkList(state, action) {
      return {
        ...state,
        homeworkList: action.payload
      }
    }
  },
  extraReducers: builder => { //로그아웃 시에 state를 초기화한다.
    builder.addCase(PURGE, () => initialState);
  },
})

export const { setUser, setUserPersonalInfo, setAppliedClassList, setJoinedClassList, setNewsBoxList, setMyActList, setMyHomeworkList, setHomeworkList, setClassNewsList, setmyPetList } = user.actions
export default user