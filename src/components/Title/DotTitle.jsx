import styled from 'styled-components'

const DotTitle = ({ title, pointer, onClick }) => {
  //포인터 쓰려면 pointer="pointer" 적용하기
  return (
    <StyledTitle onClick={onClick || null} $pointer={pointer} > {title || "샘플"}</StyledTitle >
  )
}

const StyledTitle = styled.p`
  position: relative;
  display: flex;
  align-items: center;
  width: 30%;
  font-weight: bold;
  padding: 0 20px;  /* 텍스트가 동그라미와 겹치지 않도록 왼쪽 여백 추가 */
  margin-bottom: 10px;
  cursor: ${(props) => { return props.$pointer }};
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 20px;
    background-color: white;  /* 동그라미 색상 */
    border-radius: 2px;
  }
`

export default DotTitle