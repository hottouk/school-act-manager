import { createSlice } from "@reduxjs/toolkit"

let allStudents = createSlice({
  name: 'allStudents',
  initialState: [],
  reducers: {
    setAllStudents(state, action) {
      const allStudents = action.payload
      return state = allStudents
    },
 
    setModifiedStudent(state, action) { //state는 전역변수 현재 상태
      const { key, accRecord, writtenName } = action.payload
      let selectedStudent = state.filter(student => student.id === key)       //선택 된 학생 추출하여 새로운 배열 생성
      let unSelected = state.filter(student => student.id !== key)            //선택되지 않은 학생만 추출하여 새로운 배열 생성
      let modifiedStudent = { ...selectedStudent[0], accRecord, writtenName } //새롭게 학생 정보 수정
      unSelected.push(modifiedStudent)                                        
      return unSelected.sort((a, b) => a.studentNumber.localeCompare(b.studentNumber)) //학번으로 오름차순 정렬
    }
  }
})

export const { setAllStudents, setModifiedStudent } = allStudents.actions
export default allStudents