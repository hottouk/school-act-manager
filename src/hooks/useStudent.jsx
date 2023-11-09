
const useStudent = () => {

  //학년 반에 따라 학번을 만든다.
  const createStudentNumber = (n, grade, classNumber) => {
    let studentNumber = 0
    let number = Number(n)
    if (number + 1 < 10) {
      studentNumber = `${grade}${classNumber}0${(number + 1).toString()}`
    } else {
      studentNumber = `${grade}${classNumber}${(number + 1).toString()}`
    }
    return studentNumber
  }

  //전달받은 학생의 수 만큼 학생 개체를 만들어 반환한다.
  const makeStudent = (numberOfStudent, grade, classNumber) => {
    let studentList = []

    for (let i = 0; i < numberOfStudent; i++) {
      //todo 이동반일 경우 학번을 미리 생성하지 않는다.
      let studentIdNumber = createStudentNumber(i, grade, classNumber)
      //학생 데이터 
      const studentInfo = {
        studentNumber: studentIdNumber
      }
      studentList.push(studentInfo)
    }

    //test code
    // console.log('학생list', studentList)
    return studentList
  }

  return (
    { makeStudent, createStudentNumber }
  )
}

export default useStudent