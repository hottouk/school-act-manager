import React, { useCallback, useEffect, useState } from 'react'
import xlsx from 'xlsx';
import { useDropzone } from 'react-dropzone'
//컴포넌트
import TwoRadios from '../components/Radio/TwoRadios'
//hooks
import useProcessXlsxData from '../hooks/useProcessXlsxData';
//css
import styled from 'styled-components';

const ImportExcelFile = (props) => {
  //hooks 
  const { getStudentInfo } = useProcessXlsxData()
  const [selectedFile, setSelectedFile] = useState(null);
  const [isHiSkul, setIsHiSkul] = useState(true); //중학교 고등학교 출석부
  useEffect(() => { if (selectedFile) procesXltoStuInfo(selectedFile) }, [selectedFile, isHiSkul])

  //1. xl->json->studentInfo로 바꿈.
  const procesXltoStuInfo = (file) => {
    let fileTypeCheck = file ? (file.name.endsWith('xlsx') || file.name.endsWith('xls')) : null;
    if (fileTypeCheck) { //파일이 xl파일일 떄
      let reader = new FileReader();
      reader.readAsArrayBuffer(file);  //파일을 비동기적으로 읽기 시작; 파일이 성공적으로 읽히면 FileReader 객체의 onload 이벤트가 발생
      reader.onload = (event) => {
        let data = new Uint8Array(event.target.result);
        let wb = xlsx.read(data, { type: 'array' });
        let ws = wb.Sheets[wb.SheetNames[0]];
        let xlsToJson = xlsx.utils.sheet_to_json(ws, { header: 1 });
        let studentInfo = getStudentInfo(xlsToJson, isHiSkul)
        props.getData(studentInfo);
        console.log(studentInfo);
      }
      console.log(file);
    } else {
      window.alert("엑셀 파일이 아닙니다.")
      props.getData(null);
    }
  }

  //2-1. 드랍존
  const onDrop = useCallback((acceptedFiles) => {
    let file = acceptedFiles[0];
    let fileSelectCheck = (file !== undefined)
    if (fileSelectCheck) { //파일이 최소 하나 이상 선택되었을 때
      setSelectedFile(file)
    } else {
      window.alert("파일이 선택되지 않았습니다.")
      setSelectedFile(null)
    }
  }, [isHiSkul])

  //2-2 드랍존
  const onDropRejected = useCallback((fileRejections) => {
    fileRejections.forEach((file) => {
      console.error(`Rejected file: ${file.file.name}, reason: ${file.errors.map(e => e.message).join(', ')}`);
    });
  }, []);

  //2-3 드랍존
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    accept: '.xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' // MIME 타입 및 파일 확장자 함께 지정
  });

  return (<>
    <TwoRadios name={"roll_book_check"} id={["high", "middle"]} label={["고등학교", "중학교"]} value={isHiSkul} onChange={() => { setIsHiSkul(!isHiSkul) }} />
    <StyledDropzone {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? <p>이곳에 드랍</p> : <p>클릭 또는 드래그 앤 드랍</p>}
    </StyledDropzone>
    <StyledDiv>
      <p>파일명: {selectedFile && selectedFile.path}</p>
    </StyledDiv>
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
`
const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    margin: 0;
  }
  p { width: 70%; }
`
export default ImportExcelFile