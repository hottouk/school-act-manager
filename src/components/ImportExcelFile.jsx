import React, { useCallback } from 'react'
import xlsx from 'xlsx';
import useProcessXlsxData from '../hooks/useProcessXlsxData';
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components';

const ImportExcelFile = (props) => {
  const { getStudentInfo } = useProcessXlsxData() //Raw data 가공
  const onDrop = useCallback((acceptedFiles) => {
    let file = acceptedFiles[0];
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
      } else { window.alert("엑셀 파일이 아닙니다.") }
    } else {
      window.alert("파일이 선택되지 않았습니다.")
    }
  }, [])
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone(
    { onDrop, multiple: false, accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  const selectedFile = acceptedFiles[0]

  return (<>
    <StyledDropzone {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>이곳에 드랍</p> :
          <p>클릭 또는 드래그 앤 드랍</p>
      }
    </StyledDropzone>
    <aside>
      <p>파일명: {selectedFile && selectedFile.path}</p>
    </aside>
  </>
  )
}

const StyledDropzone = styled.div`
  height: 120px;
  margin: 10px auto;
  padding: 20px;
  border-width: 2px;
  border-radius: 10px;
  border-color: #efefef;
  border-style: dashed;
  background-color: #3454d1;
  color: #efefef;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border .24s ease-in-out;
  p {
    margin: 0;
  }
`;


export default ImportExcelFile