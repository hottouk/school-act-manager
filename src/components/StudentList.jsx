const StudentList = ({ students }) => {

  return (
    <>
      {students.map((item) => {
        return (
          <li key={item.id}>
            <p id="student_number">{item.studentNumber}</p>
          </li>
        )
      })}
    </>
  )
}

export default StudentList