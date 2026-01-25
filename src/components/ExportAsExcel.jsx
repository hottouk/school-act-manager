//라이브러리
import { useEffect } from 'react';
import xlsx from 'xlsx';
//hooks
import useGetByte from '../hooks/useGetByte';
//img
import ClickableIcon from './Styled/ClickableIcon';
//담임반 버그 수정(251214)
const ExportAsExcel = ({ allStudentList, type, tab }) => {
  const { getByteLengthOfString } = useGetByte();
  const wb = xlsx.utils.book_new();
  useEffect(() => {
    if (!allStudentList || !wb) return;
    const ws = xlsx.utils.json_to_sheet(getXlSheetData());
    xlsx.utils.book_append_sheet(wb, ws, "반별데이터");
  }, [allStudentList, tab])

  //배열파일 엑셀형식로 변환
  const getXlSheetData = () => {
    const data = allStudentList.map((student, index) => {
      const studentNumber = student.studentNumber;
      const name = (student.writtenName || "미등록");
      let record;
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
      return studentInfo;
    })
    return data;
  }
  //버튼 클릭
  const handleBtnClick = () => { xlsx.writeFile(wb, "생기부데이터.xlsx"); };
  return <ClickableIcon onClick={handleBtnClick} />
}
export default ExportAsExcel