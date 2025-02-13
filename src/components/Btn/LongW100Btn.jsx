import styled from 'styled-components'

const LongW100Btn = ({ id, btnName, type, btnOnClick, styles }) => {
  //기본값
  let btnColor = styles?.btnColor || "transparent";
  let border = styles?.border || "2px solid rgba(120, 120, 120, 0.5)";
  let color = styles?.color || "black";
  let hoverBtnColor = styles?.hoverBtnColor || "rgba(52, 84, 209, 0.5)";

  return (
    <StyledButton id={id} type={type || "button"} onClick={btnOnClick}
      $backgroundColor={btnColor}
      $border={border}
      $color={color}
      $hoverBtnColor={hoverBtnColor}
    >
      {btnName || "샘플"}</StyledButton>
  )
}

const StyledButton = styled.button`
  display: inline;
  width: 100%;
  padding: 10px 15px;
  border-radius: 15px;
  border: ${(props) => props.$border};
  background-color: ${(props) => props.$backgroundColor};
  color:  ${(props) => props.$color};
  transition: background-color 0.3s ease;
  &: hover {
    background-color: ${(props) => props.$hoverBtnColor}
  }
`
export default LongW100Btn