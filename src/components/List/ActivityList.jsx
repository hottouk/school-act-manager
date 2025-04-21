//라이브러리
import styled from 'styled-components'
//컴포넌트
import MonListItem from './ListItem/SquareListItem'

//리펙토링(250126)
const ActivityList = ({ actiList, setIsActiInfoModal, setActiInfo }) => {

  const handleOnClick = (acti) => {
    setActiInfo(acti)
    setIsActiInfoModal(true)
  }

  return (
    <Container>
      {actiList.filter((item) => {
        const isPrivate = item.isPrivate;
        return isPrivate === false;
      }).map((acti) => {
        return (<MonListItem key={acti.id} item={acti} onClick={() => { handleOnClick(acti) }} type="acti" />)
      })}
    </Container >
  )
}
const Container = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 5px 16px;
  list-style: none;
  @media screen and (max-width: 767px){
    padding: 0;
  }
`

export default ActivityList