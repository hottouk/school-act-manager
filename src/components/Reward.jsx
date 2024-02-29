import styled from "styled-components"
//이미지
import eggBlue from "../image/myPet/egg_b.png";
import eggGreen from "../image/myPet/egg_g.png";
import eggYellow from "../image/myPet/egg_y.png";
import moneyImg from "../image/money.png";
import sincerImg from "../image/icon/s_sin_icon.png"
import carImg from "../image/icon/s_car_icon.png"
import leadImg from "../image/icon/s_lead_icon.png"
import coopImg from "../image/icon/s_coop_icon.png"
import attImg from "../image/icon/s_att_icon.png"
import { useEffect, useState } from "react";

const Reward = ({ rewards }) => { 
  const [_money, setMoney] = useState(null)
  const [_sincerity, setSincerity] = useState(null)
  const [_leadership, setLeadership] = useState(null)
  const [_attitude, setAttitude] = useState(null)
  const [_coop, setCoop] = useState(null)
  const [_career, setCareer] = useState(null)
  const [_rewardImg, setRewardImg] = useState(null)
  const [_rewardTitle, setRewardTitle] = useState('')
  const [_rewardExplanation, setRewardExplanation] = useState('')
  useEffect(() => {
    switch (rewards.type) {
      case "class":
        switch (rewards.subject) {
          case "영어":
            setRewardImg(eggBlue)
            setRewardTitle("찬란한 푸른 알")
            setRewardExplanation("푸른 물의 기운을 머금은 알이다. 영어 활동에 밀접하게 반응한다. 어떤 아이가 깨어날지는 알 수 없다.")
            break;
          case "수학":
            setRewardImg(eggGreen)
            break;
          case "국어":
            setRewardImg(eggYellow)
            break;
          default: return;
        }
        break;
      case "homework":
        if (rewards.money > 0) {
          setMoney(rewards.money)
        }
        let scoreList = Object.entries(rewards.scores).filter((item) => { return item[1] > 0 })
        scoreList.map((scoreItem) => {
          switch (scoreItem[0]) {
            case "leadership":
              setLeadership(scoreItem[1])
              break;
            case "sincerityScore":
              setSincerity(scoreItem[1])
              break;
            case "coopScore":
              setCoop(scoreItem[1])
              break;
            case "careerScore":
              setCareer(scoreItem[1])
              break;
            case "attitudeScore":
              setAttitude(scoreItem[1])
              break;
            default:
          }
          setRewardTitle("전리품")
          setRewardExplanation("각 보상을 클릭해보세요")
          return null
        })
        console.log(scoreList)
        break;
      default: return;
    }
  }, [rewards])

  const handleOnClick = (event) => {
    switch (event.target.id) {
      case "money_btn":
        setRewardTitle(`${_money} 리라 획득`)
        setRewardExplanation("녹색 마정석을 원료로 중앙 정부에서 고용한 S급 장인들이 가공하여 만든 화폐다. 대륙 전체 경제활동에 쓰인다.")
        break;
      case "sin_btn":
        setRewardTitle(`학업이 ${_sincerity}만큼 증가`)
        setRewardExplanation("현실에서의 학업 능력은 이 세계에서 원소 친화력으로 치환된다. 원소 친화력이 높을수록 더 많은 원소의 정령들과 유대감을 쌓을 수 있다. 혹시 몰라? 정령왕들의 힘도 빌릴 수 있을지?")
        break;
      case "lead_btn":
        setRewardTitle(`리더십이 ${_leadership}만큼 증가`)
        setRewardExplanation("현실에서의 리더십은 이 세계에서 무력으로 치환된다. 예로부터 강한 힘은 언제나 숭배의 대상이었다. 강한 자 곁에는 늘 많은 사람이 모이기 마련이다.")
        break;
      case "coop_btn":
        setRewardTitle(`협동성이 ${_sincerity}만큼 증가`)
        setRewardExplanation("현실에서의 협동성은 이 세계에서 원소 저항력으로 치환된다. '정령이니 마법이니, 그런 것들에 의존하는 자들은 결국 뒤통수를 치기 마련이지, 세계 정부는 인간의 협동으로 세워진 것이다!!' 롤리아 대륙 3대 철혈 재상 밀라프의 말 중 ")
        break;
      case "att_btn":
        setRewardTitle(`태도가 ${_sincerity}만큼 증가`)
        setRewardExplanation("현실에서의 태도는 이 세계에서 방어력으로 치환된다. 바른 정신과 올곧은 태도 앞엔 칼도 마법도 통하지 않는다.")
        break;
      case "car_btn":
        setRewardTitle(`진로활동이 ${_sincerity}만큼 증가`)
        setRewardExplanation("현실에서의 진로활동은 이 세계에서 정비력으로 치환된다. 이 세계가 유지되기 위해선 무력과 원소친화력 외에도 많은 능력이 필요하다. '난 왜 사람들이 검술과 원소술만 파는지 모르겠다니까? 리라 나올 구석은 이렇게나 많은데 말이지, 성연그룹 창업자 강건의 말 중'")
        break;
      default: ;
    }
  }

  return (
    <StyledRewardContainer>
      <h3>보상</h3>
      {rewards.type === "homework" && <div className="img_container">
        {_money && <div className="img_wrapper"><img id="money_btn" src={moneyImg} alt="리라" onClick={handleOnClick} /></div>}
        {_sincerity && <div className="img_wrapper"><img id="sin_btn" src={sincerImg} alt="학업" onClick={handleOnClick} /></div>}
        {_leadership && <div className="img_wrapper"><img id="lead_btn" src={leadImg} alt="리더십" onClick={handleOnClick} /></div>}
        {_coop && <div className="img_wrapper"><img id="coop_btn" src={coopImg} alt="협동" onClick={handleOnClick} /></div>}
        {_attitude && <div className="img_wrapper"><img id="att_btn" src={attImg} alt="태도" onClick={handleOnClick} /></div>}
        {_career && <div className="img_wrapper"><img id="car_btn" src={carImg} alt="진로" onClick={handleOnClick} /></div>}
      </div>}
      {rewards.type === "class" && <div className="img_container">
        <div className="img_wrapper"><img src={_rewardImg} alt="영어알" /></div>
      </div>}
      <h5 className="title">{_rewardTitle}</h5>
      <div className="reward_explain">
        <p>{_rewardExplanation}</p>
      </div>
    </StyledRewardContainer>
  )
}

const StyledRewardContainer = styled.div`
  width: 100%;
  background-color: #efefef;
  margin: 0 auto;
  position: relative;
  border: 1px solid #efefef;
  border-radius: 15px;
  padding: 15px;
  margin: 10px auto 5px;
  .img_container {
    display: flex;
    justify-content: flex-start;
    overflow-x: scroll;
    gap: 12px;
  }
  .img_wrapper {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    padding: 10px;
    border-radius: 15px;
    background-color: #ffd000;
    box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
    img {
      width: 80px;
      height: 80px;
      cursor:pointer;
    }
  }
  h5.title {
    font-weight: 600;
    text-align: center;
    margin: 10px auto;
  }
  div.reward_explain {
    padding: 5px;
    background-color: white;
    border-radius: 5px;
  }
`

export default Reward