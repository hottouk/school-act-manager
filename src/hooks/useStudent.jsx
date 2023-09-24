
const useStudent = () => {

  //전달받은 학생의 수 만큼 학생 개체를 만들어 반환한다.
  const makeStudent = (n) => {
    let studentList = []
    for (let i = 0; i < n; i++) {
      
      //학생 데이터 여기서 설정한다.
      const studentInfo = { 
        studentId: i
      }
      studentList.push(studentInfo)
    }

    //test code
    // console.log('학생list', studentList)
    return studentList
  }

  return (
    { makeStudent }
  )
}

export default useStudent