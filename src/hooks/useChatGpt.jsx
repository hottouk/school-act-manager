import OpenAI from 'openai'
import { useState } from 'react'

const useChatGpt = () => {
  const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true })
  const [gptAnswer, setGptAnswer] = useState('')
  const [gptRes, setGptRes] = useState(null)
  const askChatGpt = async (title, subject, content) => {
    setGptRes('loading')
    let messages
    if (content === '') {
      messages = [
        { role: "system", content: `당신은 학생의 ${subject} 과목 세부 능력 특기사항을 쓰는 교사입니다. 모든 문장을 개조식으로 작성해야 합니다.` },
        { role: "user", content: "여행지 소개하기 활동을 수행한 학생이 받을 생기부 세특 예시를 작성해 주세요." },
        { role: "assistant", content: "여행해보고 싶은 해외의 도시로 LA를 선정하여, 그 지역 명소인 디즈니랜드의 실제 리뷰를 해외 사이트에서 찾아, 이를 바탕으로 여행지를 소개하는 글을 작성하였고 구체적인 여행 계획을 세움." },
        { role: "user", content: "영어로 토론하기 활동을 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
        { role: "assistant", content: "영어로 토론하기 활동에서 '집값을 낮추어야 출산률이 반등한다' 라는 본인의 주장을 근거를 들어 토론을 진행함. 청중에게 시선을 골고루 맞추고 인상적인 제스처와 통계를 활용하여 건설적인 토의를 진행함." },
        { role: "user", content: "읽기 1회 활동은 수업시간에 자발적으로 손을 들어 주어진 지문을 읽는 활동이에요. 읽기 1회를 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
        { role: "assistant", content: "수업시간에 자발적으로 손을 들어 명쾌한 발음과 자연스러운 억양으로 주어진 지문을 1회 읽음." },
        { role: "user", content: "발표3회 활동은 수업시간에 영어 지문을 3회 해석하며 발표한 활동이에요. 발표3회를 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
        { role: "assistant", content: "다양한 영역의 지문을 섭렵하여 조사하여 설명함으로 본인의 뛰어난 융, 복합적 문해 능력을 증명함. 수업시간에 성실하게 참여하는 적극성이 돋보이는 학생임." },
        { role: "user", content: "영어 멘토 활동을 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
        { role: "assistant", content: "영어 멘토 활동에서 동료 학생들에게 영어 학습에 관한 조언과 도움을 주며, 개인화된 학습 계획을 돕는 역할을 수행함. 영어 멘토로서의 리더십과 소통 능력을 통해 학생들의 영어 실력 향상을 도움." },
        { role: "user", content: `${title}활동을 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요.` }
      ]
    } else {
      messages = [
        { role: "system", content: `당신은 학생의 ${subject} 과목 세부 능력 특기사항을 쓰는 교사입니다. 모든 문장을 개조식으로 작성해야 합니다.` },
        { role: "user", content: "여행지 소개하기 활동을 수행한 학생이 받을 생기부 세특 예시를 작성해 주세요." },
        { role: "assistant", content: "여행해보고 싶은 해외의 도시로 LA를 선정하여, 그 지역 명소인 디즈니랜드의 실제 리뷰를 해외 사이트에서 찾아, 이를 바탕으로 여행지를 소개하는 글을 작성하였고 구체적인 여행 계획을 세움." },
        { role: "user", content: "영어로 토론하기 활동을 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
        { role: "assistant", content: "영어로 토론하기 활동에서 '집값을 낮추어야 출산률이 반등한다' 라는 본인의 주장을 근거를 들어 토론을 진행함. 청중에게 시선을 골고루 맞추고 인상적인 제스처와 통계를 활용하여 건설적인 토의를 진행함." },
        { role: "user", content: "읽기 1회 활동은 수업시간에 자발적으로 손을 들어 주어진 지문을 읽는 활동이에요. 읽기 1회를 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
        { role: "assistant", content: "수업시간에 자발적으로 손을 들어 명쾌한 발음과 자연스러운 억양으로 주어진 지문을 1회 읽음." },
        { role: "user", content: "발표3회 활동은 수업시간에 영어 지문을 3회 해석하며 발표한 활동이에요. 발표3회를 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
        { role: "assistant", content: "다양한 영역의 지문을 섭렵하여 조사하여 설명함으로 본인의 뛰어난 융, 복합적 문해 능력을 증명함. 수업시간에 성실하게 참여하는 적극성이 돋보이는 학생임." },
        { role: "user", content: "영어 멘토 활동을 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
        { role: "assistant", content: "영어 멘토 활동에서 동료 학생들에게 영어 학습에 관한 조언과 도움을 주며, 개인화된 학습 계획을 돕는 역할을 수행함. 영어 멘토로서의 리더십과 소통 능력을 통해 학생들의 영어 실력 향상을 도움." },
        { role: "user", content: `${title}활동에 대한 설명은 ${content}입니다. 이 활동을 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요.` }
      ]
    }

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
    });

    if (completion.choices[0].message.content) {
      setGptAnswer(completion.choices[0].message.content)
      setGptRes('complete')
    } else {
      window.alert('챗GPT 서버 문제로 문구를 입력할 수 없습니다.')
      setGptRes('complete')
    }
  }

  return { gptAnswer, askChatGpt, gptRes }
}

export default useChatGpt