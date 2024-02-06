import styled from "styled-components"

//24.01.09
const ScoreWrapper = (props) => {
  return (
    <StyledScoreWrapper>
      <div className="scores">
        <div>
          <label htmlFor="act_leadership">리더십</label>
          <input id="act_leadership" type="number" min="0" max="8"
            value={props.leadershipScore} onChange={props.handleChange}></input>
        </div>
        <div>
          <label htmlFor="act_career">진로</label>
          <input id="act_career" type="number" min="0" max="8"
            value={props.careerScore} onChange={props.handleChange}></input>
        </div>
        <div>
          <label htmlFor="act_sincerity">학업</label>
          <input id="act_sincerity" type="number" min="0" max="8"
            value={props.sincerityScore} onChange={props.handleChange}></input>
        </div>
        <div>
          <label htmlFor="act_coop">협동성</label>
          <input id="act_coop" type="number" min="0" max="8"
            value={props.coopScore} onChange={props.handleChange}></input>
        </div>
        <div>
          <label htmlFor="act_attitude">태도</label>
          <input id="act_attitude" type="number" min="0" max="8"
            value={props.attitudeScore} onChange={props.handleChange}></input>
        </div>
      </div>
      <div className="money">
        <label htmlFor="act_coin">리아</label>
        <input id="act_coin" type="number" min="0" max="100"
          value={props.coin} onChange={props.handleChange}></input>
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
    margin-top: 5px;
  }
  label {
    font-size: 14px;
  }
  @media screen and (max-width: 767px){
    margin: 35px auto;
    input {
      width: 57px;
      height: 40px;
      margin-top: 5px;
    }
  }
`
export default ScoreWrapper
