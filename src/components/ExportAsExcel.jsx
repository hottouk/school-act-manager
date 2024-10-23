//라이브러리
import xlsx from 'xlsx';
//전역 변수
import { useSelector } from 'react-redux';
//hooks
import useGetByte from '../hooks/useGetByte';
//img
import styled from 'styled-components';
import excelIcon from '../image/icon/excel.png';

const ExportAsExcel = ({ type }) => {
  //전역 변수(새로고침하면 초기화)
  const allStudentList = useSelector(({ allStudents }) => { return allStudents }) //ClassRoomDetail에서 저장한 학생List 불러오기(전역)
  //hooks
  const { getByteLengthOfString } = useGetByte()

  //데이터 담은 배열
  let data = allStudentList.map((student, index) => {
    let studentNumber = student.studentNumber;
    let name = (student.writtenName || "미등록");
    let record
    if (type === "home") { record = student.behaviorOpinion || "기록 없음" }
    else { record = student.accRecord || "기록 없음" }
    let bytes = ((record !== "기록 없음") ? getByteLengthOfString(record) : 0);
    let studentInfo = {
      number: index + 1,
      studentNumber: studentNumber,
      name: name,
      accRecord: record,
      Byte: bytes,
    }
    return studentInfo; //studentInfo를 다 담은 obj을 반환한다.
  })

  //배열파일 엑셀로 변환
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(wb, ws, "반별데이터");

  //버튼 클릭
  const handleBtnClick = () => {
    xlsx.writeFile(wb, "생기부데이터.xlsx");
  }
  return (
    <StyledExcelImgBtn src={excelIcon} alt='엑셀아이콘' onClick={handleBtnClick} />
  )
}

const StyledExcelImgBtn = styled.img`
  width: 45px;
  height: 45px;
  margin-top: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    background-color: #3454d1;
    border: none;
    border-radius: 10px;
    transition: background-color 0.5s ease-in-out;
  }
`
export default ExportAsExcel