import styled from "styled-components"

//24.01.09
const ScoreWrapper = (props) => {
  return (
    <StyledScoreWrapper>
      <div className="scores">
        <div>
          <label htmlFor="act_leadership">리더십</label>
          <input id="act_leadership" type="number" value={props.leadershipScore} onChange={props.handleChange}></input>
        </div>
        <div>
          <label htmlFor="act_career">진로</label>
          <input id="act_career" type="number" value={props.careerScore} onChange={props.handleChange}></input>
        </div>
        <div>
          <label htmlFor="act_sincerity">성실성</label>
          <input id="act_sincerity" type="number" value={props.sincerityScore} onChange={props.handleChange}></input>
        </div>
        <div>
          <label htmlFor="act_coop">협동성</label>
          <input id="act_coop" type="number" value={props.coopScore} onChange={props.handleChange}></input>
        </div>
        <div>
          <label htmlFor="act_attitude">태도</label>
          <input id="act_attitudes" type="number" value={props.attitudeScore} onChange={props.handleChange}></input>
        </div>
      </div>
      <div className="money">
        <label htmlFor="act_attitude">리아</label>
        <input id="act_coin" type="number" value={props.coin} onChange={props.handleChange}></input>
      </div>
    </StyledScoreWrapper>
  )
}

const StyledScoreWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 20px auto;
  text-align: center;
  div {
    color: #efefef;
    display: inline-block;
    background-color: #00a86b;
  }
  input {
    width: 72px;
    height: 30px;
    margin-top: 7px;
  }
`
export default ScoreWrapper
