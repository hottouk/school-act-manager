//라이브러리
import xlsx from 'xlsx';
//hooks
import useGetByte from '../hooks/useGetByte';
//img
import styled from 'styled-components';
import excelIcon from '../image/icon/excel.png';
import { useEffect } from 'react';

const ExportAsExcel = ({ allStudentList, type }) => {
  const { getByteLengthOfString } = useGetByte();
  const wb = xlsx.utils.book_new();
  useEffect(() => {
    if (!allStudentList || !wb) return
    const ws = xlsx.utils.json_to_sheet(getXlSheetData());
    xlsx.utils.book_append_sheet(wb, ws, "반별데이터");
  }, [allStudentList])

  //배열파일 엑셀형식로 변환
  const getXlSheetData = () => {
    const data = allStudentList.map((student, index) => {
      const studentNumber = student.studentNumber;
      const name = (student.writtenName || "미등록");
      let record
      if (type === "home") { record = student.behaviorOpinion || "기록 없음" }
      else { record = student.accRecord || "기록 없음" }
      const bytes = ((record !== "기록 없음") ? getByteLengthOfString(record) : 0);
      const studentInfo = {
        number: index + 1,
        studentNumber: studentNumber,
        name: name,
        accRecord: record,
        Byte: bytes,
      }
      return studentInfo
    })
    return data
  }

  //버튼 클릭
  const handleBtnClick = () => { xlsx.writeFile(wb, "생기부데이터.xlsx"); }
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
    background-color: rgba(49, 84, 209, 0.4);
    border: none;
    border-radius: 10px;
    transition: background-color 0.5s ease-in-out;
  }
`
export default ExportAsExcel