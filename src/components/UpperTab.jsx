import styled from "styled-components"

const UpperTab = ({ className, children, value, top, left, onClick }) => {
  return (
    <Container className={className} $tab={value || 1} $top={top || "0"} $left={left || "0"} onClick={onClick}>
      {children}
    </Container >)
}

const Container = styled.p`
  position: absolute;
  top: ${(props) => props.$top};
  left: ${(props) => props.$left};
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  background-color: #3454d1;
  color: white;
  padding: 5px 15px;
  &.tab1 {
    background-color: ${(props) => { return (props.$tab === 1 ? "#3454d1" : "#919294") }};
    cursor: pointer;
  }
  &.tab2 {
    background-color: ${(props) => { return (props.$tab === 2 ? "#3454d1" : "#919294") }};
    cursor: pointer;
  }
  &.tab3 {
    background-color: ${(props) => { return (props.$tab === 3 ? "#3454d1" : "#919294") }};
    cursor: pointer;
  }
`

export default UpperTab