import Select from 'react-select'
//변수 관련
import { useDispatch } from 'react-redux'
import { setSelectStudent } from '../store/studentSelectedSlice'
import { setSelectActivity } from '../store/activitySelectedSlice'
let MultiSelector = (
  { studentList, activitiyList, selectStudentRef, selectActRef, studentCheckBoxRef, actCheckBoxRef, isAllStudentChecked, isAllActivitySelected, setIsAllStudentChecked, setIsAllActivitySelected }) => {
  //1. 변수
  let dispatcher = useDispatch() //redux dispatcher

  //2. 함수
  const handleCheckboxOnChange = (event) => {
    switch (event.target.id) {
      case 'allStudent_checkbox':
        let studentChecked = event.target.checked
        selectStudentRef.current.clearValue()  //표면적 선택 초기화
        if (studentChecked) {
          dispatcher(setSelectStudent(studentList.map((student) => {
            return ({ value: student.id, label: student.studentNumber })
          })))                          //모든 학생 선택  
          setIsAllStudentChecked(true)  //선택 창 비활성화
        } else {
          dispatcher(setSelectStudent([]))
          setIsAllStudentChecked(false)
        }
        break;
      case 'allAct_checkbox':
        let activityChecked = event.target.checked
        selectActRef.current.clearValue()
        if (activityChecked) {
          dispatcher(setSelectActivity(activitiyList.map((act) => {
            return ({ value: act.id, label: act.title, uid: act.uid, record: act.record, content: act.content })
          })))
          setIsAllActivitySelected(true)
        } else {
          dispatcher(setSelectActivity([]))
          setIsAllActivitySelected(false)
        }
        break;
      default: return;
    }
  }

  const handleStudentSelection = (event) => { //event는 선택값의 배열 반환
    dispatcher(setSelectStudent(event))
  }

  const handleActivitySelection = (event) => {
    dispatcher(setSelectActivity(event))
  }

  // 백엔드에서 데이터 수만큼 받아서 멀티 셀렉터 옵션 만들기
  let options = []
  if (studentList) {
    studentList.map((student) => {
      let name = '미등록'
      let number = student.studentNumber
      if (student.writtenName) { name = student.writtenName }
      return (options.push({ value: student.id, label: `${number} ${name}` }))
    })
  }

  if (activitiyList) {
    activitiyList.map((act) => {
      return (options.push({ value: act.id, label: act.title, uid: act.uid, record: act.record, content: act.content }))
    })
  }

  return ( //학생List or ActivityList냐에 따라 다른 종류의 셀렉터를 리턴한다.
    <>
      {(studentList) ?
        <div>
          <Select isMulti
            ref={selectStudentRef}
            onChange={(event) => { handleStudentSelection(event) }}
            options={options}
            placeholder='학번을 선택해주세요.'
            isDisabled={isAllStudentChecked} />
          <input type="checkbox" id="allStudent_checkbox" ref={studentCheckBoxRef}
            onChange={(event) => { handleCheckboxOnChange(event) }}
          />
          <label htmlFor="allStudent_checkbox">모든 학생</label>
        </div>
        : (activitiyList) ?
          <div>
            <Select isMulti
              ref={selectActRef}
              onChange={(event) => { handleActivitySelection(event) }}
              options={options}
              placeholder='활동을 선택해주세요.'
              isDisabled={isAllActivitySelected} />
            <input type="checkbox" id="allAct_checkbox" ref={actCheckBoxRef}
              onChange={(event) => { handleCheckboxOnChange(event) }} />
            <label htmlFor="allAct_checkbox">모든 활동</label>
          </div> : null}
    </>
  )
}

export default MultiSelector
