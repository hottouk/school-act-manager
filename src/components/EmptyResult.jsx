import crying_cat from '../image/cat.png'
import styled from 'styled-components'

//24.01.24
const EmptyResult = ({ comment, color, styles }) => {
  let border = styles?.border || "none";
  let maxWidth = styles?.maxWidth || "540px";

  return (
    <Container $color={color} $border={border} $maxWidth={maxWidth}>
      <img src={crying_cat} alt="우는고양이" />
      <p>{comment}</p>
    </Container>
  )
}

const Container = styled.div`
  max-width: ${(props) => props.$maxWidth};
  margin: 12px auto;
  border: ${(props) => props.$border};
  border-radius: 10px;
  img {
    display: block;
    width: 160px;
    margin: 0 auto;
    filter: blur(1px) grayscale(50%);
  }
  p {
    text-align: center;
    color: ${({ $color }) => { return $color ? $color : "gray" }};
    margin: 0;
  }
  @media screen and (max-width: 767px) {
    margin: 0 auto 50px;
  }
`
export default EmptyResult