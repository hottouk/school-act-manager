//컴포넌트
import ActivityForm from './ActivitityForm'

//CSS
import styled from 'styled-components'

const StyledGirdContainer = styled.main`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 0 30px;
  margin: 60px auto;
`
const StyledCenteredItem = styled.div`
  grid-column-start: 2;
  grid-column-end: 5;
`

const ActivityDetails = () => {
  return (
    <StyledGirdContainer>
      <StyledCenteredItem>
        <ActivityForm/>
      </StyledCenteredItem>
    </StyledGirdContainer>
  )
}

export default ActivityDetails