import OpenAI from 'openai'
import { useState } from 'react'
import useGetByte from './useGetByte'
import { gptBehaviorMsg, gptSubjectDetailsMsg, gptPersonalOnTraitMsg, gptPersonalOnReportMsg, gptHomeroomDetailMsg, gptExtraRecordMsg, gptPerfRecordMsg, gptTranslateMsg } from '../data/gptMsgDataList'

//프롬프트 수정(240808)-> 모델 변경 가능(250520)
const useChatGpt = () => {
  const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true })
  const [gptAnswer, setGptAnswer] = useState('');
  const [gptRes, setGptRes] = useState(null);
  const { getByteLengthOfString } = useGetByte();

  //교과 과세특 
  const askSubjRecord = async (title, subject, content) => {
    let messages = [
      ...gptSubjectDetailsMsg,
      {
        role: "user", content: `[과목]: ${subject}, [활동]: ${title}-${content}. 위 활동을 수행한 학생의 교과 세부능력 및 특기사항의 예시문을 작성바람.`
      }
    ]
    await playGpt(messages, "gpt-4o-mini");
  }
  //자율, 진로
  const askHomeroomReccord = async (title, subject, content, date, byte) => {
    if (date === '') date = '없음'
    if (byte === 0) byte = 300
    let messages = [
      ...gptHomeroomDetailMsg,
      {
        role: "user", content: `[과목]: ${subject}, [활동]: ${title}, [날짜정보]:${date}, [설명]: ${content}, [바이트]: ${byte}   위 활동을 수행한 학생의 교과 세부능력 및 특기사항의 예시문을 작성바람.`
      }]
    await playGpt(messages, "gpt-4o-mini");
  }
  //돌려 쓰기
  const askExtraRecord = async (curRecord) => {
    let messages = [
      ...gptExtraRecordMsg,
      {
        role: "user", content: `[주어진 문장]: '${curRecord}'
        "위 주어진 문장의 의미와 길이가 비슷한 문구를 6개 생성해주세요. 문구들 사이에 각각 '^' 구분자를 사용하여 제시해야함.`
      },
    ]
    playGpt(messages, "gpt-4o-mini");
  }
  //수행평가 상,중,하 문구 만들기
  const askPerfRecord = async (subject, acti, curRecord) => {
    let messages = [
      ...gptPerfRecordMsg,
      {
        role: "user", content: `
        [과목]: ${subject}
        [활동]: ${acti}
        [예시 문구]: ${curRecord}
        `
      },
    ]
    playGpt(messages, "gpt-4o-mini");
  }
  //특성 기반 개별화
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
        작성할 글의 길이는 현재 활동 내용보다 약간 긴 1.2배 정도로 작성해야함.
        또한, "학생은~" 과 같은 주어를 사용하면 안됨. "학생은~"을 생략하고 "성실한 수업 태도를 일관되게 보여줌." 로 써주어야 함.
        학생의 행동적 특성과 현재 활동 내용을 바탕으로 구체적 예시를 들어 ${subject} 과목 세특을 작성해주세요.
        `
      }
    ]
    await playGpt(messages, "gpt-4o-mini")
  }
  //보고서 기반 개별화
  const askPersonalizeOnReport = async (record, report) => {
    let messages = [...gptPersonalOnReportMsg,
    {
      role: "user",
      content: `활동 문구: ${record}
        아래는 위의 활동을 한 학생이 활동 후에 작성한 결과 보고서입니다.
        
        활동 보고서: ${report}
        활동 보고서를 핵심만 요약하고 기존 문구와 혼합하여 기존 문구보다 1.2배 분량정도 되는 문구를 작성 바람. 
        기존 문구에 '[]'가 있다면 대괄호를 뺴고 이 부분에 활동 보고서 요약본을 넣어 기존 문구와 유기적으로 연결되도록 작성 바람. 
        또한, "학생은~" 과 같은 주어를 사용하면 안됨. "학생은~"을 생략하고 "성실한 수업 태도를 일관되게 보여줌." 로 써주어야 함.
        반드시 '~음', '~펼침', '~임', '~함', '~됨','~됨'등으로 끝나는 명사형 종결어미를 사용하여 문장을 끝맺어야 함`
    },
    ]
    await playGpt(messages, "o4-mini");
  }
  //타이핑 기반 개별화
  const askPersonalizeOnTyping = async (record, report) => {
    const messages = [...gptPersonalOnReportMsg,
    {
      role: "user",
      content: `기존 문구: ${record}
        아래는 위의 활동을 한 학생이 활동 후에 작성한 결과 보고서입니다.
        
        활동 보고서: ${report}
        활동 보고서를 핵심만 요약하고 기존 문구와 혼합하여 기존 문구보다 1.2배 분량정도 되는 문구를 작성 바람. 
        기존 문구에 '[]'가 있다면 대괄호를 뺴고 이 부분에 활동 보고서 요약본을 넣어 기존 문구와 유기적으로 연결되도록 작성 바람. 
        단, 결과 보고서는 학생의 손글씨를 기반으로 하였으므로 오타가 있을 수 있음. 오타가 있다면 맥락에 맞게 적절히 수정 바람.
        또한, "학생은~" 과 같은 주어를 사용하면 안됨. "학생은~"을 생략하고 "성실한 수업 태도를 일관되게 보여줌." 로 써주어야 함.
        반드시 '~음', '~펼침', '~임', '~함', '~됨','~됨'등으로 끝나는 명사형 종결어미를 사용하여 문장을 끝맺어야 함`
    },
    ]
    await playGpt(messages, "o4-mini");
  }
  //한국말 번역
  const translateEngtoKorean = async (text) => {
    const message = [
      ...gptTranslateMsg,
      {
        role: "user",
        content: `${text},
        위의 문장을 자연스러운 한국말로 번역해주세요.`
      },]
    await playGpt(message, "o4-mini");
  }
  //행발
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
    await playGpt(messages, "gpt-4o-mini");
  }
  // 공통 부분
  const playGpt = async (messages, model) => {
    setGptRes("loading")
    const completion = await openai.chat.completions.create({
      messages: messages,
      // model: gpt-3.5-turbo, gpt-4o-mini, gpt-4.1-mini
      model: model,
      temperature: 1.0, //창의성  0.0 (정확, 보수적) ~ 1.0+ 2.0까지 가능 (창의, 다양)
    });
    if (completion.choices[0].message.content) {
      setGptAnswer(completion.choices[0].message.content)
      setGptRes("complete")
    } else {
      window.alert('챗GPT 서버 문제로 문구를 입력할 수 없습니다.')
      setGptRes("complete")
    }
  }

  return { gptAnswer, askSubjRecord, askHomeroomReccord, askGptPersonalize, askPersonalizeOnReport, askPersonalizeOnTyping, askExtraRecord, askPerfRecord, askBehavioralOp, translateEngtoKorean,  gptRes }
}

export default useChatGpt