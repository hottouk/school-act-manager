import React, { useRef } from 'react'
import Select from 'react-select'
//css
import styled from 'styled-components'

//2024.09.10(생성)
const GptPersonalRow = ({ itemObj, onInputChange, }) => {
  const inputRef = useRef('')
  const propTitle = itemObj.prop
  let optionList = []
  itemObj.wordList.map((keyword) => {
    optionList.push({ label: keyword, value: keyword, id: propTitle })
    return null
  })
  
  return (
    <Container>
      {propTitle !== "희망 직군[학과]" ? <Select
        styles={{
          control: (baseStyles, state) => (
            {
              ...baseStyles,
              width: "200px",
              height: "50px"
            }),
        }}
        onChange={(event) => {
          inputRef.current.value = event.value
          onInputChange(event, "select")
        }}
        options={optionList}
        placeholder={propTitle} /> : <p>희망 직군[학과]</p>}

      <input type="text" ref={inputRef} onChange={(event) => { onInputChange(event, "input") }} id={propTitle} />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  p { 
    width: 200px;
    text-align: center;
    margin: 0;
    padding: 10px;
    border: 1px solid black;
    border-radius: 5px;
  }
  input {
    width: 55%;
    height: 35px;
    border-radius: 10px;
  }
`
export default GptPersonalRow