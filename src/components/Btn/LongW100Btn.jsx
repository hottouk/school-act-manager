import styled from 'styled-components'
//리모델(260209)
const LongW100Btn = ({ id, btnName, type, btnOnClick, styles, children, onClick }) => {
  //기본값
  const btnColor = styles?.btnColor || "transparent";
  const border = styles?.border || "2px solid rgba(120, 120, 120, 0.5)";
  const color = styles?.color || "black";
  const hoverBtnColor = styles?.hoverBtnColor || "rgba(52, 84, 209, 0.5)";
  return (
    <StyledButton id={id} type={type || "button"} onClick={btnOnClick || onClick}
      $backgroundColor={btnColor}
      $border={border}
      $color={color}
      $hoverBtnColor={hoverBtnColor}
    >
      {children || btnName || "샘플"}</StyledButton>
  )
}
const StyledButton = styled.button`
  display: inline;
  width: 100%;
  padding: 10px 15px;
  border-radius: 10px;
  border: ${(props) => props.$border};
  background-color: ${(props) => props.$backgroundColor};
  color:  ${(props) => props.$color};
  transition: background-color 0.3s ease;
  &: hover {
    background-color: ${(props) => props.$hoverBtnColor}
  }
`
export default LongW100Btn