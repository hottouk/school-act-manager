import React from 'react'
import styled from 'styled-components'

const ImagePicker = ({ children, src, onClick, styles }) => {
  const backgroundColor = styles?.backgroundColor || "#efefef"
  return (
    <StyledImgPicker src={src} alt='펫몬 이미지' onClick={onClick} style={{ backgroundColor: backgroundColor }}>
      {children}
    </StyledImgPicker>
  )
}
const StyledImgPicker = styled.img`
  width: 100px;
  height: 100px;
  padding: 5px;
  border-radius: 20px;
  border: 1px solid black;
  cursor: pointer;
`

export default ImagePicker
