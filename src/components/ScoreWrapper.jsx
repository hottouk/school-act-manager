import { Helmet } from "react-helmet"
import styled from "styled-components"

//24.01.09
const ScoreWrapper = ({ leadershipScore, careerScore, sincerityScore, coopScore, attitudeScore, coin, handleChange, disabled }) => {
  return (
    <Container>
      <Helmet>
        {/*폰트어썸 라이브러리*/}
        <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer" />
      </Helmet>
      <FlexWrapper>
        <div>
          <label htmlFor="act_leadership">리더십 <i className="fa-solid fa-hand-fist"></i></label>
          <input id="act_leadership" type="number" min="0" max="8" disabled={disabled}
            value={leadershipScore} onChange={handleChange}></input>
        </div>
        <div>
          <label htmlFor="act_career">진로 <i className="fa-solid fa-gears"></i></label>
          <input id="act_career" type="number" min="0" max="8" disabled={disabled}
            value={careerScore} onChange={handleChange}></input>
        </div>
        <div>
          <label htmlFor="act_sincerity">학업 <i className="fa-solid fa-bolt"></i></label>
          <input id="act_sincerity" type="number" min="1" max="8" disabled={disabled}
            value={sincerityScore} onChange={handleChange}></input>
        </div>
        <div>
          <label htmlFor="act_coop">협동성 <i className="fa-solid fa-hat-wizard"></i></label>
          <input id="act_coop" type="number" min="0" max="8" disabled={disabled}
            value={coopScore} onChange={handleChange}></input>
        </div>
        <div>
          <label htmlFor="act_attitude">태도 <i className="fa-solid fa-shield-halved"></i></label>
          <input id="act_attitude" type="number" min="0" max="8" disabled={disabled}
            value={attitudeScore} onChange={handleChange}></input>
        </div>
      </FlexWrapper>
      <div className="money">
        <label htmlFor="act_coin">리아 <i className="fa-solid fa-coins"></i></label>
        <input id="act_coin" type="number" min="0" max="100" disabled={disabled}
          value={coin || 0} onChange={handleChange}></input>
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  text-align: center;
  color: black;
  input {
    width: 60px;
    height: 40px;
    margin: 5px 2px;
    border: none;
    border-radius: 15px;
    background-color: white;
    text-align: center;
  }
  label {
    font-size: 14px;
  }
  @media screen and (max-width: 767px){
    margin: 35px auto;
    input {
      width: 53px;
      height: 40px;
      margin-top: 5px;
    }
  }
`
const FlexWrapper = styled.div`
  display: flex;
  
`
export default ScoreWrapper
