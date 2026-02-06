import { useState } from 'react'
import { useSelector } from 'react-redux'
import { callAskGPT, callAskGptOnly, callCalculateRira } from '../firebase/config'
import { GPT_MODE, GPT_RESPONSE } from "../constants/gpt"
import StringUtils from '../utils/StringUtils'
//데이터
import {
  gptBehaviorMsg, gptSubjectMsg, gptOnTraitMsg, gptOnReportMsg, gptHomeroomMsg, gptExtraRecordMsg,
  gptPerfRecordMsg, gptTranslateMsg, gptExtractVocabMsg, gptKeywordMsg, gptMakeExamMsg, gptRetouchPassageMsg,
  gptRetouchOptionsMsg
} from '../data/gptMsgDataList'
//프롬프트 수정(240808)-> 모델 변경 가능(250520) => gpt api 보안이슈(250916) => message 분리(260127)
const useChatGpt = () => {
  const user = useSelector(({ user }) => user);
  const [gptAnswer, setGptAnswer] = useState('');
  const [gptAnswerList, setGptAnswerList] = useState([]);
  const [gptProgress, setGptProgress] = useState({ current: 0, total: 0 });
  const [gptRes, setGptRes] = useState(null);
  const [gptStatus, setGptStatus] = useState('');
  const { removeAllLineBreaks } = StringUtils();
  //------ActivityFormPage------------------------------------------------
  //1. 교과 과세특
  const askSubjRecord = async (subject, content, model, rira) => {
    setGptProgress({ current: 1, total: 2 });
    setGptStatus("열심히 작성 중..");
    const messages = gptSubjectMsg(subject, content);
    await playGpt({ messages, model, rira });
    setGptProgress({ current: 2, total: 2 });
    setGptStatus('');
  }
  //2. 성취도 상,중,하
  const askPerfRecord = async (subject, content, record, model, rira) => {
    setGptProgress({ current: 1, total: 2 });
    setGptStatus("상, 중, 하 뚝딱뚝딱..");
    const messages = gptPerfRecordMsg(subject, content, record);
    await playGpt({ messages, model, rira });
    setGptProgress({ current: 2, total: 2 });
    setGptStatus('');
  }
  //3. 돌려 쓰기
  const askExtraRecord = async (subject, content, record, model, rira) => {
    setGptProgress({ current: 1, total: 2 });
    setGptStatus("돌려쓰기 만드는 중..");
    const messages = gptExtraRecordMsg(subject, content, record)
    await playGpt({ messages, model, rira });
    setGptProgress({ current: 2, total: 2 });
    setGptStatus('');
  };
  //4. 자율, 진로
  const askHomeroomRecord = async (subject, title, content, time, model, rira) => {
    setGptProgress({ current: 1, total: 2 });
    setGptStatus("열심히 작성 중..");
    const messages = gptHomeroomMsg(subject, title, content, time);
    await playGpt({ messages, model, rira });
    setGptProgress({ current: 2, total: 2 });
    setGptStatus('');
  }
  //------GptModal------------------------------------------------
  //5. 특성 기반 개별화(todo, 임의기록에서 gpt 활용 시)
  const askGptOnTrait = async (subject, record, personalPropList, model, rira) => {
    const traits = personalPropList.map(prop => `${Object.keys(prop)[0]}: ${Object.values(prop)[0]}.`).join(", ");
    setGptProgress({ current: 1, total: 2 });
    setGptStatus("특성과 문구를 열심히 섞는 중..");
    const messages = gptOnTraitMsg(subject, record, traits);
    await playGpt({ messages, model, rira });
    setGptProgress({ current: 2, total: 2 });
    setGptStatus('');
  }
  //6. 보고서 기반 개별화
  const askGptOnReport = async (record, report, model, rira) => {
    setGptProgress({ current: 1, total: 2 });
    setGptStatus("보고서를 읽는 중..");
    const messages = gptOnReportMsg(record, report);
    await playGpt({ messages, model, rira });
    setGptProgress({ current: 2, total: 2 });
    setGptStatus('');
  };
  //------AllStudentByActiPage------------------------------------------------
  //7. 키워드 기반 개별화
  const askGptOnKeywords = async (record, keywords, model, rira) => {
    setGptProgress({ current: 1, total: 2 });
    setGptStatus("키워드와 문구를 열심히 섞는 중..");
    const messages = gptKeywordMsg(record, keywords);
    await playGpt({ messages, model, rira });
    setGptProgress({ current: 2, total: 2 });
    setGptStatus('');
  };
  //8. 한국말 번역
  const askTranslate = async (text, model, rira) => {
    setGptProgress({ current: 1, total: 2 });
    setGptStatus("번역 중..");
    const messages = gptTranslateMsg(text);
    await playGpt({ messages, model, rira });
    setGptStatus('');
    setGptProgress({ current: 2, total: 2 });
  };
  //------BehaviorOpinionSection------------------------------------------------
  //9. 행발
  const askBehavioralOp = async (specList, model, rira) => {
    setGptProgress({ current: 1, total: 3 });
    const specArrList = Object.entries(specList);
    const selected = [];
    specArrList.forEach((specArr) => { if (specArr[1].length > 0) selected.push(`-${specArr[0]}: ${specArr[1].join(', ')}`); })
    const messages = gptBehaviorMsg(selected);
    setGptStatus("생성 중..");
    setGptProgress({ current: 2, total: 3 });
    await playGpt({ messages, model, rira });
    setGptStatus('');
    setGptProgress({ current: 3, total: 3 });
  };
  //10. 스마트 단어 추출
  const extractVocab = async (text,) => {
    setGptProgress({ current: 1, total: 2 });
    setGptStatus("단어 추출 중..");
    const messages = gptExtractVocabMsg(text);
    const { data } = await callAskGptOnly({ messages, model: "gpt-5-nano" });
    const content = data.content;
    setGptAnswer(content);
    setGptProgress({ current: 2, total: 2 });
    setGptStatus('');
  }
  //------ExamEditSection------------------------------------------------
  //11. 시험문제
  const makeExamQuestion = async (type, question, text, level, target, model, rira) => {
    setGptProgress({ current: 1, total: 2 });
    setGptStatus("문제 출제 중..");
    if (type === "심경, 분위기") question = `다음 글에 드러난 ${target}의 심경 변화로 가장 적절한 것은?`;
    if (type === "함축 의미") question = `밑줄 친 ${target}이 다음 글에서 의미하는 바로 가장 적절한 것은?`;
    const messages = [...gptMakeExamMsg(type, question, text, level)];
    await playGpt({ messages, model, rira });
    setGptProgress({ current: 2, total: 2 });
    setGptStatus('');
  }
  //12. 지문 리터치
  const retouchPassage = async (passage, request, model, rira) => {
    setGptProgress({ current: 1, total: 2 });
    setGptStatus("리터치 중..");
    const messages = gptRetouchPassageMsg(passage, request);
    await playGpt({ messages, model, rira });
    setGptProgress({ current: 2, total: 2 });
    setGptStatus('');
  }
  //13. 선지 리터치
  const retouchOptions = async (optionList, request, model, rira) => {
    setGptProgress({ current: 1, total: 2 });
    setGptStatus("리터치 중..");
    const options = optionList.join("\n");
    const messages = gptRetouchOptionsMsg(options, request);
    await playGpt({ messages, model, rira });
    setGptProgress({ current: 2, total: 2 });
    setGptStatus('');
  }
  //gpt->배열
  const splitGptAnswers = (gptAnswers, devider) => gptAnswers.split(devider);
  //gpt 실행
  const playGpt = async ({ messages, model = "gpt-5-mini", temperature = 1.0, rira = 0 }) => {
    console.log("model", model)
    setGptRes(GPT_RESPONSE.LOADING);
    await callAskGPT({ messages, model, temperature, rira, uid: user.uid }).then((res) => {
      const { data } = res;
      const content = data.content;
      console.log(data.usage);
      const chunk = removeAllLineBreaks(content);
      setGptAnswer(chunk);
      setGptRes(GPT_RESPONSE.COMPLETE);
    }).catch(err => {
      console.log(err);
      setGptAnswer(`[에러 발생], 리라는 차감되지 않습니다. 다시 시도해주세요. ${err}`);
      setGptRes(GPT_RESPONSE.COMPLETE);
    })
  }
  //gpt 다중 실행
  const playMultipleGpt = async (infoList, multiMode, model, rira) => {
    const answerList = [];
    let completionTokens = 0;
    let promptTokens = 0;
    let errNumber = 0;
    const total = infoList.length;
    setGptProgress({ current: 0, total });
    setGptRes(GPT_RESPONSE.LOADING);
    //1. 리라 차감
    const { data } = await callCalculateRira({ uid: user.uid, model, status: "pending", times: total, expectedRira: rira })
    const { success, charged } = data;
    console.log(`Log1. 성공: ${success} 부과 예정 금액: ${charged}`);
    if (!success) return;
    //2. gpt 호출
    for (let i = 0; i < total; i++) {
      setGptStatus("⏳반복중...");
      const { idx, studentNumber, id, name, record, mode, report, fillerMap, keywordList } = infoList[i];
      const fillers = Object.values(fillerMap).join(',');
      const keywords = (keywordList ?? []).join(',');
      const getMessages = (mode) => {
        if (multiMode === GPT_MODE.MULTI_TRANS) return gptTranslateMsg(report);
        if (mode === "report") return gptOnReportMsg(record, report);
        else if (mode === "filler") return gptKeywordMsg(record, fillers);
        return gptKeywordMsg(record, keywords);
      }
      try {
        const { data } = await callAskGptOnly({ messages: getMessages(mode), model });
        answerList.push({ idx, studentNumber, name, id, answer: data.content || "[응답 없음]" });
        const { completion_tokens, prompt_tokens } = data.usage;                                        //토큰
        completionTokens += completion_tokens;
        promptTokens += prompt_tokens;
        setGptProgress({ current: i + 1, total });                                                      //진행률
      } catch (error) { errNumber += 1; }
    }
    console.log(`Log2. gpt 호출 실패 횟수: ${errNumber}`);
    if (errNumber > 0) {
      const { data } = await callCalculateRira({ uid: user.uid, model, status: "refunded", times: -errNumber });
      const { charged } = data;
      console.log(`Log3. 환불 완료: ${charged}`);
    }
    console.log(completionTokens, promptTokens, model);
    setGptRes(GPT_RESPONSE.COMPLETE);
    setGptProgress({ current: 0, total: 0 });
    setGptAnswerList(answerList);
  }
  return {
    gptAnswer, gptAnswerList, gptProgress, gptRes, gptStatus, setGptAnswer,
    askSubjRecord, askPerfRecord, askExtraRecord, askHomeroomRecord,
    askGptOnTrait, askGptOnReport, askGptOnKeywords, askTranslate,
    askBehavioralOp, extractVocab,
    makeExamQuestion, retouchPassage, retouchOptions,
    splitGptAnswers, playMultipleGpt,
  }
}
export default useChatGpt