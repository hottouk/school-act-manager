import OpenAI from 'openai'
import { useState } from 'react'
import useGetByte from './useGetByte'
import { gptBehaviorMsg, gptSubjectDetailsMsg, gptPersonalOnTraitMsg, gptPersonalOnReportMsg } from '../data/gptMsgDataList'

//24.08.08 수정(바이트 변수 제거 및 프롬프트 수정)
const useChatGpt = () => {
  const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true })
  const [gptAnswer, setGptAnswer] = useState('');
  const [gptBytes, setGptBytes] = useState(0);
  const [gptRes, setGptRes] = useState(null);
  const { getByteLengthOfString } = useGetByte();

  const askChatGpt = async (title, subject, content) => {
    let messages = [
      {
        role: "system",
        content: `당신은 학생의 생활기록부를 객관적으로 작성해야하는 베테랑 교사임.
        생활기록부 중에서도 ${subject} 과목 교과세부능력 및 특기사항을 작성하려고 해.
        '세부능력 및 특기사항'이란 학생들이 수업 중에 했던 활동을 통해 변화하고 성장한 점을 교사가 구체적이고 객관적으로 기록한 내용임.
        [과목]과 [활동]을 알려줄게. 이것을 토대로 예시문을 생성해 줘. 단, 반드시 [조건]을 지켜야 함.

        [조건]:  
        1. '학생'이라는 주어 사용 금지. '그는', '그가', '그의' 라는 말 사용 금지.
        2. 명사형 종결어미 문체만 사용해야함. 명사형 종결어미의 문체란 문장을 반드시 '~음', '~펼침', '~임', '~함', '~됨'등으로 끝내야함. 
        명사형 종결어미 문체의 예시: '밝고 긍정적인 태도를 바탕으로 수업에 최선을 다하는 모습을 자주 보임.' 

        [과목]: ${subject}  
        [활동]: ${title}-${content}.`
      },
      ...gptSubjectDetailsMsg,
      {
        role: "user", content: `[과목]: ${subject}, [활동]: ${title}-${content}. 위 활동을 수행한 학생의 교과 세부능력 및 특기사항의 예시문을 작성바람.`
      },
    ]
    await playGpt(messages)
  }

  const askExtraRecord = async (curRecord) => {
    let messages = [
      {
        role: "system", content: `당신은 과목 세부 능력 특기사항을 객관적 관찰자 시점으로 작성해야하는 교사임. 이 때 반드시 '명사형 종결어미 문체'를 사용해야함.
        '명사형 종결어미 문체'의 예시는 다음과 같음. '밝고 긍정적인 태도를 바탕으로 수업에 최선을 다하는 모습을 자주 보임.' 처럼 '~음', '~펼침', '~임', '~함', '~됨'등으로 종결해야함.
        요청받은 문구 4개의 문구 사이에 각각 "^" 구분자를 사용하여 제시해야함.`
      },
      {
        role: "user", content: "주어진 문장: 'used to 동사, get used to 명사, be used to 동사의 의미를 정확히 알고 친구들에게 설명함.'"
          + "위 주어진 문장의 의미와 길이가 비슷한 문구를 4개 생성해주세요. 4개의 문구 사이에 각각 '^' 구분자를 사용하여 제시해야함."
      },
      {
        role: "assistant", content: "used to 동사, get used to 명사, be used to 동사의 의미를 정확히 파악하고 친구들에게 설명해주는 모습을 보임.^"
          + "used to 동사, get used to 명사, be used to 동사의 용법과 쓰임을 설명할 수 있으며 또래 교사로 활동함.^"
          + "헷갈리기 쉬운 used to 동사, get used to 명사, be used to 동사의 용법과 각 쓰임을 정확히 파악하고 있음.^"
          + "used to, get used to, be used to의 의미와 용법을 각각 정확히 이해하고 친구들에게 설명 가능함."
      },
      {
        role: "user", content: "주어진 문장: '삶과 죽음에 관한 여러 연사들의 연설문을 읽고 그 중 두 개를 발췌하여 친구들 앞에서 영어로 발표함."
          + "두 연설문 모두 발음과 억양과 자연스럽고 정확하였으며 머뭇거림이나 끊김 없이 유창하게 청중에게 전달함.'"
          + "위 주어진 문장의 의미와 길이가 비슷한 문구를 4개 생성해주세요. 4개의 문구 사이에 각각 '^' 구분자를 사용하여 제시해야함."
      },
      {
        role: "assistant", content: "여러 연사들이 삶과 죽음에 대해 발표한 연설문을 읽고 그 중 두 개를 암기하여 영어로 발표함. 억양이 자연스럽고 발음이 정확하며 딕션이 좋아 청중에게 큰 호응을 받음.^"
          + "삶과 죽음에 관련된 연설문들을 읽고 그 중 두 개를 발췌하여 친구들 앞에서 영어로 시연함. 정확한 발음, 자연스러운 억양을 뽐내며 발표를 성황리에 마침.^"
          + "인생과 죽음이라는 주제의 글을 읽고 두 개를 선택하여 학급 앞에서 자연스러운 영어로 연설함. 화려한 제스쳐, 웅장한 목소리, 자연스러운 표정으로 원어민에 가까운 실력으로 연설을 소화해냄.^"
          + "친구들 앞에서 영어로 삶과 죽음이라는 주제의 글 두 개를 선택하여 연설함. 적절한 발화 속도, 자연스러운 억양 등, 나무랄데 없는 발표로 친구들에게 박수갈채를 받음.",
      },
      {
        role: "user", content: `주어진 문장: '${curRecord}'
        "위 주어진 문장의 의미와 길이가 비슷한 문구를 4개 생성해주세요. 4개의 문구 사이에 각각 '^' 구분자를 사용하여 제시해야함.`
      },
    ]
    playGpt(messages)
  }

  const askPerfRecord = async (subject, acti, curRecord) => {
    let messages = [
      //대전제
      {
        role: "system", content: `당신은 과목 세부 능력 특기사항을 객관적 관찰자 시점으로 작성해야하는 교사임.
        [과목]과 [활동], [예시 문구]를 알려줄게. 이를 토대로 이 학생이 달성한 수준이 '상','중','하' 일 때의 예시문을 각각 생성해 줘.
        단, 반드시 [조건]을 지켜야 함.
        
        [조건]
        '학생'이라는 주어는 사용 금지
        '그는', '그가', '그의'라는 주어는 사용 금지
        문장의 어미를 명사형 종결어미로 해야함. '명사형 종결어미 문체'의 예시는 다음과 같음. '밝고 긍정적인 태도를 바탕으로 수업에 최선을 다하는 모습을 자주 보임.' 이처럼 '~음', '~펼침', '~임', '~함', '~됨' 등으로 종결해야함.
        달성 수준 '상'의 문구는 '중' 문구 보다 길고 구체적인 예시가 있어야 하며 마찬가지로 '중' 수준의 문구는 '하'보다 길고 구체적이어야 함.
        각 문구 사이에 각각 '^' 구분자를 사용하여 상 1개, 중 1개, 하 1개의 순서대로 제공해줘.
        `
      },
      //예시1
      {
        role: "user", content: `
        [과목]: 음악
        [활동]: 교가 부르기
        [예시 문구]: 교가 부르기 활동에서 적극적으로 참여하며 학급 분위기를 활발하게 조성함. 정확한 리듬감과 멋진 음악적 표현력을 보여주어 학급 전체의 일체화에 기여함.
        `
      },
      {
        role: "assistant", content: "교가 부르기 활동에 열정적으로 참여하여 정확한 리듬감, 음정, 가수를 방불케 하는 노래 실력등으로 학급 급우들의 박수 갈채를 받음. 특히 '관악산 정기 받아~' 고음 부분에서 안정적인 음처리가 인상적이며 여유 있는 태도로 교가를 완창함.^"
          + "교가 부르기 활동에서 적극적으로 참여하며 학급 분위기를 활발하게 조성함. 정확한 리듬감과 멋진 음악적 표현력을 보여주어 학급 전체의 일체화에 기여함.^"
          + "교가를 외워 부르는 활동에서 정확한 리듬감을 뽐냄. 익살스러운 표현력으로 급우들의 호응을 얻음."
      },
      //예시2
      {
        role: "user", content: `
        [과목]: 국어
        [활동]: 독서 신문 만들기
        [예시 문구]: 소설을 읽고 독서 신문을 만드는 활동에서 주어진 소설을 분석하여 기사로 씀.
        `
      },
      {
        role: "assistant", content: "독서 신문을 만드는 활동에서 주어진 소설을 꼼꼼히 정독하여 등장 인물의 심리, 주요 줄거리, 이에 대한 본인의 다양한 해석을 제시함. 특히 '사랑방 손님과 어머니' 라는 작품에서 어린아이의 시점으로 소설을 서술한 것에 대한 본인의 생각을 제시하는 창의성이 엿보임.^"
          + "문학작품을 읽고 독서 신문을 만드는 활동에서 주어진 소설을 분석하고 등장 인물의 심리와 행동에 대해 탐구함. 또한 창의적인 아이디어와 표현력을 발휘하여 문학적 요소를 잘 소화해냄.^"
          + "문학 작품을 읽고 독서 신문을 만드는 활동에서 주어진 소설을 분석하고 주요 등장 인물을 소개함."
      },
      //예시3
      {
        role: "user", content: `
        [과목]: 영어
        [활동]: 연설문 말하기
        [예시 문구]: 삶과 죽음에 관한 여러 연사들의 연설문을 읽고 그 중 하나를 발췌하여 친구들 앞에서 영어로 발표함. 명확한 발음, 자연스러운 억양과 풍부한 표현력이 인상적인 연설이었음. 말하고자 하는 바를 머뭇거림이나 끊김 없이 유창하게 청중에게 전달함.
        `
      },
      {
        role: "assistant", content: "삶과 죽음에 관한 여러 연사들의 연설문을 읽고 그 중 하나를 발췌하여 친구들 앞에서 영어로 발표함. 명확한 발음, 자연스러운 억양과 풍부한 표현력이 인상적인 연설이었음. 말하고자 하는 바를 머뭇거림이나 끊김 없이 유창하게 청중에게 전달함.^"
          + "삶과 죽음에 대해 강연을 듣고 인상 깊었던 하나를 택하여 영어로 외워 낭독하는 시간을 가짐. 죽음은 모두에게 공평한 선물이라는 부분을 생생하게 전달함.^"
          + "삶과 죽음에 관한 연사들의 연설문을 읽고 외워 그 중 일부분을 영어로 발표함."
      },
      {
        role: "user", content: `
        [과목]: ${subject}
        [활동]: ${acti}
        [예시 문구]: ${curRecord}
        `
      },
    ]
    playGpt(messages)
  }

  const askGptPersonalize = async (acti, personalPropList) => {
    let subject = acti.subject || "국어"
    let record = acti.record || ''
    let messages = [
      ...gptPersonalOnTraitMsg,
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
        또한, "학생은~" 과 같은 주어를 사용하면 안됨. "학생은~"을 생략하고 "성실한 수업 태도를 일관되게 보여줌." 로 써주어야 함.
        학생의 행동적 특성과 현재 활동 내용을 바탕으로 구체적 예시를 들어 ${subject} 과목 세특을 작성해줘.
        `
      }
    ]
    await playGpt(messages)
  }

  const askPersonalizeOnReport = async (record, report) => {
    let messages = [...gptPersonalOnReportMsg,
    {
      role: "user",
      content: `활동 문구: ${record}
        아래는 위의 활동을 한 학생이 쓴 진로 보고서야.
    
        활동 보고서: ${report}
    
        위 활동과 보고서를 적절히 섞어서 생기부 문구를 만들어줘, 조건은 '학생은~'과 같은 주어가 없어야 하고 '~음', '~펼침', '~임', '~함', '~됨'등으로 끝나는 문장으로 작성해줘`
    },
    ]
    await playGpt(messages)
  }

  const askBehavioralOp = async (specList) => {
    let specArrList = (Object.entries(specList))
    let selected = []
    specArrList.map((specArr) => {
      if (specArr[1].length > 0) {
        selected.push(`-${specArr[0]}: ${specArr[1].join(', ')}`)
      }
      return null;
    })
    let messages = [...gptBehaviorMsg,
    {
      role: "user",
      content: `행동적 특성은 다음과 같음: 
      ${selected.join("\n")}
        행동적 특성에 따라서 글을 작성하되, 구체적 근거 사례를 인용하여 글을 작성 바람.
        또한, "학생은~" 과 같은 문장을 사용하면 안됨. 예를 들면 "학생은 성실한 수업 태도를 일관되게 보여줌." 이렇게 쓰지 말고, "학생은~"을 생략하고 "성실한 수업 태도를 일관되게 보여줌." 로 써주어야 함.
        위의 행동적 특성을 토대로 구체적 예시를 들어 행동특성 및 종합의견을 생성 바람. 단, 반드시 [조건]을 지켜야 함.
        [조건]:  
        1. '학생'이라는 주어 사용 금지. '그는', '그가', '그의' 라는 말 사용 금지.
        2. 명사형 종결어미 문체만 사용해야함. 명사형 종결어미의 문체란 문장을 반드시 '~음', '~펼침', '~임', '~함', '~됨'등으로 끝내야함. 
        명사형 종결어미 문체의 예시: '밝고 긍정적인 태도를 바탕으로 수업에 최선을 다하는 모습을 자주 보임.' 
        `
    }
    ]
    await playGpt(messages)
  }

  // 공통 부분
  const playGpt = async (messages) => {
    setGptRes("loading")
    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
      temperature: 1.0, //창의성
      top_p: 0.6        //다양성
    });

    if (completion.choices[0].message.content) {
      setGptAnswer(completion.choices[0].message.content)
      setGptBytes(getByteLengthOfString(completion.choices[0].message.content))
      setGptRes("complete")
    } else {
      window.alert('챗GPT 서버 문제로 문구를 입력할 수 없습니다.')
      setGptRes("complete")
    }
  }

  return { gptAnswer, askChatGpt, askGptPersonalize, askPersonalizeOnReport, askExtraRecord, askPerfRecord, askBehavioralOp, gptBytes, gptRes }
}

export default useChatGpt