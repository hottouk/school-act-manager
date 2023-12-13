import styled from 'styled-components';

const StyledScoreWrapper = styled.div`
  max-width: 500px;
  min-width: 400px;
  margin : 20px auto;
  text-align : center;
`
const StyledDiv = styled.div`
  display: inline-block;
  width: 55px;
  height: 55px;
  border: 1px solid black;
`
const StyledLabelDiv = styled.div`
  padding: 2px;
  border-bottom: 1px solid black;
  background-color: teal;
  color: white;
`

const ScoreCollertor = (props) => {
  return (
    <StyledScoreWrapper>
      <StyledDiv>
        <StyledLabelDiv>리더십</StyledLabelDiv>
        <p>{props.leadership}</p>
      </StyledDiv>
      <StyledDiv>
        <StyledLabelDiv>진로</StyledLabelDiv>
        <p>{props.career}</p>
      </StyledDiv>
      <StyledDiv>
        <StyledLabelDiv>성실성</StyledLabelDiv>
        <p>{props.sincerity}</p>
      </StyledDiv>
      <StyledDiv>
        <StyledLabelDiv>협동성</StyledLabelDiv>
        <p>{props.coop}</p>
      </StyledDiv>
      <StyledDiv>
        <StyledLabelDiv>태도</StyledLabelDiv>
        <p>{props.attitude}</p>
      </StyledDiv>
      <StyledDiv>
        <StyledLabelDiv>Byte</StyledLabelDiv>
        <p>{props.byte}</p>
      </StyledDiv>
    </StyledScoreWrapper>
  )
}

export default ScoreCollertor