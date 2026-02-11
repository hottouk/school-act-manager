import useStudent from "./useStudent"
//수정(260211)
const useProcessXlsxData = () => { //출석부 rawData받아서 json으로 가공
  const { createStudentNumber } = useStudent();
  const klassNumberToTwoDigitString = (klassNumber) => { //반이 한자리 수이면 0을 붙여 2자리로 만든다.
    const _klassNumber = Number(klassNumber);
    if (_klassNumber < 10) { return `0${(_klassNumber).toString()}` }
    else { return (_klassNumber).toString() }
  }
  const getStudentInfo = (data, isHi) => {
    if (!data) return;
    if (isHi) { //고등 출석부
      const studentRawDataList = data.slice(9, data.length - 2); //학생 정보가 들어있는 부분부터 시작인 새로운 배열 반환, index로 검색 9번쨰 부터 있음. index -2까지가 학생 끝
      return studentRawDataList.map((rawData) => {
        const grade = rawData[2];
        const klass = klassNumberToTwoDigitString(rawData[5]);
        const number = rawData[6] - 1;
        const writtenName = rawData[7];
        const studentNumber = createStudentNumber(number, grade, klass);
        return { studentNumber, writtenName };
      }).filter(item => item.writtenName !== undefined && item.writtenName !== '');
    } else { //중등 출석부
      const studentRawDataList = data.slice(8, data.length - 3) //index로 검색 9번쨰 부터 있음. index -2까지가 학생 끝
      return studentRawDataList.map((rawData) => {
        const grade = rawData[1];
        const _class = klassNumberToTwoDigitString(rawData[2]);
        const number = rawData[3] - 1;
        const writtenName = rawData[4];
        const studentNumber = createStudentNumber(number, grade, _class);
        return { studentNumber, writtenName };
      }).filter(item => item.writtenName !== undefined && item.writtenName !== '');
    }
  }
  return { getStudentInfo }
}

export default useProcessXlsxData