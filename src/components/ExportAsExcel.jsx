//라이브러리
import { useEffect } from 'react';
import xlsx from 'xlsx';
//hooks
import useGetByte from '../hooks/useGetByte';
//img
import ClickableIcon from './Styled/ClickableIcon';
//담임반 버그 수정(251214) -> 수정(260228)
const ExportAsExcel = ({ title, allStudentList, type, semester, tab, getAccRec }) => {
  const { getByteLengthOfString } = useGetByte();
  const wb = xlsx.utils.book_new();
  useEffect(() => {
    if (!allStudentList || !wb) return;
    //배열파일 엑셀형식로 변환
    const getXlSheetData = () => {
      const data = allStudentList.map((student, index) => {
        const { studentNumber, writtenName, firstList, secondList, thirdList } = student || {};
        let record;
        if (type === "homeroom") {
          //담임
          if (tab === 1) record = getAccRec(firstList) || ''
          if (tab === 2) record = getAccRec(secondList) || ''
          if (tab === 3) record = getAccRec(thirdList) || ''
        }
        else {
          //교과
          if (semester === 1) record = getAccRec(firstList) || ''
          if (semester === 2) record = getAccRec(secondList) || ''
        }
        const bytes = (record ? getByteLengthOfString(record) : 0);
        const studentInfo = {
          number: index + 1,
          studentNumber: studentNumber,
          name: writtenName || "미등록",
          accRecord: record,
          Byte: bytes,
        }
        return studentInfo;
      })
      return data;
    }
    const ws = xlsx.utils.json_to_sheet(getXlSheetData());
    xlsx.utils.book_append_sheet(wb, ws, "반별데이터");
  }, [allStudentList, tab, semester]);
  
  //버튼 클릭
  const handleBtnClick = () => {
    xlsx.writeFile(wb, `${title} 생기부 엑셀파일.xlsx`);
  };

  return <ClickableIcon onClick={handleBtnClick} title={"엑셀 다운로드"} />
}
export default ExportAsExcel