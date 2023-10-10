import Select from 'react-select'
import styles from './MultiSelector.module.css'
import Async, { useAsync } from 'react-select/async';
import AsyncSelect from 'react-select/async';
import { useState } from 'react'

const MultiSelector = ({ studentList, activitiyList }) => {
  const [selected, setSelected] = useState('')
  const handleSelection = (event) => {
    setSelected(event)
  }

  // 백엔드에서 학생 수만큼 받아서 멀티 셀렉터 만들기
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
        options.push({ value: item.id, label: item.title })
      )
    })
  }

  return (
    <Select className={styles.mutli_selector}
      isMulti
      onChange={handleSelection}
      options={options}
      placeholder='학번을 선택해주세요.'
    />)
}

export default MultiSelector