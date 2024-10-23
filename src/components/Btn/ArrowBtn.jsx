import styled from 'styled-components'
//2024.10.16 생성
const ArrowBtn = ({ deg, onClick, cursor }) => {
  // 예시 <ArrowBtn deg={"315 or 135"} />
  deg = deg || 315;
  cursor = cursor || "none";
  return <StyledArrowBtn $deg={deg} $cursor={cursor} onClick={onClick} />
}
const StyledArrowBtn = styled.button`
  width: 25px;
  height: 25px;
  border: 10px solid #333;
  border-left: 0;
  border-top: 0;
  transform: rotate(${(props) => { return props.$deg }}deg);
  cursor: ${(props) => { return props.$cursor }};
  &:hover {
    border-color: orange;
    transform: rotate(${(props) => { return props.$deg }}deg) scale(1.3);
    z-index: 1;
  }
  opacity: 0.8;
  @media screen and (max-width: 767px){
    display: none;
  }
`
export default ArrowBtn

