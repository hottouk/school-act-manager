import styled from "styled-components"
//생성(240109)
const ScoresSection = ({ scores, handleOnChange, disabled }) => {
  const { leadership = 0, coop = 0, study = 1, research = 0, attitude = 0, career = 0, } = scores || {};
  return (
    <Container>
      <Row>
        <div>
          <label htmlFor="leadership">리더십 <i className="fa-solid fa-hand-fist"></i></label>
          <ScoreInput id="leadership" type="number" min="0" max="10" disabled={disabled}
            value={leadership} onChange={handleOnChange}></ScoreInput>
        </div>
        <div>
          <label htmlFor="coop">협동 <i className="fa-solid fa-gears"></i></label>
          <ScoreInput id="coop" type="number" min="0" max="10" disabled={disabled}
            value={coop} onChange={handleOnChange}></ScoreInput>
        </div>
        <div>
          <label htmlFor="study">학업 <i className="fa-solid fa-bolt"></i></label>
          <ScoreInput id="study" type="number" min="1" max="10" disabled={disabled}
            value={study} onChange={handleOnChange}></ScoreInput>
        </div>
        <div>
          <label htmlFor="research">탐구 <i className="fa-solid fa-hat-wizard"></i></label>
          <ScoreInput id="research" type="number" min="0" max="10" disabled={disabled}
            value={research} onChange={handleOnChange}></ScoreInput>
        </div>
        <div>
          <label htmlFor="attitude">태도 <i className="fa-solid fa-shield-halved"></i></label>
          <ScoreInput id="attitude" type="number" min="0" max="10" disabled={disabled}
            value={attitude} onChange={handleOnChange}></ScoreInput>
        </div>
        <div>
          <label htmlFor="career">진로 <i className="fa-solid fa-coins"></i></label>
          <ScoreInput id="career" type="number" min="0" max="10" disabled={disabled}
            value={career || 0} onChange={handleOnChange}></ScoreInput>
        </div>
      </Row>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  text-align: center;
  color: black;
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
const ScoreInput = styled.input`
  width: 60px;
  height: 40px;
  margin: 5px 2px;
  border: none;
  border-radius: 15px;
  background-color: white;
  text-align: center;
  &:disabled {
    background-color: #ddd;
  } 
`
const Row = styled.div`
  display: flex;
`
export default ScoresSection
