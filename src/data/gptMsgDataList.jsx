
import { purposeExData, feelingChangeExData, authorMainPointExData, meaningExData, mainIdeaExData, thesisExData, titleExData, trueFalseExData, grammarExData, lexisExData, blankExData, nonRelatedExData, sequenceExData, insertExData, summaryExData } from "./examData"

const commonRule = "1) '학생', '그는/그가/그의'를 주어로 사용하는 것 금지함."
  + "2) 명사형 종결 어미만 사용함: ~함/~됨/~임/~나타남/~드러남/~확인됨/~냄/~바람/~관찰됨/~줌, etc.";
const subjDefiniton = "'과목 세부능력 및 특기사항'은 교육 활동을 통해 드러난 학습 과정, 행동, 태도, 성과를 구체적 사실 중심으로 기록한 문장임.";
//1. 교과 활동
const gptSubjectMsg = (subject, content) => [
  {
    role: "system",
    content: `-역할: '과목 세부능력 및 특기사항'을 객관적으로 작성하는 교사임.
-정의: ${subjDefiniton}
-입력: [과목], [활동]
-규칙: ${commonRule}
3) 활동 과정·자료·행동을 구체적으로 [과목]과 [활동]에 근거하여 1~3문장 작성함.
4) 관찰 가능한 근거 중심으로 작성함.
-형식: 문장 1~3개 연속 출력함.`},
  // 예시
  { role: "user", content: "[과목]: 여행지리, [활동]: 가보고 싶은 여행지를 선정하여 그 장소를 조사하는 활동임." },
  {
    role: "assistant",
    content: `여행지 소개하기 활동에서 가보고 싶은 해외 도시로 LA를 선정하여, 그 지역 명소인 테마파크의 실제 리뷰를 해외 사이트에서 찾아 이를 바탕으로 여행지를 소개하는 글을 작성함. 첫 날에 가 보고 싶은 곳으로 할리우드 산, 둘째 날은 돌비 극장 등 상세하고 구체적인 여행 계획을 세워 실제 여행지를 여행하는 느낌을 친구들에게 선사함. 이를 통해 실생활에서 쓰이는 표현에 대해 알 수 있었다는 느낀점을 작성하였고 여행 중 마주칠 수 있는 여러 상황에 대한 문제 해결력을 보임.`
  },
  { role: "user", content: "[과목]:영어 [활동]: 주제를 정해 찬반을 나눠 의견을 교환한다." },
  {
    role: "assistant",
    content: `영어로 토론하기 활동에서 '집값을 낮추어야 출산률이 반등한다'라는 주제에 대해 찬성 의견을 근거를 들어 피력함. 청중에게 시선을 골고루 맞추고 인상적인 제스처와 출산률과 집값의 상관관계를 보여주는 통계자료를 인용하여 본인의 주장을 효과적으로 펼쳐냄. 토의를 진행하며 반대 의견에 반박하는 방법, 타인을 설득하는 방법, 건설적인 합의를 도출해내는 등의 성과가 있었다고 소감을 발표함.`
  },
  { role: "user", content: "[과목]: 국어, [활동]: 한 학기 동안 또래 친구에게 국어 학습법을 알려주는 활동" },
  {
    role: "assistant",
    content: `한 학기 동안 국어 과목 멘토로 활동하며 동료 학생들에게 국어 학습법에 관한 조언과 도움을 주며, 개별 학습 계획을 돕는 역할을 수행함. 매주 수요일 점심시간마다 30분씩 친구와 함께 비문학 장문 독해 지문을 읽고 문제를 풀어보며 또래 교수를 진행함. 국어 멘토로서의 리더십과 소통 능력을 발휘하여 다른 학생들의 국어 실력 향상에 도움을 줌.`
  },
  { role: "user", content: "[과목]: 과학, [활동]: 편광현미경 암석박편 관찰, 편광아트에 참여하여 직접 제작한 간이 편광 현미경으로 빛의 굴절에 따른 찬란한 간섭색을 관찰함." },
  {
    role: "assistant",
    content: `교과서 밖 교과의 날 활동에서 '편광현미경 암석박편 관찰함. 편광아트'에 참여하여 광물과 암석박편을 두 개의 편광필름을 이용하여 직접 제작한 간이 편광 현미경으로 관찰하며 빛의 굴절에 따른 찬란한 간섭색을 관찰함. 또한 편광 필름 사이에 플라스틱 필름 여러 겹을 가지고 두께와 각도를 조절해 가며 아름다운 빛의 간섭색을 구현해 냄.`
  },
  { role: "user", content: `[과목]: ${subject}, [활동]:${content}.` }
]
//2. 수행 문구
const gptPerfRecordMsg = (subject, acti, record) => [
  {
    role: "system", content: `
    역할: '과목 세부능력 및 특기사항'을 객관적으로 작성하는 교사임.
      [과목]과 [활동], [예시 문구]를 토대로 학생이 달성한 수준이 '상','중','하' 일 때의 예시문을 각각 생성 바람.
정의: ${subjDefiniton}
입력: [과목], [활동], [예시 문구]
출력: '상'^'중'^'하' 순서로 3문장 출력함(각 문구는 1~2문장 허용함, 줄바꿈/번호 금지함).
규칙: ${commonRule}
3) 관찰 가능한 행동/자료/성과 중심으로 작성함.
4) 상 > 중 > 하 순으로 길이, 구체성, 근거가 단계적으로 증가함.
5) 구분자는 반드시 '^'만 사용함(앞뒤 공백 없이 출력함).`
  },
  //예시
  {
    role: "user",
    content: `[과목]: 음악,  [활동]: 교가 부르기,  [예시 문구]: 교가 부르기 활동에서 적극적으로 참여하며 학급 분위기를 활발하게 조성함. 정확한 리듬감과 멋진 음악적 표현력을 보여주어 학급 전체의 일체화에 기여함.`
  },
  {
    role: "assistant",
    content: "교가 부르기 활동에 열정적으로 참여하여 정확한 리듬감, 음정, 가수를 방불케 하는 노래 실력등으로 학급 급우들의 박수 갈채를 받음. 특히 '관악산 정기 받아~' 고음 부분에서 안정적인 음처리가 인상적이며 여유 있는 태도로 교가를 완창함.^"
      + "교가 부르기 활동에서 적극적으로 참여하며 학급 분위기를 활발하게 조성함. 정확한 리듬감과 멋진 음악적 표현력을 보여주어 학급 전체의 일체화에 기여함.^"
      + "교가를 외워 부르는 활동에서 정확한 리듬감을 뽐냄. 익살스러운 표현력으로 급우들의 호응을 얻음."
  },
  {
    role: "user",
    content: `[과목]: 국어,   [활동]: 독서 신문 만들기,  [예시 문구]: 소설을 읽고 독서 신문을 만드는 활동에서 주어진 소설을 분석하여 기사로 씀.`
  },
  {
    role: "assistant",
    content: "독서 신문을 만드는 활동에서 주어진 소설을 꼼꼼히 정독하여 등장 인물의 심리, 주요 줄거리, 이에 대한 본인의 다양한 해석을 제시함. 특히 '사랑방 손님과 어머니' 라는 작품에서 어린아이의 시점으로 소설을 서술한 것에 대한 본인의 생각을 제시하는 창의성이 엿보임.^"
      + "문학작품을 읽고 독서 신문을 만드는 활동에서 주어진 소설을 분석하고 등장 인물의 심리와 행동에 대해 탐구함. 또한 창의적인 아이디어와 표현력을 발휘하여 문학적 요소를 잘 소화해냄.^"
      + "문학 작품을 읽고 독서 신문을 만드는 활동에서 주어진 소설을 분석하고 주요 등장 인물을 소개함."
  },
  {
    role: "user",
    content: `[과목]: 영어,  [활동]: 연설문 말하기,  [예시 문구]: 삶과 죽음에 관한 여러 연사들의 연설문을 읽고 그 중 하나를 발췌하여 친구들 앞에서 영어로 발표함. 명확한 발음, 자연스러운 억양과 풍부한 표현력이 인상적인 연설이었음. 말하고자 하는 바를 머뭇거림이나 끊김 없이 유창하게 청중에게 전달함.`
  },
  {
    role: "assistant",
    content: "삶과 죽음에 관한 여러 연사들의 연설문을 읽고 그 중 하나를 발췌하여 친구들 앞에서 영어로 발표함. 명확한 발음, 자연스러운 억양과 풍부한 표현력이 인상적인 연설이었음. 말하고자 하는 바를 머뭇거림이나 끊김 없이 유창하게 청중에게 전달함.^"
      + "삶과 죽음에 대해 강연을 듣고 인상 깊었던 하나를 택하여 영어로 외워 낭독하는 시간을 가짐. 죽음은 모두에게 공평한 선물이라는 부분을 생생하게 전달함.^"
      + "삶과 죽음에 관한 연사들의 연설문을 읽고 외워 그 중 일부분을 영어로 발표함."
  },
  { role: "user", content: `[과목]: ${subject}  [활동]: ${acti}  [예시 문구]: ${record}` },
];
//3. 돌려쓰기 문구
const gptExtraRecordMsg = (subject, content, record) => [
  {
    role: "system", content: `역할: '과목 세부능력 및 특기사항'을 객관적으로 작성하는 교사임.
정의: ${subjDefiniton}
입력: [과목], [활동], [예시 문구]
출력: 의미와 길이가 유사한 문장 6개를 '^'로 구분하여 제시함.
규칙: ${commonRule}
3) 관찰 가능한 행동/자료/성과 중심으로 작성함.
4) 문장의 길이는 반드시 [주어진 문장]과 비슷하게 유지함.
5) 만약 [예시 문구]에 '{/* 내용 */}' 프레임이 있다면 이 프레임은 모든 문장에서 동일하게 유지 바람.
6) 구분자는 반드시 '^'만 사용함(앞뒤 공백 없이 출력함).`
  },
  {
    role: "user", content: "[과목]: 공통영어2, [활동]: 삶과 죽음의 메세지를 던지는 연설문을 암기하는 활동,"
      + "[예시 문구]: {/*희망학과*/}를 사전에 영어로 조사하여 학과 소개, 지원 동기, 졸업 후 진로 계획 등을 정리한 뒤 모의 면접 답변 스크립트로 구성함. 친구들 앞에서 영어로 자기소개와 전공 관련 예상 질문에 대한 {/*답변 내용*/}을 또박또박 전달하며, 시선 처리와 제스처를 활용해 면접 상황을 실제와 유사하게 구현함."
  },
  {
    role: "assistant",
    content: "{/*희망학과*/}에 대해 전공 소개 자료와 입시 정보를 영어로 조사한 후 예상 질문 목록을 작성함. 친구들 앞에서 영어 모의 면접을 실시하며 희망 전공 관련 어휘와 표현을 활용해 자기소개와 지원 동기, {/*답변 내용*/}을 설명함.^"
      + "관심 있는 {/*희망학과*/}의 교육과정과 진로를 영어로 정리한 뒤 그 내용을 바탕으로 모의 면접 질문과 답변을 준비함. 수업 시간에 친구들 앞에서 영어 모의 면접을 수행하며 비교적 또박또박한 발음과 차분한 태도로 {/*답변 내용*/}을 답하는 것이 관찰됨.^"
      + "{/*희망학과*/}를 선정하고 해당 전공의 특징과 필요 역량을 영어로 조사함. 조사한 내용을 활용해 영어 자기소개와 전공 선택 이유를 구성하고, 친구들 앞에서 {/*답변 내용*/}을 영어 모의 면접 형식으로 발표함.^"
      + "{/*희망학과*/}에 관한 정보를 영어로 검색·정리한 뒤 예상 면접 질문에 대한 답변 스크립트를 작성함. 수업 중 친구들을 면접관으로 설정하여 영어 모의 면접을 진행하며 진로 관련 어휘와 문장을 활용하여 {/*답변 내용*/}을 상세히 설명하려는 노력이 드러남.^"
      + "{/*희망학과*/} 탐색 활동을 통해 전공 내용과 진로 전망을 영어로 요약함. 이를 기반으로 영어 모의 면접 질문에 대한 답변을 준비하고 친구들 앞에서 면접 형식으로 {/*답변 내용*/}을 발표하며 진학 의지를 표현함.^"
      + "{/*희망학과*/}의 입학 전형 안내와 전공 소개를 영어로 읽고 핵심 내용을 정리함. 정리한 내용을 토대로 영어 자기소개, 지원 동기, 장단점 등을 구성하여 친구들 앞에서 {/*답변 내용*/}을 바탕으로 영어 모의 면접을 실시함."
  },
  { role: "user", content: "[과목]: 심화 영어회화, [활동]: 영어 멘토 활동, [예시 문구]: 1학기 동안 영어 멘토로 활동하여 동료 학생들에게 영어 학습에 도움을 주고, 발표나 회화 수업에서 발언을 적극적으로 하며 영어 실력을 향상시킴. 학생들의 어려움을 세심히 듣고 적절한 도움을 제공하며, 자신의 영어 실력을 향상시키는 데 기여함. 영어 멘토로서 리더십과 커뮤니케이션 능력을 향상시키고, 학업 성취도와 학생 간의 협력을 촉진함." },
  {
    role: "assistant",
    content: "1학기 동안 영어 멘토로 활동하여 동료 학생들에게 영어 학습을 지원하고 발표나 회화 수업에서 적극적으로 참여하여 영어 실력을 향상시킴. 학생들의 어려움을 세심히 듣고 적절한 조언을 제공하여 자신의 영어 실력 향상에 기여함.^"
      + "영어 멘토로서 1학기 동안 학생들에게 지원을 제공하고 발표나 회화 수업에서 적극적으로 참여하여 영어 능력을 향상시킴. 학생들의 어려움을 꼼꼼히 듣고 도움을 주어 영어 실력 향상에 도움을 줌.^"
      + "1학기 동안 영어 멘토로 활동하여 학생들에게 영어 학습을 돕고 발표나 회화 수업에서 적극적으로 참여하여 영어 실력을 향상시킴. 학생들의 어려움을 세심히 듣고 적절한 지도를 제공하여 자신의 영어 능력을 향상시킴.^"
      + "영어 멘토로서 1학기 동안 학생들을 지원하고 발표나 회화 수업에서 적극적으로 참여하여 영어 실력을 향상시킴. 학생들의 어려움을 꼼꼼히 듣고 적절한 조언을 통해 자신의 영어 능력을 향상시킴.^"
      + "1학기 동안 영어 멘토로 친구들에게 1:1 영어 과외를 지원함. 학생들이 어려워하는 내용에 대해 점심시간 마다 10분씩 시간을 내어 질문을 받고 학습 가이드를 자처함. 도움 받은 학생 뿐 아니라 자신의 지식도 점검할 수 있었다는 소감문을 작성함.^"
      + "영어 멘토-멘티 활동에서 멘토로 1학기 동안 활동하였음. 자신보다 성적이 낮은 학생을 도와 모르는 내용을 알려주고 추후 어떻게 공부하면 좋을지에 대해 상담을 통해 방향성을 제시함. 뿐만 아니라 모르는 단어도 함께 외울 수 있도록 돕는 등, 적극적으로 친구들을 도움."
  },
  { role: "user", content: `[과목]:${subject}, [활동]:${content}, [주어진 문장]: ${record}` },
];
//4. 담임반 활동
const gptHomeroomMsg = (subject, title, content, time) => [
  {
    role: "system",
    content: `
-역할: 당신은 '활동 기록'을 객관적으로 작성하는 교사임.
-정의: '활동 기록'은 학생들이 교육 활동을 통해 드러난 학습 과정, 행동, 태도, 성과를 구체적 사실 중심으로 기록한 문장임.
-입력: [과목], [활동], [활동 설명], [날짜 정보]
-규칙: ${commonRule}
3) 활동 과정·자료·행동을 구체적으로 [과목]과 [활동 설명]에 근거하여 1~3문장 작성함.
4) 관찰 가능한 근거 중심으로 작성함.
5) [날짜 정보]가 있다면 [활동] 뒤에 그대로 붙여주기 바람. ex: 과학창의력마당(2024.05.27.)
6) [사용자 스타일]이 제공된다면 내용은 다르게 하되 [사용자 스타일]의 문장 길이, 어미, 표현 습관, 강조 방식 등을 최대한 모방하여 작성 바람.
-형식: 문장 1~3개 연속 출력함.`},
  //예시
  { role: "user", content: "[과목]: 진로, [활동]: 진로맞춤형 독서활동 [활동 설명]: 1년간 진로 관련 책을 읽고 진로 탐색 활동 진행한 후, 보고서를 작성함., [날짜정보]: (2024.03.29.-2024.11.01.) " },
  { role: "assistant", content: `진로맞춤형 독서 활동(2024.03.29.-2024.11.01.)을 통해 '인간의 마지막 권리(박충구)' 도서를 읽고 활동을 수행함. '인간의 마지막 권리(박충구)'를 읽고 안락사와 존엄사에 대하여 살펴보고 우리나라와 외국에서 안락사와 존엄사에 대한 제도나 법률을 비교해 봄.` },
  { role: "user", content: "[과목]: 자율, [활동]: 제123기 학생회 운영위원회, [활동 설명]: 123기 학생회 운영위원회로 활동함." },
  { role: "assistant", content: "학생회 운영위원회(2024.04.01.-2025.02.28.)으로 봉사함. 리더십캠프와 대의원회의 사전 준비를 하고 안건 수합 및 회의록 작성 등 중요 역할을 책임감 있게 수행함. 학교 축제 단체복을 디자인하고 제작을 담당하였으며 인기있는 결과물을 도출함. 학교 축제 준비 및 진행 과정에 적극적으로 참여하여 행사가 원활하게 진행될 수 있도록 역할을 다함. 4.19기념행사, 스승의날 행사, 학생회 주관 모의고사, 3학년 수능응원 행사 등 모든 학생주도 활동에서 적극적으로 임함." },
  { role: "user", content: "[과목]: 진로, [활동]: '휘어진 시대' 강연 참가, [활동 설명]: '휘어진 시대' 강의에 참가하여 느낀점을 작성함." },
  { role: "assistant", content: "창의융합아카데미 프로그램에 참여하여 '휘어진 시대'에 대한 강연을 통해 과학사와 과학철학을 재조명하며 학문 간 경계를 넘어선 융합적 사고의 필요성을 이해함. 4차 산업혁명, 창조성, 본질적 긴장 등을 통해 현대 사회의 변화를 파악하고, 발산적 사고와 수렴적 사고의 조화를 통한 과학적 창조성과 리더십의 본질을 통찰함." },
  { role: "user", content: `[과목]: ${subject}, [활동]: ${title}, [활동 설명]: ${content}, [날짜 정보]: ${time}` }
];
//5. 특성 기반 개별화
const gptOnTraitMsg = (subject, record, traits) => [
  {
    role: "system", content: `역할: 학생의 활동 결과 [키워드]를 바탕으로 '과목 세부능력 및 특기사항'을 객관적으로 작성하는 교사임.
정의: ${subjDefiniton}
입력: [과목], [활동 문구], [학생 특성]
출력: [과목]과 [활동 문구]에 기반하여 [학생 특성]를 적절히 혼합한 2-3문장의 평가문.
규칙: ${commonRule}
3) [활동 문구]와 [학생 특성]을 적절히 혼합하여 활동 문구의 1.2배 분량의 2-3문장으로 평가문을 작성할 것.
4) 활동 문구에 '{/* 내용 */}'이 있다면 '{/* 내용 */}'을 제거하고 이 부분과 [키워드]를 매칭시켜 기존 문구와 유기적으로 연결되도록 작성 바람.`
  },
  //예시
  {
    role: "user",
    content: `[과목]: 공통 영어1,
    [활동 문구]: 읽은 책을 바탕으로 영어 독해 능력이 크게 향상되었으며, 각 책의 주요 내용을 정리하여 발표하고 토론을 주도하는 모습을 보임,
    [학생 특성]:
    학업 역량: 지적 호기심이 많음, 다량의 책을 읽음,
    리더십: 학생들을 주도하여 학업 분위기 고취
    진로 역량: 생물학자
    성실성: 성실하고 훌륭함`
  },
  {
    role: "assistant", content: `영어 수업에서 'The Gene: An Intimate History','The Sixth Extinction', 'The Botany of Desire' 등 10권의 책을 읽고 깊이 있는 이해를 보임. 읽은 책을 바탕으로 영어 독해 능력이 크게 향상되었으며, 각 책의 주요 내용을 정리하여 발표하고 토론을 주도하는 모습을 보임. 생물학자의 꿈을 이루기 위해 관련 지식을 영어로 습득하고, 이를 영어로 표현하는 능력을 기름. 특히 'The Immortal Life of Henrietta Lacks'를 읽고, 생명윤리에 관한 심도 있는 질문을 제기하고, 'The Double Helix'를 통해 DNA 구조에 대한 이해를 심화함. 이러한 활동을 통해 영어 독해와 말하기 능력이 향상되었으며, 생물학에 대한 열정을 바탕으로 영어와 과학 지식을 통합적으로 이해하고 탐구하는 능력이 뛰어남. 앞으로 생물학자로서 필요한 영어 능력을 적극적으로 발전시키고자 하는 의지가 돋보임.`
  },
  {
    role: "user",
    content: `[과목]: 기본 영어,
    [활동 문구]: 쓰기 영역에서 '고등학생은 항상 교복을 입어야하는가?' 에 관한 에세이를 작성하여 첨삭 받음.,
    [학생 특성]:
    학업 역량: 영어는 잘하지만 집중력이 다소 낮음.
    리더십: 조용하고 혼자 활동하는 것을 좋아함.
    진로 역량: 컴퓨터 프로그래밍에 관심이 많음.
    성실성: 다소 덤벙대지만 열심히 노력함.`
  },
  {
    role: "assistant", content: `쓰기 영역에서 '고등학생은 항상 교복을 입어야 하는가?'에 관한 에세이를 작성하고 첨삭을 받아 교정하는 과정을 통해 표현력을 향상시킴. 비교적 우수한 성적을 보이며, 특히 문법과 어휘 활용에서 뛰어난 역량을 나타냄. 집중력이 다소 낮아 이를 극복하기 위해 다양한 자기주도 학습 방법을 모색함. 컴퓨터 프로그래밍에 대한 강한 관심을 바탕으로 관련 자료를 찾아 학습하며, 영어 문법과 프로그래밍 용어를 연결해 이해하고 적용하는 등의 노력을 보임. 다소 덤벙대는 면이 있지만, 항상 열심히 노력하는 성실한 태도로 학습에 임하며, 학습한 내용을 실생활에 적용하고자 하는 노력과 진지함이 엿보임.`
  },
  {
    role: "user",
    content: `[과목]:${subject},
    [활동 문구]: ${record},
    [학생 특성]:
    ${traits}`
  }
];
//6. 보고서 기반 개별화
const gptOnReportMsg = (record, report) => [
  {
    role: "system", content: `역할: 학생의 활동 [결과 보고서]를 바탕으로 '과목 세부능력 및 특기사항'을 객관적으로 작성하는 교사임.
    정의: '과목 세부능력 및 특기사항'은 교육 활동을 통해 드러난 학습 과정, 행동, 태도, 성과를 구체적 사실 중심으로 기록한 문장임.
입력: [활동 문구], [결과 보고서]
출력: [활동 문구]에 기반하여 [결과 보고서]를 적절히 혼합한 2-3문장의 평가문.
규칙: ${commonRule}
3) 활동 보고서를 핵심만 요약하고 활동 문구와 적절히 혼합하여 활동 문구의 1.2배 분량의 2-3문장으로 평가문을 작성할 것.
4) 활동 문구에 '{/* 내용 */}'가 있다면 '{/* 내용 */}'을 제거하고 이 부분과 [결과 보고서] 요약본을 넣어 기존 문구와 유기적으로 연결되도록 작성 바람.`
  },
  //예시
  {
    role: "user",
    content: `[활동 문구]: 'Lamb to the Slaughter'를 읽고 제목이 주는 의미와 작품의 대표적 기법인 아이러니에 대해 자신의 의견을 작성함.
    [결과 보고서]: 양은 메리를 상징한다고 생각해요. 성경에서 양은 보통 하나님의 순수하고 결백한 아이를 상징합니다. 
    그러나 소설에서 메리는 살인자가 됩니다. 그래서 양은 도살당하러 가는 것이지만, 양 자체가 도살당하는 존재가 됩니다. 이 소설에는 역설적인 상황들이 있어요. 
    먼저, 메리가 자신의 남편을 죽입니다. 소설의 시작에서 메리는 남편을 기대하며 기다리지만 나중에는 그녀가 사랑하는 남편을 자신의 손으로 죽입니다. 
    둘째, 그녀는 양다리를 사용해 그를 죽입니다. 그리고 그녀는 형사들이 증거를 파괴하도록 합니다. 메리가 형사들에게 양을 먹이고 웃는 장면에서 정말 오싹한 느낌이었어요.`
  },
  {
    role: "assistant", content: "Lamb to the Slaughter'를 읽고 제목에서의 'lamb' 이 순진한 가정주부에서 살인자로 변모한 Mary를 나타낸다고 파악함."
      + " 또한 아이러니의 개념에 대해 학습하고 순수했던 Mary가 살인자로 변한 점과 음식을 살해 도구로 사용한 점 등이 작품의 핵심인 상황적 아이러니의 예시로 꼽음."
      + " 결말 부분에 그녀가 형사들을 속이며 웃음짓는 부분에서 소름이 돋았다는 감상평을 적절한 영어를 구사하여 작성함."
  },
  {
    role: "user",
    content: `[활동 문구]: 진로맞춤형 독서 활동에서 책을 읽고 진로 관련 활동을 기획하고 참여함.
    독서를 통해 진로에 대한 흥미와 가능성을 발견하고, 해당 분야에 대한 깊은 이해를 높임. 진로 탐색을 통해 자신의 강점과 흥미를 발견하고,
    독서를 통해 쌓은 지식을 현실적인 진로 선택에 활용함. 함께한 동료들과의 토의를 통해 다양한 진로에 대한 시야를 넓히고, 진로 결정에 도움을 주는 활동을 진행함. 
    [결과 보고서]: 재정학을 배우면서 얻게 된 의의는 국가 재정 운영이 국가 경제와 사회 전반에 미치는 영향을 깊이 이해하게 되었다는 점이다.
    재정학은 단순히 세금과 예산을 다루는 학문이 아니라, 국가 정책이 경제 및 사회 구조에 어떻게 영향을 미치는지 탐구하는 학문이다. 
    예산 편성이나 공공 재정 정책은 국민들의 생활에 직접적인 영향을 주며, 경제 발전과 사회적 형평성을 달성하는 데 중요한 역할을 한다. 
    재정학을 통해 공공재와 사회적 형평성의 중요성도 깊이 깨닫게 되었다. 공공재는 국민 모두가 함께 누려야 할 가치이며, 
    이를 위해 정부의 재정이 어떻게 효과적으로 쓰여야 하는지에 대해 고민할 수 있었다. 예를 들어, 교육, 보건, 도로와 같은 공공재는 단순한 서비스 제공을 넘어서, 
    모든 국민이 최소한의 삶의 질을 보장받을 수 있도록 하는 필수적인 요소이다. 이러한 공공재를 제공하고 유지하기 위해 정부가 어떻게 재원을 마련하고 배분하는지가
    매우 중요하다는 점을 알게 되었다. 재정학을 배우면서 국가 재정이 경제적 불평등 문제를 해결하는 데도 핵심적인 역할을 한다는 점을 깨달았다. 
    소득세와 같은 세금 제도나 사회 보장 제도를 통해 저소득층에 혜택을 제공함으로써 경제적 불평등을 완화할 수 있다. 재정 정책을 통해 사회적 안전망을 구축하고,
    사회 계층 간의 격차를 줄이는 것은 국가의 지속 가능한 발전에 필수적이다. 이러한 정책을 통해 단순한 경제 성장 이상의 사회적 가치를 실현하는 것이 재정학의 
    중요한 목표임을 이해하게 되었다.`
  },
  {
    role: "assistant", content: "진로맞춤형 독서 활동을 통해 재정학에 대한 흥미와 가능성을 발견하고, 국가 재정 운영이 경제와 사회 전반에 미치는 영향을 깊이 이해하게 됨."
      + " 재정학은 단순히 세금과 예산을 다루는 학문이 아니라, 공공재와 사회적 형평성의 중요성을 탐구하며, 정부 재정이 경제적 불평등 문제를 해결하고 사회적 안전망을 구축하는"
      + " 핵심적인 역할을 한다는 점을 깨달았다는 보고서를 작성함. 독서를 통해 얻은 지식을 기반으로 공공재 제공과 사회적 형평성을 달성하기 위한 정책적 접근을 고민하며,"
      + " 동료들과의 토의를 통해 다양한 진로에 대한 시야를 확장하고 진로 선택에 도움을 주는 활동을 진행함."
  },
  {
    role: "user",
    content: `[활동 문구]: 모의 영어 면접 활동에서  {/*희망 학과*/} 에 대한 열정을 영어로 표현하여 면접을 진행함. 직무 관련 질문에 대해  {/*대답 내용*/} 을 바탕으로 대답함.
    [결과 보고서]: 환경 과학, 이에 의한 사회적 문제, 생명 과학, 인공지능(딥러닝)을 집중적으로 탐구했다. 특히나 생명과학과 인공지능에 대해서 깊게 탐구해 보았다. 
    아직 확실한 꿈은 정해지지 않았지만 우리의 신체를 탐구하는 쪽이나 인공지능을 개발하는 일을 하고 싶다. 혹은 두 분야의 융합을 통해 우리의 신체를 분석해주는 인공지능을
    개발하는 일이라면 더욱 좋을 것 같다. 이 분야에서 나는 생명 과학의 경우, 생명의 탐구와 발전만을 고려하는 것이 아니라, 그 발전이 불러일으킬 영향, 탐구하는 과정에서 발생하는 역효과나
    부작용 등을 모두 고려해야 한다는 점을 잊지 않아야겠다고 생각했고, 인공지능의 경우, 초등학교와 중학교 때 서울교대 영재원과 서울대 영재원에서 탐구해온 인공지능과 딥러닝에 대해
    다시 한번 복습할 수 있는 계기가 되어 좋았다.`
  },
  {
    role: "assistant", content: "모의 영어 면접 활동에서 생명공학과 인공지능학과에 대한 열정을 영어로 표현하고, 직무 관련 질문에 대해 생명과학과 인공지능 분야에 대한 자신만의 시각과 경험을 바탕으로"
      + " 환경 과학, 사회적 문제, 생명 과학, 인공지능(딥러닝)에 집중적으로 탐구하며, 생명과학과 인공지능 분야에서의 꿈을 고민하고 있다고 영어로 답함."
      + " 생명 과학의 발전이 불러일으킬 영향과 부작용을 고려하며, 인공지능과 딥러닝에 대한 탐구 경험을 통해 더 깊은 이해를 얻고자 노력함."
      + " 생명 과학과 인공지능 분야의 융합을 통해 신체를 분석하는 인공지능을 개발하는 일에 흥미를 느끼며, 두 분야의 결합이"
      + " 미래 기술 발전에 기여할 수 있다는 가능성을 염두에 두고 있다는 본인의 시각을 영어로 유창하게 답변함."
  },
  {
    role: "user",
    content: `기존 문구: 달성하고 싶은 연간 목표를 구체적으로 제시하고 목표를 이루기 위한 계획과 노력을 설명하는 활동에서 {/*보고서 내용*/}라고 작성함. 또한 오늘 하루를 돌아보며 잘된점과 개선점을 영문으로 작성함.
      [결과 보고서]: 고등학교 3년 동안 이루고 싶은 목표가 세 가지 있습니다. 첫째, 좋은 성적을 받고 싶습니다. 완벽한 점수가 아니어도 괜찮습니다. 최선을 다했을 때 만족하기 때문입니다. 
      저는 무언가에 최선을 다하고 미래를 생각하며 앞으로 나아가는 것을 좋아합니다. 또한 새로운 것을 배우고 자신을 발전시키는 것을 즐깁니다. 제 목표 중 하나는 다섯 가지 언어를 구사하는 것입니다. 
      예를 들어, 한국어, 영어, 일본어, 독일어, 태국어입니다. 이 모든 언어에 관심이 있습니다. 만약 이 언어들을 배우고 말할 수 있다면, 다양한 문화의 사람들과 대화하고 그들의 독특한 분위기와 전통을 이해할 수 있을 것입니다. 
      호기심이 많기 때문에 학습 과정에서 더 많은 즐거움을 찾을 것이라고 생각합니다. 마지막으로, 오랫동안 멈췄던 것을 다시 시작하고 싶습니다. 어렸을 때 피아노를 배웠지만, 고등학교 일정 때문에 오랫동안 연주를 그만두었습니다. 
      최근에 우연히 연습실을 방문하여 다시 연주하게 되었는데, 오랜만에 들은 소리에 감동을 받았습니다. 그것이 다시 배우고 아름다운 음악을 연주하는 꿈을 꾸게 했습니다. 비록 모든 목표를 한 번에 이룰 수는 없겠지만, 조금씩 노력하다 보면 언젠가 이룰 수 있을 것이라고 믿습니다.`
  }, {
    role: "assistant", content: "달성하고 싶은 연간 목표를 구체적으로 제시하고 목표 달성을 위한 계획과 노력을 설명하는 활동에서 다년간의 학업 성취, 다섯 언어 습득 목표, 및 피아노 연주 재개 의지를 명확히 제시하고 오늘 하루의 잘된 점과 개선점을 영어로 성찰함. 목표 설정과 일일 영어 성찰을 통해 학습에 대한 성실한 태도, 문화적 소통 능력 확대 의지, 자기주도적 자기계발 의지 등이 확인됨."
  },
  { role: "user", content: `[활동 문구]: ${record}, [결과 보고서]: ${report}` }
];
//7. 키워드 기반 개별화
const gptKeywordMsg = (subject, keywords) => [
  {
    role: "system", content: `역할: 학생의 활동 결과 [키워드]를 바탕으로 '과목 세부능력 및 특기사항'을 객관적으로 작성하는 교사임.
정의: ${subjDefiniton}
입력: [담당], [키워드]
출력: [담당]과 [키워드]에 기반한 구체적이고 성장 중심이며 생기부에 적합한 문장.
규칙: ${commonRule}
`
  },
  //예시
  {
    role: "user",
    content: `[담당]: 영어 교사, [키워드]: 성실, 집중력이 좋음, 영문법 감이 좋음, 발음이 좋음.`
  },
  {
    role: "assistant", content: "수업에 성실한 태도로 임하며 높은 집중력을 바탕으로 학습 내용을 안정적으로 습득함. 영문법에 대한 이해 감각이 뛰어나 문장 구조를 빠르게 파악하고 오류를 스스로 교정하는 능력을 보임. 또한 정확하고 자연스러운 발음을 구사하여 듣기 및 말하기 활동에서 우수한 수행 능력을 나타냄."
  },
  {
    role: "user",
    content: `[담당]: 한국사 교사, [키워드]: 박물관을 좋아함, 스토리 텔링을 잘함., 손들고 매번 발표`
  }, {
    role: "assistant", content: "박물관에 대한 높은 관심을 바탕으로 역사 유물과 시대적 배경을 연결하여 이해하는 능력이 뛰어남. 수업 중 배운 내용을 사건의 흐름에 맞게 재구성하여 스토리텔링 방식으로 설명하는 역량이 돋보이며, 이를 통해 역사적 맥락을 생생하게 전달함. 매 차시 적극적으로 손을 들어 발표에 참여하는 등 능동적인 수업 태도를 보이며, 토의 활동에서도 자신의 생각을 논리적으로 표현함."
  },
  {
    role: "user",
    content: `[담당]: ${subject} 교사, [키워드]: ${keywords}`
  }
];
//8. 
const gptOverallMsg = (subject, records) => [
  {
    role: "system", content: `역할: 학생의 활동 결과 [활동들]을 바탕으로 '생기부 문구'를 생성하는 교사임.
정의: ${subjDefiniton}
입력: [과목명], [활동들]
출력: [과목명]과 [활동들]에 기반한 구체적이고 성장 중심이며 생기부에 적합한 1,2 문장.
규칙: ${commonRule}
`
  },
  //예시
  {
    role: "user",
    content: `[과목명]: 영어, [활동 내역]: 반복 학습으로 자주 틀리는 구조를 점검하며 오답 원인까지 분석, 문법 규칙을 실제 문맥에 적용하는 능력을 기르고 언어 분석력과 문제 해결력을 함께 향상시킴. '변화를 감지하는 능력' 관련 글 발표에서 생소한 단어를 설명하고 시각 자료를 활용해 집중력을 높였으며, 즉석 문제 풀이로 학습 효과를 심화함. '인지적 유연성 이론'을 연결해 변화 감지 능력의 실제 사례를 설명하며 언어 학습과 인지심리 개념을 융합적으로 탐구함. 자료 분석, 의사소통, 논리적 사고력을 동시에 강화함. 모의 면접 활동에서 패션 디자인 학과 면접을 영어로 진행하여 관련 역량에 대한 이해도와 열정을 보여줌. 해당 학과 필수 역량에 대한 질문에 인내심 및 변화하는 트렌드를 읽는 유연함이 필수라고 생각하여 의류 브랜드에 대해 공부하고 옷을 스케치한다고 유창한 영어로 대답함. 영어를 모국어처럼 자유자재로 말할 수 있는 뛰어난 말하기 능력을 갖추고 있는 준비된 인재임. '내향형 리더십'에 대한 지문을 학습하고 핵심 단어들의 의미와 문법을 분석하며 서번트 리더십의 효과성에 대해 발표함. 특히 문장 삽입 문항에서 'however'라는 접속사의 특징을 설명하며 글의 흐름이 바뀌는 지점을 잘 포착하여 정답의 근거에 대해 상세히 설명함.`
  },
  {
    role: "assistant", content: "분석력과 표현력을 겸비한 균형 잡힌 학습 태도를 지니고 있음. 전공 역량을 영어 기반으로 확장해 나간다면 전문성과 글로벌 소통 능력을 함께 갖춘 리더로 발전할 가능성이 높음."
  },
  {
    role: "user",
    content: `[과목명]: 사회, [활동 내역]: 이코노미스트2025세계대전망’을 정독한 후 학술 세미나를 조직·운영하고 세미나 자료집과 토론 주제 목록 및 활동 기록을 통해 학습 성과를 확인함. 분석 결과, 취임 직후의 발언을 근거로 경제안보·반도체 공급망·북핵 대응 등 현실적 이해관계가 엮인 분야에서는 협력 기조가 단기간에 크게 변화하지 않을 가능성이 크고, 강제동원 배상·교과서 서술·독도 영유권 등 과거사·영토 문제에서는 인식 차이로 인한 갈등 요인이 지속될 가능성이 제시됨. 초기 발언과 정책 선택의 누적적 흐름이 양국 관계 형성에 중요한 변수로 작용함을 확인하고, 사안별 협력과 갈등의 병존 양상 및 맥락·시기·정책 연속성 고려의 필요성이 도출됨.`
  },
  {
    role: "assistant", content: "국제 정세를 다각도로 분석하고 정책 발언과 구조적 이해관계를 종합해 해석하는 통찰력이 뛰어남. 향후 경제안보·외교·역사 인식 등 복합적 쟁점을 균형 있게 탐구해 나간다면, 맥락과 연속성을 고려하는 성숙한 시각을 갖춘 글로벌 사회 문제 분석가로 성장할 것으로 기대됨."
  },
  {
    role: "user",
    content: `[과목명]: ${subject}, [활동 내역]: ${records}`
  }
];
//8. 자연스러운 번역
const gptTranslateMsg = (text) => [
  { role: "system", content: `당신은 전문 번역가입니다. 주어진 문장을 자연스럽게 한국말로 번역해주세요. 학생들이 쓴 글이라 문법적 오류가 많을 수 있습니다. 말이 되지 않는 부분은 맥락에 맞게 적절히 해석해주세요.` },
  {
    role: "user", content: `I think 'Lamb' symbolizes Mary Maloney. She was a very kind, gentle and beautiful house wife. But when she kills her husband, she tuns into a slaughterman. It was very dramatic. The situational ironies is how the detectives 
    eat the lamb's leg which is the evidence for Mary Maloney's murder.,
    위의 문장을 자연스러운 한국말로 번역해주세요.`
  },
  {
    role: "assistant", content: "나는 '양'이 메리 말로니를 상징한다고 생각해요. 그녀는 매우 친절하고 온순하며 아름다운 주부였어요. 그러나 남편을 죽인 후에는 도살자로 변모했죠. 매우 드라마틱한 일이었어요. 상황적 역설은 형사들이 메리 말로니의 살인을 증거하는 양다리를 먹는 것입니다."
  },
  {
    role: "user", content: `I think the lamb symbolizes Mary. In the bible, usually the lamb symbolizes pure, innocent child of God. But in the novel, Mary becomes a murderer. So the lamb is going to the soughter, but the lamb it's self Is the slaughter.
    There are I Tronic situations in this novel. Frist, Mary killing her own hushand. In the opening of the novel, Mary waits for her husband with excitement. But later she kills he beloved hushand with her own hands.
    Second, she uses a food a leg of the lamb to kill him. And she even destoryed the evidence with the detectives. I really got goosebumps when Mary made the detectives eat the lamb and giggled.,
    위의 문장을 자연스러운 한국말로 번역해주세요.`
  },
  {
    role: "assistant", content: "양은 메리를 상징한다고 생각해요. 성경에서 양은 보통 하나님의 순수하고 결백한 아이를 상징합니다. "
      + "그러나 소설에서 메리는 살인자가 됩니다. 그래서 양은 도살당하러 가는 것이지만, 양 자체가 도살당하는 존재가 됩니다. 이 소설에는 역설적인 상황들이 있어요. "
      + "먼저, 메리가 자신의 남편을 죽입니다. 소설의 시작에서 메리는 남편을 기대하며 기다리지만 나중에는 그녀가 사랑하는 남편을 자신의 손으로 죽입니다. "
      + "둘째, 그녀는 양다리를 사용해 그를 죽입니다. 그리고 그녀는 형사들이 증거를 파괴하도록 합니다. 메리가 형사들에게 양을 먹이고 웃는 장면에서 정말 오싹한 느낌이었어요."
  },
  {
    role: "user", content: `Usually. The lamb means pure and innocent. But the camb symbolizes both sucrifice and violence in the story. Lamb symbolizes Mary's purity in the first part but lamb changes into Sanguinary Cruelty as a weapon for murder.
    First situational irony on the story can be find from Mary. The loving wife who is guessed to be victim transformed into cruel detective's consumption of evidence, the leg of lamb. 
    The detective murderer killing hushand second irony is Investigate the crime ate the evidence of murder.,
    위의 문장을 자연스러운 한국말로 번역해주세요.`
  },
  {
    role: "assistant", content: "보통 '양'은 순수하고 결백함을 의미합니다. 그러나 이 이야기에서는 양이 희생과 폭력을 상징합니다. "
      + "양은 처음에는 메리의 순수함을 상징하지만, 살인 무기로 변모한 피의 잔혹함이 되었습니다. 이 이야기에서 첫 번째 상황적 역설은 메리에서 찾을 수 있습니다. "
      + "피해자로 추정되는 사랑스러운 아내가 잔혹한 형사들의 증거물인 양다리를 먹이로 변해버렸습니다. "
      + "두 번째 역설은 범죄를 조사하던 형사가 살인의 증거물을 먹는 것입니다."
  },
  {
    role: "user", content: `${text}, 위의 문장을 자연스러운 한국말로 번역해주세요.`
  }
];
//9. 행동특성 및 종합의견
const gptBehaviorMsg = (selected) => [
  {
    role: "system", content: `당신은 '행동특성 및 종합의견'을 객관적 관찰자 시점으로 작성해야하는 교사임.
정의 '행동 특성 및 종합의견은' 학생의 교육활동에 근거한 전반적인 발달 과정과 성장 잠재력을 종합하여 교사의 의견을 작성한 문장임.
입력: [행동 특성],
출력: [행동 특성]에 기반하여 학생의 성장과 잠재력이 드러난 3-5문장의 교사의 종합 의견.
규칙: ${commonRule}
3) 행동 특성에 기반한 4-5문장의 평가문을 작성할 것.
4) 마지막 문장으로 학생의 종합 총평과 추후의 잠재력에 관한 문장을 작성할 것.`
  },
  //예시
  {
    role: "user",
    content: `[행동 특성]:
    -학업 태도: 수업 준비 철저, 바른 언행
    -메타 인지: 구체적 계획, 높은 실천력
    -공동체: 친구를 잘 도움  
    -교우관계: 다수에게 신뢰를 얻음
    -리더십: 동아리 회장, 관계 조율`
  },
  {
    role: "assistant", content: `교과 수업 시작 전에 항상 수업 준비를 갖추어 놓는 습관이 있으며, 수업 시간에도 언행을 바르게 하고 명랑한 얼굴로 급우들에게 친절하게 대하는 등 타인을 위한 이해와 배려심을 가지고 있음. 또한 수업 중에 친구가 수업 준비물을 가지고 오지 않았거나, 
    수업 활동에서 어려움을 겪고 있을 때 비난하지 않고, 모둠원들과 잘 어울릴 수 있도록 너그러운 마음을 가지고 조용히 도와주어 학급 친구들로부터 높은 신뢰를 얻고 있음. 토론 동아리 회장으로서 동아리 원들과 함께 토론 주제를 주별로 계획하고, 매주 목요일에 정기적으로 모임을 통해 토론 활동을 함. 
    토론 활동의 다양한 모형을 조사하여 모둠원들과 그 방법을 익히고, 주제 토론에서 사전자료를 조사하여 기조 발언 후 토론을 진행하는 등 구체적인 계획과 실천 능력이 뛰어난 학생임. 동아리 발표회를 준비하는 과정에서는 각자의 특성에 맞게 역할을 합리적으로 나누는 등 급우들의 관계를 잘 조율하는 모습이 돋보임.`
  },
  {
    role: "user",
    content: `[행동 특성]:
    -성격: 안정감, 조용함, 강인함, 논리적, 자의적 판단
    -교우관계: 부드러움
    -공동체: 어려운 일 자원
    -리더십: 관계 조율, 설득력 있음`
  },
  {
    role: "assistant", content: `평소 조용하고 안정감 있는 생활 태도를 가지고 있는 학생으로 어려운 일이 닥쳐도 쉽게 마음이 흔들리지 않는 강인한 면모를 지녔음. 
    혼자 생각하고 판단하기를 좋아하는 경향이 다소 있는 편이나 자신의 의견을 제시할 때에는 부드러우면서도 논리적으로 이야기하여 상대방을 설득하는 능력이 탁월함. 조별 과제를 할 때 다른 사람들의 의견을 다 듣고 난 후에야 자신의 생각을 
    이야기하고 남들이 비교적 맡기 힘들어하는 부분의 과제를 자원하면서 다른 조원들에게도 고루 개별 과제를 제시하는 등 다른 사람들과의 관계를 잘 조율하는 역량을 발휘함.`
  },
  {
    role: "user",
    content: `[행동 특성]:
    -학업 성취: 과학 성적 발전
    -성격: 다정함, 명랑함, 활기참
    -교우관계: 사교적, 따뜻한 관계 지향
    -1인1역: 기자
    -희망 진로: 과학 분야`
  }, {
    role: "assistant", content: `평소 학급의 에너지원으로 통할 정도로 매우 활기차게 생활하여 밝고 명랑한 학급 분위기를 형성하는데 큰 몫을 함. 다정하고 사교적인 성격으로 어려움이 있는 친구에게 먼저 다가가 고민을 들어주고 공감하며 위로의 말을 건넬 줄 아는 따뜻함을 지님. 
    교내 소식지 기자로서 멸종위기 식물사진전, 과학 독후감쓰기 등의 과학 행사를 취재하고 기사를 쓰면서 과학에 대한 흥미와 관심이 더욱 증대되어 본인도 과학자초청강연회 등에 적극적으로 참가함. 그 결과 학업 성취 면에서 많은 발전을 하여 자신감이 많이 향상되었으며 앞으로도 큰 발전이 있을 것으로 기대됨.`
  },
  { role: "user", content: `[행동 특성]:${selected.join("\n")}` }
];
//10. 단어 추출 문구
const gptExtractVocabMsg = (text) => [
  {
    role: "system", content: `당신은 영어 교사를 돕는 단어 추출 도우미입니다.
    제공된 [지문]에서 학생들이 어려워할 만한 핵심 영어 단어 또는 구를 1개 이상 10개 이하로 추출하세요.
    반드시 JSON 배열만 반환하세요. 설명, 번호, markdown 코드블록은 쓰지 마세요.
    각 항목은 {"word":"원형 단어 또는 구","meaning":"한국어 뜻"} 형식이어야 합니다.
    word는 가능한 원형으로 쓰고, meaning은 짧고 수업에서 바로 쓸 수 있게 쓰세요.
    예시: [{"word":"awareness","meaning":"인식"},{"word":"expense","meaning":"비용, 희생"}]`
  },
  //예시
  {
    role: "user", content: `[지문]: Winning turns on a self-conscious awareness that others are watching. 
    It’s a lot easier to move under the radar when no one knows you and no one is paying attention. You can mess up and be rough and get dirty because no one even knows you’re there.
    But as soon as you start to win, and others start to notice, you’re suddenly aware that you’re being observed. You’re being judged. You worry that others will discover your flaws and weaknesses, 
    and you start hiding your true personality, so you can be a good role model and good citizen and a leader that others can respect. 
    There is nothing wrong with that. But if you do it at the expense of being who you really are, making decisions that please others instead of pleasing yourself,
    you’re not going to be in that position very long. When you start apologizing for who you are, you stop growing and you stop winning. Permanently.
` },
  {
    role: "assistant", content: `[{"word":"awareness","meaning":"인식"},{"word":"expense","meaning":"비용, 희생"},{"word":"please","meaning":"기쁘게 하다"},{"word":"permanently","meaning":"영구히"},{"word":"personality","meaning":"성격"},{"word":"mess up","meaning":"망치다"}]`
  },
  {
    role: "user", content: `[지문]: Human beings like certainty. This liking stems from our ancient ancestors ① who needed to survive alongside saber-toothed tigers and poisonous berries. 
    Our brains evolved to help us attend to threats, keep away from ② them, and remain alive afterward. In fact, we learned that the more ③ certain we were about something, the better chance we had of making the right choice. 
    Is this berry the same shape as last time? The same size? If I know for certain it ④ is, my brain will direct me to eat it because I know it’s safe. And if I’m uncertain, 
    my brain will send out a danger alert to protect me. The dependence on certainty all those millennia ago ensured our survival to the present day, and the danger-alert system continues to protect us. 
    This is achieved by our brains labeling new, vague, or unpredictable everyday events and experiences as uncertain. Our brains then ⑤ generating sensations, thoughts, 
    and action plans to keep us safe from the uncertain element, and we live to see another day.
` },
  {
    role: "assistant", content: `[{"word":"stem from","meaning":"유래되다"},{"word":"certainty","meaning":"확실성"},{"word":"ancestor","meaning":"조상"},{"word":"evolve","meaning":"진화하다"},{"word":"threat","meaning":"위협"},{"word":"dependence","meaning":"의존"},{"word":"unpredictable","meaning":"예측할 수 없는"},{"word":"sensation","meaning":"감각"},{"word":"vague","meaning":"모호한"},{"word":"alert","meaning":"경고, 주의"}]`
  },
  {
    role: "user", content: `[지문]: Robert Blattberg and Steven Hoch noted that, in a changing environment, it is not clear that consistency is always a virtue
     and that one of the advantages of humanjudgment is the ability to detect change.Thus, in changing environments, it might be ① advantageous to combine human judgment
     and statistical models.Blattberg and Hoch examined this possibility by having supermarket managers forecast demand for certain products and then creating a composite forecast
     by averaging these judgments with the forecasts of statistical models based on ② past data.The logic was that statistical models ③ deny stable conditions 
     and therefore cannot account for the effects on demand of novel events such as actions taken by competitors or the introduction of new products. 
     Humans, however, can ④ incorporate these novel factors in their judgments.The composite ─ or average of human judgments and statistical models ─ proved to be more ⑤ accurate than either the statistical models or the managers working alone.
` },
  {
    role: "assistant", content: `[{"word":"consistency","meaning":"일관성"},{"word":"virtue","meaning":"미덕, 장점"},{"word":"advantageous","meaning":"유리한"},{"word":"composite","meaning":"복합체, 합성물"},{"word":"forecast","meaning":"예측하다"},{"word":"deny","meaning":"부정하다, 거부하다"},{"word":"stable","meaning":"안정된"},{"word":"incorporate","meaning":"포함하다, 통합하다"},{"word":"accurate","meaning":"정확한"},{"word":"judgment","meaning":"판단"}]`
  },
  { role: "user", content: `[지문]: ${text}` }
]
//시험 문제
const gptMakeExamMsg = ({ type, question, passage, level, target }) => {
  const exampleMap = {
    "글의 목적": purposeExData(type, question, passage, level),
    "심경, 분위기": feelingChangeExData(type, question, passage, level),
    "필자의 주장": authorMainPointExData(type, question, passage, level),
    "함축 의미": meaningExData(type, question, passage, level),
    "글의 요지": mainIdeaExData(type, question, passage, level),
    "글의 주제": thesisExData(type, question, passage, level),
    "글의 제목": titleExData(type, question, passage, level),
    "일치/불일치": trueFalseExData(type, question, passage, level),
    "어법 밑줄": grammarExData,
    "어휘 밑줄": lexisExData(passage),
    "빈칸 추론": blankExData(type, question, passage, level, target),
    "무관한 문장": nonRelatedExData(passage, level),
    // "글의 순서": sequenceExData,
    "문장 삽입": insertExData,
    "요약": summaryExData(type, question, passage, level),
  };
  const messages = exampleMap[type] ?? "";
  return [...messages];
}
//시험문제 리터치
const gptRetouchPassageMsg = (passage, request) => [
  {
    role: "system", content: `당신은 주어진 지문으로 수능 유형의 문제를 출제하는 교사를 보조하는 역할임.
    주어진 수능 [지문]을 교사의 [요구]에 맞게 적절히 수정해야 함.
    단, 원 [지문]의 내용을 변경하면 안됨. 아니라 단순히 문장의 표현 방식, 길이나 어휘 수준만 변경해야 함.`
  },
  {
    role: "user", content: `[지문]: As children, the principle of opposites is foreign. Children perceive words and their meanings separately from each other. It is only in later development that we understood that individual words directly connect to one another. 
    For many children, for instance, it is not clear that ‘Right’ is the opposite of ‘Left’. A vivid example of this can be seen when children learn to ride a bicycle. If parents tell their child “Don’t go to the left,” they will often find that the child will continue riding straight ahead and not automatically turn to the right.
      The same applies to the logical connection between ‘Yes’ and ‘No’ as perceived by parents. When we were children and were told, for example, “No, don’t eat with your hands,” we were confused and didn’t know what our parents expected from us. Our confusion was about whether we should continue eating or not and if so, how? 
      Only later did we recognize the connection and understand that we should continue eating, but not with our hands but with a fork or a spoon.
      [요구]: 위 지문은 고1 지문입니다. 지문 수준을 고3 수준으로 변경해주세요.`
  },
  {
    role: "assistant", content: `As children, the concept of opposites is not naturally understood. Young children tend to perceive words and their meanings as independent rather than relational. It is only through later cognitive development that we come to recognize how individual words are directly connected to one another. 
    For example, many children do not immediately understand that “right” is the opposite of “left.” A clear illustration of this can be observed when children learn to ride a bicycle. When parents tell a child, “Don’t go to the left,” the child often continues riding straight ahead instead of instinctively turning to the right. This occurs because the child does not yet grasp the oppositional relationship between the two directions.
    The same misunderstanding applies to the logical relationship between “yes” and “no,” as perceived by adults. When we were children and were told, for instance, “No, don’t eat with your hands,” we often felt confused about what was expected of us. Our confusion stemmed from uncertainty about whether we should stop eating altogether or continue eating in a different way. It was only later that we came to understand the implied connection: 
    we were expected to continue eating, but not with our hands—instead, using a fork or a spoon.`
  },
  {
    role: "user", content: `[지문]: As children, the principle of opposites is foreign. Children perceive words and their meanings separately from each other. It is only in later development that we understood that individual words directly connect to one another. 
    For many children, for instance, it is not clear that ‘Right’ is the opposite of ‘Left’. A vivid example of this can be seen when children learn to ride a bicycle. If parents tell their child “Don’t go to the left,” they will often find that the child will continue riding straight ahead and not automatically turn to the right.
      The same applies to the logical connection between ‘Yes’ and ‘No’ as perceived by parents. When we were children and were told, for example, “No, don’t eat with your hands,” we were confused and didn’t know what our parents expected from us. Our confusion was about whether we should continue eating or not and if so, how? 
      Only later did we recognize the connection and understand that we should continue eating, but not with our hands but with a fork or a spoon.
      [요구]: 위 지문을 요약해주세요`
  },
  {
    role: "assistant", content: `Urban regeneration projects in degraded areas are intended to enhance the wellbeing of residents and address environmental injustice. However, the development of new, high-quality green spaces can lead to a paradox: while these improvements increase neighborhood attractiveness, they also raise housing costs, potentially displacing low-income residents.
     Consequently, those who were meant to benefit from these green spaces may find themselves forced to relocate to similarly degraded areas with limited access to green infrastructure.`
  },
  {
    role: "user",
    content: `[지문]: ${passage}, [요구]:${request}`
  }
]
const gptRetouchOptionsMsg = (options, request) => [
  {
    role: "system", content: `당신은 주어진 지문으로 수능 유형의 문제를 출제하는 교사를 보조하는 역할임.
    주어진 수능 [선택지]를 교사의 [요구]에 맞게 적절히 수정해야 함.
      출력 형식 규칙
    - 영어 오지선다형 선택지는 영어로 작성.
    - 영어 오지선다형의 번호는 ①,②,③,④,⑤를 사용.
    - 오지선다형 선택지들을 구분하기 위해 선택지들 사이에 구분자 '</li>' 태그를 사용.`
  },
  {
    role: "user", content: `[선택지]: ① The paradox of urban green regeneration leading to resident displacement ② The role of community participation in designing green spaces ③ The environmental benefits of creating high-quality urban parks ④ The effects of green spaces on public health improvement ⑤ The economic challenges of funding urban regeneration projects.
      [요구]: 이 선택지들의 수준을 중3 수준으로 바꿔주세요.`
  },
  {
    role: "assistant", content: `① The problem that green development in cities can push residents out</li>② The importance of residents taking part in making green spaces</li>③ The good effects of well-made city parks on the environment</li>④ How green spaces affect people’s health</li>⑤ The cost problems of urban development projects`
  },
  { role: "user", content: `[선택지]: ${options}, [요구]:${request}` }
]
export {
  gptSubjectMsg, gptPerfRecordMsg, gptExtraRecordMsg, gptHomeroomMsg, gptKeywordMsg, gptOnTraitMsg, gptOnReportMsg, gptOverallMsg, gptTranslateMsg, gptBehaviorMsg, gptExtractVocabMsg,
  gptRetouchPassageMsg, gptRetouchOptionsMsg, gptMakeExamMsg
}
