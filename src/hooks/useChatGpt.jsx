import { useState } from 'react'
//데이터
import {
  gptBehaviorMsg, gptSubjectMsg, gptPersonalOnTraitMsg, gptReportMsg, gptHomeroomDetailMsg, gptExtraRecordMsg,
  gptPerfRecordMsg, gptTranslateMsg, gptExtractVocabMsg, gptKeywordMsg, gptMakeExamMsg, gptRetouchPassageMsg,
  gptRetouchOptionsMsg
} from '../data/gptMsgDataList'
import { callAskGPT } from '../firebase/config'
import { GPT_MULTI_MODE } from "../constants/gptMode"
import StringUtils from '../utils/StringUtils'
import { useSelector } from 'react-redux'
//프롬프트 수정(240808)-> 모델 변경 가능(250520) => gpt api 보안이슈(250916)
const useChatGpt = () => {
  const user = useSelector(({ user }) => user);
  const [gptAnswer, setGptAnswer] = useState('');
  const [gptAnswerList, setGptAnswerList] = useState([]);
  const [gptProgress, setGptProgress] = useState({ current: 0, total: 0 });
  const [gptRes, setGptRes] = useState(null);
  const [gptStatus, setGptStatus] = useState('');
  const { removeAllLineBreaks } = StringUtils();
  //1. 교과 과세특
  const askSubjRecord = async (subject, content, model, rira) => {
    setGptProgress({ current: 1, total: 2 });
    setGptStatus("열심히 작성 중..");
    const messages = gptSubjectMsg(subject, content);
    await playGpt({ messages, model, rira })
      .finally(() => { setGptStatus(''); setGptProgress({ current: 2, total: 2 }); });
  }
  //2. 성취도 상,중,하 문구 만들기
  const askPerfRecord = async (subject, acti, record, model) => {
    const messages = [
      ...gptPerfRecordMsg,
      {
        role: "user",
        content: `[과목]: ${subject}
        [활동]: ${acti}
        [예시 문구]: ${record}
        [예시 문구]를 토대로 달성 수준이 '상','중','하' 일 때의 예시문을 각각 생성 바람.
        `
      },
    ]
    playGpt({ messages, model });
  }
  //3. 돌려 쓰기 문구
  const askExtraRecord = async (record, model = "gpt-5-mini") => {
    const messages = [
      ...gptExtraRecordMsg,
      {
        role: "user",
        content: `[주어진 문장]: '${record}'
        "위 주어진 문장의 의미와 길이가 비슷한 문구를 6개 생성해주세요. 문구들 사이에 각각 '^' 구분자를 사용하여 제시해야함.`
      },
    ]
    await playGpt({ messages, model });
  };
  //4. 보고서 기반 개별화
  const askPersonalizeOnReport = async (record, report, model = "gpt-5-mini") => {
    setGptProgress({ current: 1, total: 2 });
    const messages = gptReportMsg(record, report);
    await playGpt({ messages, model });
  };
  //5. 키워드 기반 개별화
  const askPersonalizeOnKeywords = async (record, keywords, model = "gpt-5-mini") => {
    const messages = gptKeywordMsg(record, keywords);
    await playGpt({ messages, model });
  }
  //6. 한국말 번역
  const askTranslate = async (text, model = "gpt-5-mini") => {
    setGptProgress({ current: 1, total: 2 });
    setGptStatus("번역 중..");
    const messages = gptTranslateMsg(text);
    playGpt({ messages, model }).finally(() => { setGptStatus(''); setGptProgress({ current: 2, total: 2 }); });
  }
  //7. 다중 요청
  const askMultipleWork = async (infoList, model, multiMode) => {
    const answerList = [];
    let completionTokens = 0;
    let promptTokens = 0;
    const total = infoList.length;
    setGptProgress({ current: 0, total });
    setGptRes("loading");
    for (let i = 0; i < total; i++) {
      setGptStatus("⏳반복중...");
      const { idx, studentNumber, id, name, record, mode, report, fillerMap, keywordList } = infoList[i];
      const fillers = Object.values(fillerMap).join(',');
      const keywords = (keywordList ?? []).join(',');
      const getMessages = (mode) => {
        if (multiMode === GPT_MULTI_MODE.trans) return gptTranslateMsg(report);
        if (mode === "report") return gptReportMsg(record, report);
        else if (mode === "filler") return gptKeywordMsg(record, fillers);
        return gptKeywordMsg(record, keywords);
      }
      const { data } = await callAskGPT({ messages: getMessages(mode), model });
      answerList.push({ idx, studentNumber, name, id, answer: data.content || "[응답 없음]" });
      const { completion_tokens, prompt_tokens } = data.usage;                                        //토큰
      completionTokens += completion_tokens;
      promptTokens += prompt_tokens;
      setGptProgress({ current: i + 1, total });                                                      //진행률
    }
    console.log(completionTokens, promptTokens, model);
    setGptRes("complete");
    setGptProgress({ current: 0, total: 0 });
    setGptAnswerList(answerList);
  }
  //8. 행발
  const askBehavioralOp = async (specList, model = "gpt-5-mini") => {
    setGptProgress({ current: 1, total: 3 });
    const specArrList = Object.entries(specList);
    const selected = [];
    specArrList.forEach((specArr) => { if (specArr[1].length > 0) selected.push(`-${specArr[0]}: ${specArr[1].join(', ')}`); })
    const messages = gptBehaviorMsg(selected);
    setGptStatus("생성 중..");
    setGptProgress({ current: 2, total: 3 });
    await playGpt({ messages, model }).finally(() => { setGptStatus(''); setGptProgress({ current: 3, total: 3 }); });
  }
  //4. 자율, 진로
  const askHomeroomReccord = async (title, subject, content, byte) => {
    if (byte === 0) byte = 300;
    let messages = [
      ...gptHomeroomDetailMsg,
      { role: "user", content: `[과목]: ${subject}, [활동]: ${title}, [설명]: ${content}, [바이트]: ${byte}. 위 활동을 수행한 학생의 교과 세부능력 및 특기사항의 예시문을 작성바람.` }]
    await playGpt({ messages, model: "gpt-4o-mini" });
  }

  //6. 특성 기반 개별화(todo, 임의기록에서 gpt 활용 시)
  const askGptPersonalize = async (acti, personalPropList) => {
    const subject = acti.subject || "국어"
    const record = acti.record || ''
    const messages = [
      ...gptPersonalOnTraitMsg,
      //3. 질문
      {
        role: "user",
        content: `학생의 행동적 특성은 다음과 같음: 
        ${personalPropList.map(personalProp => `${Object.keys(personalProp)[0]}: ${Object.values(personalProp)[0]}.`)}
        활동 내용: ${record}
        위 학생의 행동적 특성과 활동 내용에 따라서 글을 작성하되, 활동 내용을 더 구체적으로 묘사하고 구체적 근거 사례를 인용하여 글을 작성 바람.
        작성할 글의 길이는 현재 활동 내용보다 약간 긴 1.2배 정도로 작성해야함.
        또한, "학생은~" 과 같은 주어를 사용하면 안됨. 예를 들자면 "학생은~"을 생략하고 "성실한 수업 태도를 일관되게 보여줌." 로 써주어야 함.
        학생의 행동적 특성과 현재 활동 내용을 바탕으로 구체적 예시를 들어 ${subject} 과목 세특을 작성해주세요.
        `
      }
    ]
    await playGpt({ messages, model: "gpt-4o-mini" });
  }
  //12. 스마트 단어 추출
  const extractVocab = async (text,) => {
    let messages = [...gptExtractVocabMsg,
    {
      role: "user",
      content: `[지문]: ${text}`
    }]
    await playGpt({ messages, model: "gpt-5-nano" });
  }
  //13. 시험문제
  const makeExamQuestion = async (type, question, text, level, target, model) => {
    if (type === "심경, 분위기") question = `다음 글에 드러난 ${target}의 심경 변화로 가장 적절한 것은?`;
    if (type === "함축 의미") question = `밑줄 친 ${target}이 다음 글에서 의미하는 바로 가장 적절한 것은?`;
    const messages = [...gptMakeExamMsg(type, question, text, level)];
    console.log("messages", messages, " model:", model);
    await playGpt({ messages, model });
  }
  //14. 지문 리터치
  const retouchPassage = async (passage, request) => {
    const messages = [
      ...gptRetouchPassageMsg,
      {
        role: "user",
        content: `[지문]: ${passage}, [요구]:${request}`
      }
    ];
    await playGpt({ messages, model: "gpt-5-mini" });
  }
  //15. 선지 리터치
  const retouchOptions = async (optionList, request) => {
    const options = optionList.join("\n");
    const messages = [
      ...gptRetouchOptionsMsg,
      {
        role: "user",
        content: `[선택지]: ${options}, [요구]:${request}`
      }
    ];
    await playGpt({ messages, model: "gpt-5-mini" });
  }
  //gpt->배열
  const splitGptAnswers = (gptAnswers, devider) => gptAnswers.split(devider);
  //실행(gpt-5-mini, gpt-4.1-mini)
  const playGpt = async ({ messages, model = "gpt-5-mini", temperature = 1.0, rira = 0 }) => {
    console.log("model", model)
    setGptRes("loading");
    await callAskGPT({ messages, model, temperature, rira, uid: user.uid }).then((res) => {
      const { data } = res;
      const content = data.content;
      console.log(data.usage);
      const chunk = removeAllLineBreaks(content);
      setGptAnswer(chunk);
      setGptRes("complete");
    }).catch(err => {
      console.log(err);
      setGptAnswer(`[에러 발생], 리라는 차감되지 않습니다. 다시 시도해주세요. ${err}`);
      setGptRes("complete");
    })
  }
  return {
    gptAnswer, gptAnswerList, setGptAnswer, gptProgress, gptRes, gptStatus, askSubjRecord, askHomeroomReccord, askGptPersonalize, askPersonalizeOnReport, askPersonalizeOnKeywords, askMultipleWork,
    askExtraRecord, askPerfRecord, askBehavioralOp, splitGptAnswers, askTranslate, extractVocab, makeExamQuestion, retouchPassage, retouchOptions
  }
}

export default useChatGpt