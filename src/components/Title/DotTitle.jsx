import styled from 'styled-components'

const DotTitle = ({ title, pointer, onClick, styles }) => {
  //기본값
  let dotColor = "white";
  let width = "30%";
  let marginBot = "10px";
  if (styles) {
    width = styles.width ? styles.width : width
    dotColor = styles.dotColor ? styles.dotColor : dotColor
    marginBot = styles.marginBot ? styles.marginBot : marginBot
  }
  // 샘플1 <DotTitle title={"수행 문구 ▼"} onClick={() => { setIsPerfRecShown((prev) => !prev) }} pointer="pointer" />
  // 샘플2
  // <DotTitle title={"학업 역량 ▼"} onClick={() => { setIsAcadShown((prev) => !prev) }} pointer="pointer"
  //               styles={{ dotColor: "black", width: "50%" }} />
  //포인터 쓰려면 pointer="pointer" 적용하기
  return (
    <StyledTitle onClick={onClick || null}
      $width={width}
      $pointer={pointer}
      $dotColor={dotColor || "white"}
      $marginBot={marginBot}
    > {title || "샘플"}</StyledTitle >
  )
}

const StyledTitle = styled.p`
  position: relative;
  display: flex;
  align-items: center;
  width: ${(props) => { return props.$width }};
  font-weight: bold;
  padding: 0 20px;  /* 텍스트가 동그라미와 겹치지 않도록 왼쪽 여백 추가 */
  margin-bottom: ${(props) => { return props.$marginBot }};
  cursor: ${(props) => { return props.$pointer }};
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