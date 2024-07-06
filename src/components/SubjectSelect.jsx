import subjects from "../subjects"

const SubjectSelect = ({ subject, onChange }) => {
  return (
    <select id="act_subject" required value={subject} onChange={(event) => { onChange(event.target.value) }} >
      <option value="default" disabled >과목을 선택하세요</option>
      {subjects.map((subject) => {
        return <option value={subject}>{subject}과</option>
      })} 
    </select>
  )
}

export default SubjectSelect