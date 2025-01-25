//라이브러리
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
//컴포넌트
import MonListItem from './ListItem/MonListItem'

//학생 전용 250126(리펙토링 중..)
const ActivityList = ({ actiList, classInfo }) => {
  const navigate = useNavigate();

  const handleOnClick = (acti) => {
    navigate(`/activities/${acti.id}`)
  }

  return (
    <Container>
      <StyledListContainer>
        {actiList.map((acti) => {
          return (<MonListItem key={acti.id} item={acti} onClick={() => { }} type="acti" />)
        })}
      </StyledListContainer>
    </Container >
  )
}
const Container = styled.div`
  box-sizing: border-box;  
  width: 100%;
  padding: 5px;
  h4 {
    display: flex;
    justify-content: center;
    margin: 10px auto;
  }
`
const StyledListContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  @media screen and (max-width: 767px){
    padding: 0;
  }
`
export default ActivityList