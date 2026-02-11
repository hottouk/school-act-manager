import React, { useCallback, useEffect, useState } from 'react'
import xlsx from 'xlsx';
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components';
//컴포넌트
import TwoRadios from '../components/Radio/TwoRadios'
import DotTitle from './Title/DotTitle';
//hooks
import useProcessXlsxData from '../hooks/useProcessXlsxData';
//css
//엑셀 파일 업로드 및 학생 정보 가공(260202)
const ImportExcelFileSection = ({ getData }) => {
  //hooks 
  const { getStudentInfo } = useProcessXlsxData()
  const [selectedFile, setSelectedFile] = useState(null);
  const [isHiSkul, setIsHiSkul] = useState(true); //중학교 고등학교 출석부
  useEffect(() => { if (selectedFile) procesXltoStuInfo(selectedFile) }, [selectedFile, isHiSkul]);
  //1. xl->json->studentInfo로 바꿈.
  const procesXltoStuInfo = (file) => {
    const fileTypeCheck = file ? (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) : null;
    if (fileTypeCheck) { //파일이 xl파일일 떄
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);  //파일을 비동기적으로 읽기 시작; 파일이 성공적으로 읽히면 FileReader 객체의 onload 이벤트가 발생
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const wb = xlsx.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const xlsToJson = xlsx.utils.sheet_to_json(ws, { header: 1 });
        const studentInfo = getStudentInfo(xlsToJson, isHiSkul);
        getData(studentInfo);
        console.log(studentInfo);
      }
    } else {
      alert("엑셀 파일이 아닙니다.");
      getData(null);
    }
  }
  //2-1. 드랍존
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const fileSelectCheck = (file !== undefined)
    if (fileSelectCheck) { //파일이 최소 하나 이상 선택되었을 때
      setSelectedFile(file);
    } else {
      alert("파일이 선택되지 않았습니다.");
      setSelectedFile(null);
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
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    }
  });

  return (<>
    <Row style={{ justifyContent: "space-between" }}>
      <DotTitle title={"학교급"} />
      <TwoRadios name={"roll_book_check"} id={["high", "middle"]} label={["고등학교", "중학교"]} value={isHiSkul} onChange={() => { setIsHiSkul(!isHiSkul) }} />
    </Row>
    <Dropzone {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? <p>이곳에 드랍</p> : <p>클릭 또는 드래그 앤 드랍</p>}
    </Dropzone>
    <Row>
      <p>파일명: {selectedFile && selectedFile.path}</p>
    </Row>
  </>
  )
}
const Row = styled.div`
  display: flex;
`
const Dropzone = styled(Row)`
  width: 100%;
  height: 120px;
  margin: 10px auto;
  padding: 20px;
  border: 2px gray dashed;
  border-radius: 10px;
  color: gray;
  outline: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`
export default ImportExcelFileSection