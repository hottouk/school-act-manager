import styled from 'styled-components'

const LongW100Btn = ({ id, btnColor, btnOnClick, btnName, type, border }) => {
  return (
    <StyledLongW100Btn id={id} type={type || "button"} onClick={btnOnClick}
      $backgroundColor={btnColor || "transparent"}
      $border={border || "3px solid #949192"}>
      {btnName || "샘플"}</StyledLongW100Btn>
  )
}

const StyledLongW100Btn = styled.button`
  display: inline;
  width: 100%;
  padding: 10px 15px;
  border-radius: 15px;
  border: ${(props) => props.$border};
  background-color: ${(props) => props.$backgroundColor};
  color: black;
  transition: background-color 0.3s ease;
  &: hover {
    background-color: rgba(52, 84, 209, 0.5);
  }
`
export default LongW100Btn