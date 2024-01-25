import crying_cat from '../image/cat.png'
import styled from 'styled-components'

//24.01.24
const EmptyResult = (props) => {
  return (
    <StyledEmptyClassRoomDiv>
      <img src={crying_cat} alt="우는고양이" />
      <p>{props.comment}</p>
    </StyledEmptyClassRoomDiv>
  )
}

const StyledEmptyClassRoomDiv = styled.div`
  max-width: 540px;
  margin: 60px auto 10px;
  padding: 30px 20px 0;
  border-radius: 15px;
  img {
    display: block;
    width: 160px;
    margin: 0 auto;
    filter: blur(1px) grayscale(50%);
  }
  p {
    text-align: center;
    color: gray;
  }
  @media screen and (max-width: 767px) {
    margin: 0 auto 50px;
  }
`
export default EmptyResult