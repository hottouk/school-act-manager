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
      {
        role: "system",
        content: `당신은 학생의 ${subject} 과목의 세부 능력 특기사항을 객관적 관찰자 시점으로 작성해야하는 교사임. ${title} 활동은 ${content}임. 
        ${content}에서 학생이 했을 것이라 예상되는 활동을 구체적 예시를 들어 한글로 적어야 함.
        모든 문장을 '~음', '~했음', '~임', '~함' 과 같이 개조식으로 작성해야 함.
      ` },
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
      { role: "user", content: `${title}활동은 ${content}에 관한 활동입니다. 이 활동을 수행한 학생의 과세특에 적을 예시 문구를 대략 ${byte}byte 정도로 작성해 주세요.` }
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

  const askGptPersonalize = async (acti, personalPropList) => {
    setGptRes('loading')
    let subject = acti.subject || "국어"
    let record = acti.record || ''
    let messages = [
      //1. 대전제
      {
        role: "system", content: `당신은 과목 세부 능력 특기사항을 객관적 관찰자 시점으로 작성해야하는 교사임.
        아래 글 구조에 따라서 '생활 기록부의 교과 세부 능력 및 특기사항'을 작성해야함. 이 때 반드시 '명사형 종결어미 문체'를 사용해야함.
        '명사형 종결어미 문체'의 예시는 다음과 같음. '밝고 긍정적인 태도를 바탕으로 수업에 최선을 다하는 모습을 자주 보임.' 처럼 '~음', '~펼침', '~임', '~함', '~됨'등으로 종결해야함. 
        글을 작성할 때, 작성된 과세특 문구와 제공되는 학생의 특성을 바탕으로 학생별 개별화 된 과세특을 작성해야 함. 문맥에 맞게 구체적인 활동 사례와 태도와 사고력에 관한 깊이 있는 평가문을 서술해야함. `
      },
      //2-1. 예시1
      {
        role: "user",
        content: `학생의 행동적 특성은 다음과 같음:
        학업 역량: 지적 호기심이 많음, 다량의 책을 읽음
        리더십: 학생들을 주도하여 학업 분위기 고취
        진로 역량: 생물학자
        성실성: 성실하고 훌륭함
        활동 내용: 읽은 책을 바탕으로 영어 독해 능력이 크게 향상되었으며, 각 책의 주요 내용을 정리하여 발표하고 토론을 주도하는 모습을 보임

        위 행동적 특성과 활동 내용에 따라서 글을 작성하되, 활동 내용을 더 구체적으로 묘사하고 근거 사례를 인용하여 글을 작성 바람
        또한, "학생은~" 과 같은 문장을 사용하면 안됨. 예를 들면 "학생은 성실한 수업 태도를 일관되게 보여줌." 이렇게 쓰지 말고, "학생은~"을 생략하고 "성실한 수업 태도를 일관되게 보여줌." 로 써주어야 함.
        학생의 행동적 특성과 현재 활동 내용을 바탕으로 구체적 예시를 들어 영어 과목 세특을 작성 바람.`
      },{
        role: "assistant", content: "영어 수업에서 'The Gene: An Intimate History','The Sixth Extinction', 'The Botany of Desire' 등 10권의 책을 읽고 깊이 있는 이해를 보임."
          + " 읽은 책을 바탕으로 영어 독해 능력이 크게 향상되었으며, 각 책의 주요 내용을 정리하여 발표하고 토론을 주도하는 모습을 보임. "
          + " 생물학자의 꿈을 이루기 위해 관련 지식을 영어로 습득하고, 이를 영어로 표현하는 능력을 기름. 특히 'The Immortal Life of Henrietta Lacks'를 읽고,"
          + " 생명윤리에 관한 심도 있는 질문을 제기하고, 'The Double Helix'를 통해 DNA 구조에 대한 이해를 심화함. 이러한 활동을 통해 영어 독해와 말하기 능력이 향상되었으며,"
          + " 생물학에 대한 열정을 바탕으로 영어와 과학 지식을 통합적으로 이해하고 탐구하는 능력이 뛰어남."
          + " 앞으로 생물학자로서 필요한 영어 능력을 적극적으로 발전시키고자 하는 의지가 돋보임."
      },
      //2-2. 예시2
      {
        role: "user",
        content: `학생의 행동적 특성은 다음과 같음:
        학업 역량: 영어는 잘하지만 집중력이 다소 낮음.
        리더십: 조용하고 혼자 활동하는 것을 좋아함.
        진로 역량: 컴퓨터 프로그래밍에 관심이 많음.
        성실성: 다소 덤벙대지만 열심히 노력함.
        활동 내용: 쓰기 영역에서 ‘고등학생은 항상 교복을 입어야하는가?’ 에 관한 에세이를 작성하여 첨삭 받음.

        위 행동적 특성과 활동 내용에 따라서 글을 작성하되, 활동 내용을 더 구체적으로 묘사하고 근거 사례를 인용하여 글을 작성 바람
        또한, "학생은~" 과 같은 문장을 사용하면 안됨. 예를 들면 "학생은 성실한 수업 태도를 일관되게 보여줌." 이렇게 쓰지 말고, "학생은~"을 생략하고 "성실한 수업 태도를 일관되게 보여줌." 로 써주어야 함.
        학생의 행동적 특성과 현재 활동 내용을 바탕으로 구체적 예시를 들어 영어 과목 세특을 작성 바람.`
      },{
        role: "assistant", content: "쓰기 영역에서 '고등학생은 항상 교복을 입어야 하는가?'에 관한 에세이를 작성하고 첨삭을 받아 교정하는 과정을 통해 표현력을 향상시킴."
          + " 비교적 우수한 성적을 보이며, 특히 문법과 어휘 활용에서 뛰어난 역량을 나타냄. 집중력이 다소 낮아 이를 극복하기 위해 다양한 자기주도 학습 방법을 모색함."
          + " 컴퓨터 프로그래밍에 대한 강한 관심을 바탕으로 관련 자료를 찾아 학습하며, 영어 문법과 프로그래밍 용어를 연결해 이해하고 적용하는 등의 노력을 보임."
          + " 다소 덤벙대는 면이 있지만, 항상 열심히 노력하는 성실한 태도로 학습에 임하며, 학습한 내용을 실생활에 적용하고자 하는 노력과 진지함이 엿보임."
      },
      //3. 질문
      {
        role: "user",
        content: `학생의 행동적 특성은 다음과 같음: 
        ${personalPropList.map(personalProp => {
          return `${Object.keys(personalProp)[0]}: ${Object.values(personalProp)[0]}.`
        })}
        활동 내용: ${record}
        위 학생의 행동적 특성과 활동 내용에 따라서 글을 작성하되, 활동 내용을 더 구체적으로 묘사하고 구체적 근거 사례를 인용하여 글을 작성 바람.
        작성할 글의 문자 수는 현재 활동 내용과 행동 특성을 다 합친 문자의 길이와 비슷하거나 약간 긴 1.5배 정도로 작성해야함.
        또한, "학생은~" 과 같은 문장을 사용하면 안됨. 예를 들면 "학생은 성실한 수업 태도를 일관되게 보여줌." 이렇게 쓰지 말고, "학생은~"을 생략하고 "성실한 수업 태도를 일관되게 보여줌." 로 써주어야 함.
        학생의 행동적 특성과 현재 활동 내용을 바탕으로 구체적 예시를 들어 ${subject} 과목 세특을 작성 바람.
        `
      }
    ]
    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
      temperature: 1.0, //창의성
      top_p: 0.6        //다양성
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

  return { gptAnswer, askChatGpt, askGptPersonalize, gptBytes, gptRes }
}

export default useChatGpt