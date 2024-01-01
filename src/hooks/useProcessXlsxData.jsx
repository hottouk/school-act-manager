import useStudent from "./useStudent"

const useProcessXlsxData = () => { //출석부 rawData받아서 json으로 가공
  const { createStudentNumber } = useStudent()
  const classNumberToTwoDigitString = (classNumber) => { //반이 한자리 수이면 0을 붙여 2자리로 만든다.
    let _classNumber = Number(classNumber)
    if (_classNumber < 10) { return `0${(_classNumber).toString()}` }
    else { return (_classNumber).toString() }
  }

  const getStudentInfo = (data) => {
    let studentInfoList
    if (data) {
      const studentRawDataList = data.slice(9, data.length - 3) //학생 정보가 들어있는 부분부터 시작인 새로운 배열 반환
      studentInfoList = studentRawDataList.map((studentRawDataItem) => {
        let grade = studentRawDataItem[2]
        let _class = classNumberToTwoDigitString(studentRawDataItem[5])
        let number = studentRawDataItem[6] - 1
        let writtenName = studentRawDataItem[7]
        let studentNumber = createStudentNumber(number, grade, _class)
        return { studentNumber, writtenName }
      })
    }
    return studentInfoList
  }
  return { getStudentInfo }
}

export default useProcessXlsxData