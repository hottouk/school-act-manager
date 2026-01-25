import styled from "styled-components"

const UpperTab = ({ className, children, value, top, left, onClick, disabled }) => {
  const handleOnClick = () => {
    if (disabled) return;
    onClick();
  }
  return (
    <Container className={className} $tab={value || 1} $top={top || "0"} $left={left || "0"} onClick={handleOnClick} $disabled={disabled}>
      {children || "샘플"}
    </Container >)
}
const Container = styled.p`
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  color: white;
  padding: 5px 15px;
  cursor: ${({ $disabled }) => $disabled ? "auto" : "pointer"};
  &.tab1 {
    background-color: ${({ $tab, $disabled }) => {
    if ($disabled) return " #919294"
    else return ($tab === 1 ? "#3454d1" : "#3454d191");
  }};
  }
  &.tab2 {
    background-color: ${({ $tab, $disabled }) => {
    if ($disabled) return " #919294"
    else return ($tab === 2 ? "#3454d1" : "#3454d191");
  }};
  }
  &.tab3 {
    background-color: ${({ $tab, $disabled }) => {
    if ($disabled) return " #919294"
    else return ($tab === 3 ? "#3454d1" : "#3454d191");
  }};
  }
`

export default UpperTab