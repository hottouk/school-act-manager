import React from 'react'

const SubjectSelect = ({ subject, onChange }) => {
  return (
    <select id="act_subject" required value={subject} onChange={(event) => { onChange(event.target.value) }} >
      <option value="default" disabled >과목을 선택하세요</option>
      <option value="국어">국어과</option>
      <option value="영어">영어과</option>
      <option value="수학">수학과</option>
      <option value="사회">사회과</option>
      <option value="과학">과학과</option>
      <option value="예체능">음,미,체</option>
      <option value="제2외국어">제2외국어과</option>
      <option value="정보">정보</option>
    </select>
  )
}

export default SubjectSelect