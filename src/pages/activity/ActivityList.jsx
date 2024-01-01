//컴포넌트
import ScoreCollertor from '../../components/ScoreCollertor'

//CSS
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import useGetByte from '../../hooks/useGetByte'

const StyledUl = styled.ul`
  width: 95%;
  margin : 0 auto;
  li {
    position: relative;
    box-shadow: 3px 3px 5px rgba(50, 50, 50, .1);
    margin: 0 auto;
    padding: 20px;
    background-color: whitesmoke;
    border-left: 8px teal solid;
    box-sizing : border-box;
  }
  li + li{
    margin-top: 10px;
  };
`
const StyeldTitle = styled.strong`
  display: block;
  margin: 10px;
  font-size: larger;
  color: black;
`
const ActivityList = ({ activities }) => {
  //경로 이동 변수
  const navigate = useNavigate()

  //바이트 계산 함수
  const { getByteLengthOfString } = useGetByte()

  //개별 아이템 클릭 함수
  const handleItemClick = (item) => {
    let activityId = item.id
    navigate(`/activities/${activityId}`, { state: item })
  }

  return (
    <StyledUl>
      {activities.map((item) => {
        let scores = item.scores
        let bytes = getByteLengthOfString(item.record)
        return (
          <li key={item.id} onClick={() => { handleItemClick(item) }}>
            <StyeldTitle>{item.title}</StyeldTitle>
            <p>{item.content}</p>
            {!scores ? <ScoreCollertor leadership={0} career={0} sincerity={0} coop={0} attitude={0} byte={bytes} /> :
              <ScoreCollertor
                leadership={scores.leadership} career={scores.careerScore} sincerity={scores.sincerityScore} coop={scores.coopScore} attitude={scores.attitudeScore} byte={bytes} />}
          </li>
        )
      })}
    </StyledUl>
  )
}

export default ActivityList