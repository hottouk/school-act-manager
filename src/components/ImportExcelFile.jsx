import React from 'react'
import xlsx from 'xlsx';
import useProcessXlsxData from '../hooks/useProcessXlsxData';

const ImportExcelFile = (props) => {
  const { getStudentInfo } = useProcessXlsxData() //Raw data 가공

  const handleXlsUpload = (event) => {
    let file = event.target.files[0];
    let fileSelectCheck = (file !== undefined)
    if (fileSelectCheck) { //파일이 최소 하나 이상 선택되었을 때
      let fileTypeCheck = (file.name.endsWith('xlsx'))
      if (fileTypeCheck) { //파일이 엑셀파일일 떄
        let reader = new FileReader();
        reader.onload = (event) => {
          const data = new Uint8Array(event.target.result);
          const wb = xlsx.read(data, { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const xlsToJson = xlsx.utils.sheet_to_json(ws, { header: 1 });
          const studentInfo = getStudentInfo(xlsToJson)
          props.getData(studentInfo);
        }
        reader.readAsArrayBuffer(file);
      } else { console.error("엑셀 파일이 아닙니다.") }
    } else {
      console.error("파일이 선택되지 않았습니다.")
    }
  };

  return (
    <input type="file" onChange={handleXlsUpload} />
  )
}

export default ImportExcelFile