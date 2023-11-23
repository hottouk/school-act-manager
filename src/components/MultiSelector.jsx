import Select from 'react-select'
import styles from './MultiSelector.module.css'

//변수 관련
import { useDispatch } from 'react-redux'
import { setSelectStudent } from '../store/studentSelectedSlice'
import { setSelectActivity } from '../store/activitySelectedSlice'

const MultiSelector = ({ studentList, activitiyList, selectStudentRef, selectActRef }) => {
  let dispatcher = useDispatch() //redux dispatcher

  const handleStudentSelection = (event) => { //event는 선택값의 배열 반환
    dispatcher(setSelectStudent(event))
  }

  const handleActivitySelection = (event) => { //event는 선택값의 배열 반환
    dispatcher(setSelectActivity(event))
  }

  // 백엔드에서 데이터 수만큼 받아서 멀티 셀렉터 만들기
  let options = []
  if (studentList) {
    studentList.map((item) => {
      return (
        options.push({ value: item.id, label: item.studentNumber })
      )
    })
  }

  if (activitiyList) {
    activitiyList.map((item) => {
      return (
        options.push({ value: item.id, label: item.title, uid: item.uid, record: item.record, content: item.content })
      )
    })
  }

  return ( //학생List, ActivityList냐에 따라 다른 종류의 셀렉터를 리턴한다.
    <>
      {(studentList) ?
        <Select className={styles.mutli_selector}
          ref={selectStudentRef}
          isMulti
          onChange={(event) => { handleStudentSelection(event) }}
          options={options}
          placeholder='학번을 선택해주세요.'
        /> : (activitiyList) ? <Select className={styles.mutli_selector}
          ref={selectActRef}
          isMulti
          onChange={(event) => { handleActivitySelection(event) }}
          options={options}
          placeholder='활동을 선택해주세요.'
        /> : null}
    </>
  )
}

export default MultiSelector
