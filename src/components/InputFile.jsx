import React from 'react'
import styled from 'styled-components'

const InputFile = (props) => {
  return (
    <StyledInputDiv>
      <label className="input_file_btn" htmlFor="input_file_btn">파일 첨부</label>
      <p>{props.fileName}</p>
      <input type="file" id="input_file_btn" onChange={props.handleOnChange} style={{ display: "none" }} />
    </StyledInputDiv>
  )
}

const StyledInputDiv = styled.div`
  marign: 8px auto;
  color: #efefef;
  display: flex;
  background-color: transparent;
  label.input_file_btn {
    border-radius: 15px;
    border: 2px solid #efefef;
    padding: 3px;
  }
  p {
    flex-grow: 2;
    display: inline-block;
    margin: 0 0 0 20px;
    background-color: #efefef;
    color: black;
    width: 90px;
  }
  
  @media screen and (max-width: 767px){
    margin-top: 20px;
  }
  
`
export default InputFile