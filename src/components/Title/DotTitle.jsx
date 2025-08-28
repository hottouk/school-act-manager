import styled from 'styled-components'

const DotTitle = ({ title, pointer, onClick, styles }) => {
  //기본값
  let dotColor = styles?.dotColor || "#3454d1";
  let width = styles?.width || "30%";
  let fontWeight = styles?.fontWeight || "bold"
  // 샘플1 <DotTitle title={"수행 문구 ▼"} onClick={() => { setIsPerfRecShown((prev) => !prev) }} pointer="pointer" />
  // 샘플2
  // <DotTitle title={"학업 역량 ▼"} onClick={() => { setIsAcadShown((prev) => !prev) }} pointer="pointer"
  //               styles={{ dotColor: "black", width: "50%" }} />
  //포인터 쓰려면 pointer="pointer" 적용하기
  return (
    <StyledTitle onClick={onClick || null}
      $width={width}
      $fontWeight={fontWeight}
      $pointer={pointer}
      $dotColor={dotColor || "white"}
    > {title || "샘플"}</StyledTitle >
  )
}

const StyledTitle = styled.p`
  position: relative;
  display: flex;
  align-items: center;
  width: ${(props) => props.$width};
  font-weight: ${(props) => props.$fontWeight};
  padding: 0 20px;  /* 텍스트가 동그라미와 겹치지 않도록 왼쪽 여백 추가 */
  margin: 0;
  cursor: ${(props) => props.$pointer};
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 20px;
    background-color: ${(props) => { return props.$dotColor }};  /* 동그라미 색상 */
    border-radius: 2px;
  }
`

export default DotTitle