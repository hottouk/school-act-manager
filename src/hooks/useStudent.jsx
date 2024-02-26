
const useStudent = () => {

  //주어진 학년 반에 번호+1에 -> 학번 string 반환
  const createStudentNumber = (number, grade, classNumber) => {
    let studentNumber = 0
    let _number = Number(number) //숫자로 변환
    if (_number + 1 < 10) {
      studentNumber = `${grade}${classNumber}0${(_number + 1).toString()}`
    } else {
      studentNumber = `${grade}${classNumber}${(_number + 1).toString()}`
    }
    return studentNumber
  }

  //학생 obj * 학생 수 -> List 반환
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
    return studentList
  }

  return (
    { makeStudent, createStudentNumber }
  )
}

export default useStudent