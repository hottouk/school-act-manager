import styled from "styled-components"
//이미지
import eggBlue from "../image/myPet/egg_b.png";
import eggGreen from "../image/myPet/egg_g.png";
import eggYellow from "../image/myPet/egg_y.png";
import moneyImg from "../image/money.png"
import { useEffect, useState } from "react";

const Reward = ({ reward, quest, money, scores, complete }) => { //quest는 떼버리기
  const [_rewardImg, setRewardImg] = useState(null)
  const [_rewardTitle, setRewardTitle] = useState('')
  const [_rewardExplanation, setRewardExplanation] = useState('')
  console.log(scores)
  useEffect(() => {
    switch (reward) {
      case "eng":
        setRewardImg(eggBlue)
        setRewardTitle("찬란한 푸른 알")
        setRewardExplanation("푸른 물의 기운을 머금은 알이다. 영어 활동에 밀접하게 반응한다. 어떤 아이가 깨어날지는 알 수 없다.")
        break;
      case "math":
        setRewardImg(eggGreen)
        break;
      case "kor":
        setRewardImg(eggYellow)
        break;
      case "homework":
        setRewardImg(moneyImg)
        setRewardTitle("리라")
        setRewardExplanation(`호롤리아 대륙에서 발견된 녹색 마정석을 중앙 조정이 가공하여 만든 화폐다. 대륙 전체 경제활동에 쓰인다.`)
        break;
      default: return;
    }
  }, [reward])

  return (
    <StyledRewardContainer>
      <h3>보상</h3>
      {quest && <p>달성 조건: {quest}</p>}
      {complete && <p>{_rewardTitle}을(를) 획득하였습니다.</p>}
      <div className="img_wrapper">
        <img src={_rewardImg} alt="보상 이미지" />
      </div>
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
  div.img_wrapper {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    padding: 10px;
    border-radius: 15px;
    background-color: #ffd000;
    box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
    display: flex;
    justify-content: center;
    img {
      width: 80px;
      height: 80px;
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