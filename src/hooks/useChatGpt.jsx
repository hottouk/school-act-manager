import OpenAI from 'openai'
import { useState } from 'react'
import useGetByte from './useGetByte'

//24.07.06 수정(바이트 변수 입력)
const useChatGpt = () => {
  const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true })
  const [gptAnswer, setGptAnswer] = useState('');
  const [gptBytes, setGptBytes] = useState(0);
  const [gptRes, setGptRes] = useState(null);
  const { getByteLengthOfString } = useGetByte();
  const askChatGpt = async (title, subject, content, byte) => {
    setGptRes('loading')
    if (byte <= 180) { byte = 180 }
    let messages = [
      { role: "system", content: `당신은 학생의 ${subject} 과목 세부 능력 특기사항을 쓰는 교사임. ${title} 활동에서 학생이 할 수 있는 활동을 예상하여 적고 그 활동이 학생에게 미친 영향을 3자의 입장에서 객관적으로 적어야 함. '~을 배움, ~을 느낌, ~뿌듯함.'등 의 학생의 주관이 나타나는 1인칭 시점의 서술어는 금지임. 모든 문장을 '~음', '~했음', '~임', '~함' 과 같이 개조식으로 작성해야 함. ` },
      { role: "user", content: "여행지 소개하기 활동을 수행한 학생이 받을 생기부 세특 예시를 작성해 주세요." },
      { role: "assistant", content: "여행지 소개하기 활동에서 가보고 싶은 해외 도시로 LA를 선정하여, 그 지역 명소인 테마파크의 실제 리뷰를 해외 사이트에서 찾아, 이를 바탕으로 여행지를 소개하는 글을 작성하였고 구체적인 여행 계획을 세움. 이 활동을 통해 실제 인터넷에서 쓰이는 표현에 대해 알 수 있었다고 보고서를 작성하였고 여행 중 마주칠 수 있는 상황에 대한 문제 해결력을 증명함. " },
      { role: "user", content: "영어로 토론하기 활동을 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
      { role: "assistant", content: "영어로 토론하기 활동에서 '집값을 낮추어야 출산률이 반등한다' 라는 주장을 근거를 들어 피력함. 청중에게 시선을 골고루 맞추고 인상적인 제스처와 통계를 활용하여 건설적인 토의를 진행함. 토의를 진행하며 반대 의견에 반박하는 방법, 타인을 설득하는 방법, 건설적인 합의를 도출해내는 등의 성과가 있었다고 기술함." },
      { role: "user", content: "읽기 1회 활동은 수업시간에 자발적으로 손을 들어 주어진 지문을 읽는 활동이에요. 읽기 1회를 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
      { role: "assistant", content: "수업시간에 자발적으로 손을 들어 명쾌한 발음과 자연스러운 억양으로 주어진 지문을 1회 읽음." },
      { role: "user", content: "발표3회 활동은 수업시간에 영어 지문을 3회 해석하며 발표한 활동이에요. 발표3회를 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
      { role: "assistant", content: "다양한 영역의 지문을 섭렵하여 조사하여 설명함으로 본인의 뛰어난 융, 복합적 문해 능력을 증명함. 수업시간에 성실하게 참여하는 적극성이 돋보이는 학생임." },
      { role: "user", content: "영어 멘토 활동을 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
      { role: "assistant", content: "한 학기 동안 멘토로 활동하며 동료 학생들에게 영어 학습에 관한 조언과 도움을 주며, 개별 학습 계획을 돕는 역할을 수행함. 영어 멘토로서의 리더십과 소통 능력을 발휘하여 다른 학생들의 영어 실력 향상에 도움을 줌." },
      { role: "user", content: `${title}활동을 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요.` },
      content ? { role: "user", content: `${title}활동을 수행한 학생의 생기부에 적을 예시 문구를 대략 ${byte}byte 정도로 작성해 주세요.` } : { role: "user", content: `${title}활동에 대한 설명입니다: ${content}. 이 활동을 수행한 학생의 과세특에 적을 예시 문구를 대략 ${byte}byte 정도로 작성해 주세요.` }
    ]

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
    });

    if (completion.choices[0].message.content) {
      setGptAnswer(completion.choices[0].message.content)
      setGptBytes(getByteLengthOfString(completion.choices[0].message.content))
      setGptRes('complete')
    } else {
      window.alert('챗GPT 서버 문제로 문구를 입력할 수 없습니다.')
      setGptRes('complete')
    }
  }

  return { gptAnswer, askChatGpt, gptBytes, gptRes }
}

export default useChatGpt