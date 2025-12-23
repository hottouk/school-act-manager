const numbers = [18, 19, 20, 21, 22, 23, 24, 26, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
//글의 목적
const purposeExData = (type, question, text, level) => [
  {
    role: "user", content: `[유형]: 글의 목적, [발문]: 다음 글의 목적으로 가장 적절한 것은?, [지문]: Thank you for applying for the winter internship program. I’m writing this email to provide you with important information regarding the next step in your application process. Based on the materials you submitted, we’ve recognized your genuine interest in advancing your technical
    expertise and software development skills. As mentioned before, additional documentation is required before moving to the final stage. We kindly ask that you provide the original copies of the certificates you listed in your application.Please send the documentation via mail by November 7. Thank you., 
    [학년]: 고2`
  },
  {
    role: "assistant", content: `① To provide instructions on how to print the certificate online</li>② To announce a change in the interview schedule</li>③ To promote an internship program</li>④ To request the submission of the original certificate</li>⑤ To inform applicants that the internship program has been canceled<br>
      ⭐해설
      지문을 한 문장씩 핵심만 뽑아보면:
         “Thank you for applying for the winter internship program.”
         → 인턴십 지원에 대한 감사 인사(도입부)
        “I’m writing this email to provide you with important information regarding the next step in your application process.”
          → 지원 절차의 다음 단계 안내가 이 메일의 목적이라는 단서.
        “As mentioned before, additional documentation is required before moving to the final stage.”
          → 마지막 단계로 넘어가기 전에 추가 서류가 필요하다고 밝힘.
        “We kindly ask that you provide the original copies of the certificates you listed in your application.”
          → 지원서에 기재한 자격증의 원본을 제출해 달라는 요청이 핵심 내용.
        “Please send the documentation via mail by November 7.”
          → 언제까지, 어떤 방식으로 보낼지 구체적 지시.
          따라서 이 이메일의 주요 목적은 자격증 원본 제출을 요청하는 것입니다.그래서 정답은 ④입니다.
      ❌오답 분석
      ① 온라인 출력 방법 안내→ 글에서 “online printing”이나 출력 방법에 대한 언급 없음.
      ② 면접 일정 변경 공지→ 인터뷰(interview)나 일정 변경(change of schedule) 같은 표현 없음.
      ③ 인턴십 프로그램 홍보→ 이미 "지원한 사람들"에게 보내는 메일이고, 프로그램의 장점을 알리거나 참가를 권유하는 홍보 문구가 아님.
      ⑤ 인턴십 취소 알림→ 취소(canceled)라는 표현이 전혀 없고, 오히려 “다음 단계로 진행하기 위한 서류 제출”을 말하고 있음.`
  },
  {
    role: "user",
    content: `[유형]: ${type}, [발문]: ${question}, [지문]: ${text}, [학년]: ${level}`
  }
];
//심경, 분위기
const feelingChangeExData = (type, question, text, level) => [{
  role: "user", content: `[유형]: 심경, 분위기, [발문]: 다음 글에 드러난 Mike의 심경 변화로 가장 적절한 것은?, [지문]: Mike stared at the blinking cursor on the screen, his heart sinking deeper with each passing hour. He had rewritten the final sentence over and over, yet nothing felt right. The pressure to finish was mounting — he was so close, but the
words didn’t come to his mind. He buried his face in his hands with a deep sigh. Then, in the stillness, something sparked. With a rush, he typed a single sentence. A big smile spread across his face. “This is it! It’s perfect!” Mike shouted in joy, jumping up from his chair. He clapped his hands with
delight. It felt like the final puzzle piece sliding into place. He had finally completed what he had long dreamed of., [학년]: 고3`
},
{
  role: "assistant", content: `① joyful → regretful</li>② frustrated → happy</li>③ satisfied → guilty</li>④ angry → ashamed</li>⑤ anxious → calm
      <br>⭐해설
      정답은 ② frustrated → happy 입니다.
이유 설명: 처음에는 “heart sinking,” “rewritten over and over,” “pressure was mounting” 등에서 좌절(frustrated) 하고 있는 상태가 드러납니다.
하지만 영감이 떠오른 뒤에는 “A big smile,” “shouted in joy,” “clapped his hands with delight” 등에서 기쁨(happy/joyful) 을 느끼는 모습이 분명히 나타납니다.
따라서 Mike의 심경 변화로 가장 적절한 것은 ②번입니다.`
},
{
  role: "user",
  content: `[유형]: ${type}, [발문]: ${question}, [지문]: ${text}, [학년]: ${level}`
}];
//필자의 주장
const authorMainPointExData = (type, question, text, level) => [
  {
    role: "user", content: `[유형]: 필자의 주장, [발문]: 다음 글에서 필자가 주장하는 바로 가장 적절한 것은?, [지문]: Participating in extracurricular activities is a very good thing, but some people don’t know where to draw the line. The result? Joining too many clubs can reduce a large amount of your free time. This is especially true during certain crunch times. For example, if you work for a school newspaper and your deadline is approaching, 
    you know that you might have to spend evenings and even weekends making sure the paper is as perfect as you want it to be. Pacing is important. The point is this: If you don’t exercise some moderation in terms of your extracurricular activities, you can become awfully stressed out about the tasks you absolutely need to complete. So get involved in the activities that are most meaningful to you, and make sure you don’t overextend yourself.
    , [학년]: 고2`
  },
  {
    role: "assistant", content: `① Students should engage in various extracurricular activities to gain diverse experiences.</li>② They should choose extracurricular activities that match their interests and aptitudes.</li>③ They should refrain from participating in activities that require excessive costs.</li>④ They should take part in activities that help relieve stress.</li>⑤ They should pursue the extracurricular activity that is most meaningful to them.
      <br>⭐해설
      글의 핵심 메시지는 **"과도하게 많은 과외 활동에 참여하지 말고, 자신에게 가장 의미 있는 활동만 선택하라"**입니다.
      글에서는 다음과 같은 내용을 강조합니다:
      과외 활동은 좋지만 너무 많이 하면 시간 부족과 스트레스가 생긴다.
      Moderation(적당함) 과 pacing(속도 조절) 이 중요하다.
      마지막 문장: “Get involved in the activities that are most meaningful to you, and make sure you don’t overextend yourself.”
      → 즉, 가장 의미 있는 과외 활동만 선택하고 무리하지 말라는 것이 핵심 주장.
      ❌오답 분석
      ① 다양한 경험을 위해 여러 활동을 해야 한다→ 글의 취지와 반대. "너무 많이 하면 문제"라는 것이 핵심.
      ② 흥미와 적성에 맞는 활동 선택→ 비슷해 보이지만 글의 초점은 “흥미”가 아닌 “과도한 참여를 피하라”에 있음.
      ③ 비용 관련 언급 없음.
      ④ 스트레스 해소 활동을 하라는 내용 없음.→ 오히려 반대로, 과도한 활동이 스트레스를 유발할 수 있다고 말함.`
  },
  {
    role: "user",
    content: `[유형]: ${type}, [발문]: ${question}, [지문]: ${text}, [학년]: ${level}`
  }
];
//함축 의미
const meaningExData = (type, question, text, level) => [
  {
    role: "user", content: `[유형]: 함축 의미, [발문]: 밑줄 친 I am a general, my soldiers are the keys.가 다음 글에서 의미하는 바로 가장 적절한 것은?, [지문]: One consequence of the hierarchical organization of action is that when we reach for a cup of coffee, we do not need
to consciously activate the sequence of muscles to send our arm and hand out toward the cup. Instead, most action plans are made at a higher level — we want to taste the coffee, and our arm, hand, and mouth coordinate to make it so. This means that in a skilled task such as playing the piano, there
is a delicate ballet between conscious plans unfolding further up the hierarchy (choosing how fast to play, or how much emphasis to put on particular passages) and the automatic and unconscious aspects of motor control that send our fingers toward the right keys at just the right time. When
watching a concert pianist at work, it seems as though their hands and fingers have a life of their own, while the pianist glides above it all, issuing commands from on high. As the celebrated pianist Vladimir Horowitz declared, “I am a general, my soldiers are the keys.”, [학년]: 고3`},
  {
    role: "assistant", content: `① It is unrealistic to expect precise implementation of every command at all times.</li>② Musicians must achieve perfect finger independence for outstanding performance.</li>③ When motor skills operate, they are actually being commanded by higher-level consciousness.</li>④ Artistic excellence can be achieved only when preceded by tremendous amount of practice.</li>⑤ A physical reaction occurs automatically, independent of a performer’s deliberate intention.
      <br>⭐해설
      정답은 ③번입니다.
      지문은 행동이 위계적으로 조직되어 있다는 점을 설명합니다. 즉, 우리는 개별 근육 하나하나를 의식적으로 조절하지 않고, 상위 수준의 목표(예: 커피를 마시고 싶다, 어떤 속도로 연주할지 결정한다)가 하위 수준의 자동적 움직임을 지휘한다는 것입니다.이 맥락에서 Vladimir Horowitz의 말
“I am a general, my soldiers are the keys.” 는 연주자는 ‘지휘관’처럼 전체적인 계획과 의도를 세우고,
**손가락과 키의 움직임은 그 명령을 자동적으로 수행하는 ‘병사’**라는 비유입니다.
따라서 이 문장이 의미하는 바로 가장 적절한 것은
운동 기술이 작동할 때, 그것은 상위 수준의 의식에 의해 지휘된다
라는 내용이며, 이는 ③번과 정확히 일치합니다.
      ❌오답 분석
① 모든 명령이 항상 정확히 실행되지 않는다는 내용 → 지문 핵심 아님
② 손가락의 완벽한 독립성 강조 → 비유의 초점 아님
④ 많은 연습의 필요성 → 지문 일부 맥락이지만 인용문의 의미는 아님
⑤ 의도와 무관한 자동 반응 → 상위 의식의 지휘를 부정하므로 반대`},
  { role: "user", content: `[유형]: ${type}, [발문]: ${question}, [지문]: ${text}, [학년]: ${level}` }
];
//글의 요지
const mainIdeaExData = (type, question, text, level) => [
  {
    role: "user", content: `[유형]: 글의 요지, [발문]: 다음 글의 요지로 가장 적절한 것은?, [지문]: Our yearning for belonging is so hardwired that we often try to acquire it by any means possible, including trying to fit in and working hard for approval and acceptance. Not only are these efforts hollow substitutes for belonging, but they are the greatest barriers to belonging. When we work
    to fit in and be accepted, our “belonging” is unstable. If we do or say something that’s true to who we are but outside the expectations or rules of the group, we risk everything. If people don’t really know who we are and what we believe or think, there’s no true belonging. Because we can feel
    belonging only if we have the courage to share our most authentic selves with people, our sense of belonging can never be greater than our level of self-acceptance. We can never truly belong if we are betraying ourselves, our ideals, or our values in the process. That is why it’s a mistake to
    think that belonging is passive and simply about joining or “going along” with others. It’s not., [학년]: 고2`},
  {
    role: "assistant", content: `① One can feel a true sense of belonging when one reveals oneself just as one is.</li>② One can achieve genuine self-realization only when one escapes the expectations of others.</li>③ It is necessary to examine whether the group one wishes to join is compatible with one’s own tendencies.</li>④ At times, an individual’s preferences are not sufficiently reflected in the goals of the group.</li>⑤ Self-acceptance becomes possible when one is able to acknowledge others’ criticism.
      <br>⭐해설
      지문의 핵심은 *“참된 소속감은 진짜 모습을 드러낼 때만 느낄 수 있다”*입니다. 글의 내용을 핵심 문장만 뽑아보면:
      “Trying to fit in and working hard for approval… are hollow substitutes for belonging.”
        → 맞추려는 노력은 소속감의 대체물이 될 뿐
        “If people don’t really know who we are... there’s no true belonging.”
        → 진짜 나를 보여주지 않으면 진정한 소속감은 없다.
        “We can feel belonging only if we have the courage to share our most authentic selves…”
        → 진정한 자아를 드러낼 때만 소속감을 느낄 수 있다.
        “Our sense of belonging can never be greater than our level of self-acceptance.”
        → 자기수용 → 소속감의 조건
        “It’s a mistake to think belonging is passive or just ‘going along.’”
        → 단순히 따라가는 것이 아니라 스스로를 드러내는 적극적인 행위임을 강조
        → 즉, 있는 그대로의 나를 보여줄 때 비로소 진정한 소속감을 느낄 수 있다가 글의 요지입니다.
        따라서 정답은 ①.
      ❌오답 분석
      ② 타인의 기대에서 벗어나야 자아실현 가능→ 내용의 일부와 비슷한 느낌은 있으나, 글의 주제는 “자아실현”이 아니라 “소속감”.
      ③ 가입하려는 집단이 성향과 맞는지 살펴보라→ 집단 선택이 아니라 자기 진정성이 핵심.
      ④ 개인 선호가 집단 목표에 반영되지 않는다→ 집단 목표 언급 없음.
      ⑤ 타인의 비판을 인정할 때 자기수용 가능→ 글에서 말하는 자기수용은 “비판 인정”과 연결되지 않음.`},
  { role: "user", content: `[유형]: ${type}, [발문]: ${question}, [지문]: ${text}, [학년]: ${level}` }
];
//글의 주제
const thesisExData = (type, question, text, level) => [
  {
    role: "user", content: `[유형]: 글의 주제, [발문]: 다음 글의 주제로 가장 적절한 것은?, [지문]: Places today have become exhibitions of themselves. Through heavy investment in architecture, art, design, exhibition space, landscaping and various kinds of redevelopment towns, cities and countryside pronounce their possession of various cultural values — such as unchanging
nature, the historic past, the dynamic future, multiculturalism, fun and pleasure, artistic creativity or simply stylishness. These cultural values have come to be seen as a place’s identity, the possession of which is key to the important task of attracting visitors. And this identity is expected to be
easily accessed by those visitors or, to use a currently favoured term in urban design, to be legible. Places whose identity seems inaccessible, confusing or contradictory do not present themselves as destinations. They do not, in other words, seem visitable. An identity that is not pointed to in
the form of well­restored or beautifully designed buildings, artworks, shopping plazas, streets, walkways or gardens does not compose itself into a view nor offer itself as an ‘experience’. To avoid such a fate, places should ‘make the most of themselves’. In this way, they can find their niche in
the new cultural economy of visitability., [학년]: 고2`},
  {
    role: "assistant", content: `① importance of places showcasing a clear cultural identity</li>② need for preserving traditional lifestyles from urbanization</li>③ benefits of mixing foreign and local culture to attract tourists</li>④ impact of globalization in weakening the uniqueness of location</li>⑤ role of citizen participation in shaping urban identity and design
    <br>
  1. 현대의 장소들은 스스로를 ‘전시’하는 공간이 되어가고 있다.
  건축, 예술, 디자인 등을 통해 문화적 가치를 드러냄.
  2. 이런 문화적 가치는 ‘장소의 정체성’으로 간주되며 방문객 유치의 핵심 요소임.
  → ‘읽히기 쉬운(legible)’ 정체성이 필요.
  3. 정체성이 모호하면 방문할 만한 곳으로 보이지 않음.
  4. 장소는 스스로를 잘 드러내야(make the most of themselves) 경쟁력을 가짐.
  따라서 글의 주제는 “장소가 명확하고 쉽게 인지될 수 있는 문화적 정체성을 드러내야 방문객을 유치할 수 있다.” 이며 정답은 ①
  ② 전통적 생활 방식 보존 → 언급 없음.
  ③ 외래 문화 + 지역 문화 혼합 → 일부 예시는 있지만 글의 중심 아님.
  ④ 세계화가 장소의 고유성을 약화 → globalization 언급 없음.
  ⑤ 시민 참여의 역할 → 전혀 언급되지 않음.`},
  { role: "user", content: `[유형]: ${type}, [발문]: ${question}, [지문]: ${text}, [학년]: ${level}` }
];

//글의 제목
const titleExData = (type, question, text, level) => [
  {
    role: "user", content: `[유형]: 글의 제목, [발문]: 다음 글의 제목으로 가장 적절한 것은?, [지문]: For most people, the word “property” just refers to “stuff”: land, yes, but also the structures on that land, as well as physical possessions and even intangibles like ideas or radio frequencies. If you can own it, or claim some kind of right
to it, it’s property. But sociologists and anthropologists have observed that in human societies, property rights systems aren’t really about “stuff”; they’re about people. More specifically, a property right isn’t a relationship between a person and an object, it’s an agreement between people about
the object. And these agreements aren’t limited to written deeds and titles, or other property laws in a society. Becher explained that a sociologist like herself “would see property as a kind of social agreement. Property rights certainly exist in writing, in law, and that’s part of what they are. But
they’re really only real to the extent that we respect them. [So, property rights are, in a sense,] claims that people make that get respected by others. So they’re always social.”, [학년]: 고2`},
  {
    role: "assistant", content: `① How Can We Build Agreement When Reforming Property Law?</li>② Rethinking Property: Understanding It as a Social Agreement</li>③ The Growing Importance of Protecting Private Property</li>④ Social Duty: Reframing Possession as Collective Goods</li>⑤ New Insight on Property as a Timeless Asset<br>
       정답: ②, ⭐해설
      글의 핵심 내용을 정리하면:
        1. 일반적으로 property(재산)는 ‘물건’으로 이해됨
        토지, 건물, 소유물, 심지어 아이디어나 주파수 같은 무형 자산까지 포함
        즉, 우리는 보통 재산 = 소유 가능한 것이라고 생각함.
        2. 그러나 사회학적 관점에서는 property는 “사람 간의 관계”
        재산권은 사람과 물건의 관계가 아니라, 사람들 사이의 합의임.
        법적 문서나 제도는 그 합의의 일부일 뿐,
        → 사람들이 그것을 인정할 때만 재산권이 실제로 존재함
        즉, 재산권이란 사회적 합의(social agreement) 로 유지되는 것.
        → 글 전체의 주장은:
        “재산(property)을 물질이 아닌 사회적 합의로 재고해야 한다.”
        따라서 제목으로 가장 적절한 것은 ②.
      ❌오답 분석
      ① 재산법 개혁 시 합의를 어떻게 구축할까?→ 글은 재산법 개혁을 논의하지 않음.
      ③ 사유 재산 보호의 중요성 증가→ 보호 필요성이나 증가라는 주장 없음.
      ④ 소유를 공동의 재화로 재정의해야 한다→ collective goods(공동 재화) 관련된 내용 없음.
      ⑤ 재산을 시대를 초월한 자산으로 보는 새로운 통찰→ timeless asset(시대 초월적 자산)이라는 관점과 무관.`  },
  {
    role: "user",
    content: `[유형]: ${type}, [발문]: ${question}, [지문]: ${text}, [학년]: ${level}`
  }
];
//일치/불일치
const trueFalseExData = (type, question, text, level) => [
  {
    role: "user", content: `[유형]: 일치/불일치, [발문]: 다음 글의 내용과 일치하지 않는 것은?, [지문]: Born in 1845 in Boston, Mary Eliza Mahoney was known as the first African American nurse in the United States. She attended the Phillips School in Boston, one of the first integrated schools in the United States. When she was in her teens, Mahoney knew that she wanted to become a nurse. To
work towards her goal, Mahoney began working at the New England Hospital for Women and Children, which operated one of the first nursing schools in the United States. She was admitted to its nursing program in 1878 at the age of 33. Upon graduation, she became a private duty nurse. In 1908, Mahoney co-founded the National Association of Colored Graduate Nurses (NACGN) to promote equality for African American nurses. Recognizing that Mahoney served as an outstanding role model for nurses of all races, NACGN created the Mary Mahoney Award in 1936.
[학년]: 고2`
  },
  {
    role: "assistant", content: `① She attended the Phillips School in Boston.</li>② She wanted to become a nurse during her teenage years.</li>③ She was accepted into a nursing program at the age of thirty-three.</li>④ She single-handedly founded the NACGN in 1908.</li>⑤ In 1936, the NACGN established the Mary Mahoney Award.<br>
    ⭐풀이
  각 문장이 원문과 일치하는지 확인해보면 다음과 같습니다:
  ① She attended the Phillips School in Boston.
  → 원문: “She attended the Phillips School in Boston …”  → 일치
  ② She wanted to become a nurse during her teenage years.<br>
  → 원문: “When she was in her teens, Mahoney knew that she wanted to become a nurse.”  → 일치
  ③ She was accepted into a nursing program at the age of thirty-three.
  → 원문: “She was admitted to its nursing program in 1878 at the age of 33.”  → 일치
  ④ She single-handedly founded the NACGN in 1908.
  → 원문: “Mahoney co-founded the National Association of Colored Graduate Nurses (NACGN).”
  → co-founded = 공동 설립했다
  → single-handedly founded = 혼자 설립했다 → 의미 불일치  → 불일치 (정답)
  ⑤ In 1936, the NACGN established the Mary Mahoney Award.
  → 원문: “NACGN created the Mary Mahoney Award in 1936.”
  → 일치
정답: ④
`},
  {
    role: "user",
    content: `[유형]: ${type}, [발문]: ${question}, [지문]: ${text}, [학년]: ${level}`
  }]
  ;
const grammarBoxExData = [];
//어법 밑줄
const grammarExData = [
  {
    role: "user", content: `[유형]: 어법 밑줄, [발문]: 다음 글의 밑줄 친 부분 중, 어법상 틀린 것은?, [지문]: The physical act of movement in the morning is not just beneficial for the body — it serves as a powerful stimulant for the brain, awakening it from the stillness of sleep and preparing it for the demands of the day. This awakening goes beyond physical health; it plays a critical role in enhancing
cognitive function, particularly in the realms of creativity and imagination. One of the key mechanisms which this occurs is increased blood flow to the hippocampus, a part of the brain responsible for memory, learning, and the creation of new ideas. The hippocampus, often described as the brain’s center for imagination and memory consolidation, thrives on the increased oxygenation and nutrients provided byphysical movement. Studies published in journals highlight the positive effects of regular morning exercise on cognitive flexibility and creative thinking, confirming that exercise not
only promotes physical health but also stimulates neural plasticity — the brain’s ability to reorganize itself by forming new neural connections. This adaptability is essential for creative thought, as it allows individuals to approach problems from new angles, make novel associations, and think more differently., [학년]: 고2`},
  {
    role: "assistant", content: `<h6>다음 글의 밑줄 친 부분 중, 어법상 틀린 것은?</h6>
      <span>The physical act of movement in the morning is not just beneficial for the body — it serves as a powerful stimulant for the brain, ① <u>awakening</u> it from the stillness of sleep and preparing it for the demands of the day. This awakening goes beyond physical health; it plays a critical role in enhancing
        cognitive function, particularly in the realms of creativity and imagination. One of the key mechanisms ② <u>which</u> this occurs is increased blood flow to the hippocampus, a part of the brain responsible for memory, learning, and the creation of new ideas. The hippocampus, often described as the brain’s
        center for imagination and memory consolidation, thrives on the increased oxygenation and nutrients ③ <u>provided</u> by physical movement. Studies published in journals highlight the positive effects of regular morning exercise on cognitive flexibility and creative thinking, confirming that exercise not
        only promotes physical health but also stimulates neural plasticity — the brain’s ability to reorganize ④ <u>itself</u> by forming new neural connections. This adaptability is essential for creative thought, as it allows individuals ⑤ <u>to approach</u> problems from new angles, make novel associations, and
        think more differently.</span>
      <h6>⭐해설</h6>
      <span>One of the key mechanisms which this occurs is increased blood flow…
        여기서 which는 관계대명사로 쓰였지만, 뒤에 **완전한 절(this occurs)**이 이미 있으므로 관계대명사를 사용할 수 없는 구조가 됩니다.
        즉, One of the key mechanisms + 완전한 절 은 어법상 성립하지 않습니다.
        올바른 형태는 전치사 + 관계대명사를 사용한 “by which this occurs” 또는 “through which this occurs”
        그래야 “이것이 일어나는 메커니즘”이라는 의미가 자연스럽게 연결됩니다.
        따라서 올바른 문장은 다음과 같습니다:
        One of the key mechanisms by which this occurs is increased blood flow.</span>
      문장에서 ②가 포함된 부분을 보면:
      <h6>❌다른 보기들은 왜 맞는가?</h6>
      <ul>
        <li>① awakening → 분사구문으로 완전하게 맞음.</li>
        <li>③ provided → “nutrients provided by physical movement” = 과거분사 수식, 자연스러움.</li>
        <li>④ itself → neural plasticity의 정의 설명에서 재귀대명사 사용 적절.</li>
        <li>⑤ to approach → to 부정사의 목적 표현에 적절함.</li>
      </ul>`
  }];
const lexisBoxExData = [];
//어휘 밑줄
const lexisExData = [
  {
    role: "user", content: `[발문]: 다음 글의 밑줄 친 부분 중, 문맥상 낱말의 쓰임이 적절하지 않은 것은?
    [지문]: Information is an important ingredient for good decision-making. And so, a variety of guardrails exist that shape what information is available. For instance, in the United States, corporate disclosure laws limit what a company’s executives can share publicly and when. Share too
much information and you risk being fined. In other contexts, the reverse is true, and one is forbidden to make public certain information. Pharmaceutical companies need to disclose possible side effects for the drugs they manufacture and the food industry needs to put nutritional labels on most of their
products. Sometimes, such a l’obligation d’information, as the French call it poetically, may apply to a company’s clients. Insurance policies are an example. The insured is typically under a duty to disclose material facts that affect the risk to the insurer. In a similar way, the state itself makes
available a wide variety of information to help individuals make better decisions. Laws are made public so that citizens can obey them, at least in democratic states. Public registers, such as for corporations or landownership, help people decide whether to engage in a business transaction.`},
  {
    role: "assistant", content: `<h6>다음 글의 밑줄 친 부분 중, 문맥상 낱말의 쓰임이 적절하지 않은 것은?</h6>
    <span>Information is an important ingredient for good decision-making. And so, a variety of guardrails ① <u>exist</u> that shape what information is available. For instance, in the United States, corporate disclosure laws ② <u>limit</u> what a company’s executives can share publicly and when. Share too
much information and you risk being fined. In other contexts, the reverse is true, and one is ③ <u>forbidden</u> to make public certain information. Pharmaceutical companies need to disclose possible side effects for the drugs they manufacture and the food industry needs to put nutritional labels on most of their
products. Sometimes, such a l’obligation d’information, as the French call it poetically, may apply to a company’s clients. Insurance policies are an example. The insured is typically under a duty to ④ <u>disclose</u> material facts that affect the risk to the insurer. In a similar way, the state itself makes
available a wide variety of information to help individuals make better decisions. Laws are made ⑤ <u>public</u> so that citizens can obey them, at least in democratic states. Public registers, such as for corporations or landownership, help people decide whether to engage in a business transaction.</span>
  
<h6>⭐해설</h6>
<p>
  지문은 정보 제공을 둘러싼 규제(guardrails)가 때로는 정보를 제한하고, 때로는 반대로 공개를 의무화한다는 점을 설명하고 있습니다. 각 단어가 문맥에 맞는지 확인해보면 다음과 같습니다.<br><br>
  <strong>① exist</strong><br>
  “a variety of guardrails exist” → 여러 규제가 존재한다는 자연스러운 표현 → <strong>적절</strong><br><br>
  <strong>② limit</strong><br>
  기업 정보 공개법이 무엇을 공유할 수 있는지 제한한다 → <strong>적절</strong><br><br>
  <strong>③ forbidden</strong> ← <span style="color:red;"><strong>❌ 부적절</strong></span><br>
  문장: “the reverse is true, and one is forbidden to make public certain information.”<br>
  문법적으로 맞지만 **문맥과 충돌**합니다.<br><br>
  바로 앞 문장: “너무 많은 정보를 공개하면 벌금”<br>
  → 뒤 문장: “반대로, 공개를 해야 하는 상황도 있다”가 되어야 함.<br><br>

  하지만 forbidden(금지된)은 **‘공개하면 안 되는 상황’**을 의미하여 오히려 앞 문장과 같은 방향으로 가버림 → 문맥상 완전 불일치.<br>
  이 자리에 자연스러운 단어: required, obliged, expected 등.<br><br>

  <strong>④ disclose</strong><br>
  보험 계약자가 보험사에 중요한 사실을 공개해야 한다 → disclosure duty와 일치 → <strong>적절</strong><br><br>
  <strong>⑤ public</strong><br>
  “laws are made public” → 법은 공개된다 → <strong>자연스러움</strong>
</p>
<p><strong>정답: ③ forbidden</strong></p>`
  }];
//빈칸 추론
const blankExData = (type, question, text, level) => [
  {
    role: "user", content: `[유형]: 빈칸 추론, [발문]: 다음 빈칸에 들어갈 말로 가장 적절한 것은?, [지문]: As a general rule, when the individuals of a population encounter a new environmental stress, some individuals in the population will die prematurely and some individuals will survive. If the reason for their survival (such as a slightly
enhanced ability or trait) can be passed on to their offspring (that is, it’s genetically encoded), then the next generation should be better able to withstand the newly encountered environmental stress, and the population overall will be less susceptible to it. Therefore, the key to the ability of a population to survive by adaptation lies in the rapidity with which the next generation, the more resistant generation, is produced by the survivors of this generation. It follows that those species capable of producing
a new generation very quickly should be better able to respond to a stress very quickly. Those species that require more time for reproduction will be slower to adapt to the stress because of the additional time needed for them to produce stress-tolerant offspring, [학년]: 고2, 
[추가 규칙]: 1. 주어진 지문의 주제나 세부사항과 관련된 단어나 문장을 ___________ 로 치환하기.
2. 치환된 기존의 단어나 문장을 정답으로 하는 4개의 distractors를 영작하여 오지선다형 선택지를 제공하기.
3. ___________을 포함한 지문도 해설 이후에 <br> 태그로 구분해서 제공바람.`},
  {
    role: "assistant", content: `① rapidity</li>② precision</li>③ simplicity</li>④ consistency</li>⑤ randomness</li>
    <br>⭐ 해설
  글의 핵심 흐름은 다음과 같습니다.
  ● 환경적 스트레스 발생 → 일부 개체 사망, 일부는 생존
  ● 생존 이유가 유전되면 → 다음 세대는 더 강해짐
  ● 따라서 “다음 세대가 얼마나 빨리 생성되는가”가 적응의 핵심
  문제 문장:
  “the key … lies in the ( ) with which the next generation … is produced”
  즉, 의미는 “세대가 교체되는 속도가 적응의 핵심이다.”
  속도를 의미하는 단어는 rapidity
  따라서 정답은 ① rapidity
❌ 오답 분석
② precision: 정확성과 적응 속도는 무관.
③ simplicity: 단순성은 세대교체 속도와 연결되지 않음.
④ consistency: 일관성은 적응의 ‘속도’를 설명하지 못함.
⑤ randomness: 무작위성은 돌연변이 개념과는 관련 있으나 세대 생산 속도와는 무관.
정답: ① rapidity
<br>As a general rule, when the individuals of a population encounter a new environmental stress, some individuals in the population will die prematurely and some individuals will survive. If the reason for their survival (such as a slightly enhanced ability or trait) can be passed on to their offspring (that is, it’s genetically encoded), then the next generation should be better able to withstand the newly encountered environmental stress, and the population overall will be less susceptible to it. Therefore, the key to the ability of a population to survive by adaptation lies in the ___________ with which the next generation, the more resistant generation, is produced by the survivors of this generation. It follows that those species capable of producing a new generation very quickly should be better able to respond to a stress very quickly. Those species that require more time for reproduction will be slower to adapt to the stress because of the additional time needed for them to produce stress-tolerant offspring.
`},
  {
    role: "user",
    content: `[유형]: ${type}, [발문]: ${question}, [지문]: ${text}, [학년]: ${level},
    [추가 규칙]: 1. 주어진 지문의 주제나 세부사항과 관련된 단어나 문장을 ___________ 로 치환하기.
2. 치환된 기존의 단어나 문장을 정답으로 하는 4개의 distractors를 영작하여 오지선다형 선택지를 제공하기.
3. ___________을 포함한 지문도 해설 이후에 <br> 태그로 구분해서 제공바람.`
  }];
//무관한 문장
const nonRelatedExData = [
  {
    role: "user", content: `[유형]: 무관한 문장, [발문]: 다음 글에서 전체 흐름과 관계 없는 문장은?, [지문]: We often use the word ignorance to denote a primitive or foolish set of beliefs. In fact, I would say that “explanation” is often primitive or foolish, and the recognition of ignorance is the beginning of scientific discourse. When we admit
that something is unknown and inexplicable, then we admit also that it is worthy of investigation. David Helfand, the astronomer, traces how our view of the wind evolved from the primitive to the scientific: first “the wind is angry,”followed by “the wind god is angry,” and finally “the wind is a measurable form of energy.” 
The first two statements provide a complete explanation but are clearly ignorant; the third shows our ignorance (we can’t predict or alter the weather yet) but is surely less ignorant. It is undeniable that ignorance stands as the greatest barrier to scientific discovery and thus it fails to function as a support to scientists. Explanation rather than ignorance is the hallmark of intellectual narrowness., [학년]: 고2,
[추가 규칙]: 1. 주어진 지문의 전체 문장 개수가 6개 이하인 경우 '지문은 최소 6문장 이상이 되어야 합니다.' 출력하기
2. 주어진 지문의 전체 주제와 관련 없지만 관련 있는 것처럼 보이는 단어로 1개 무관한 문장을 영작하기.
3. 무관한 문장을 기존 지문의 문장들 사이에 삽입하기. 단, 무관한 문장은 글의 처음에 올 수 없음.
4. 이렇게 생성된 새 지문에서 끝 문장부터 순서대로 ⑤,④,③,②,①을 각 문장 맨 앞에 붙여 넘버링하기.
5. 최종적으로 선택지를 ①,②,③,④,⑤로 제공 후 <br>정답과 해설 <br>넘버링 된 지문 순으로 제공.`},
  {
    role: "assistant", content: `①</li>②</li>③</li>④</li>⑤
<br>⭐ 해설
  글의 전체 흐름은 다음과 같습니다.
  ● 우리는 흔히 ignorance(무지)를 원시적·어리석다고 보지만,
  ● 실제로는 ‘무지를 인정하는 것’이 과학적 탐구의 출발점이다.
  ● 오히려 성급한 설명(explanation)이 더 원시적일 수 있다.
  즉, 이 글은 **무지의 긍정적·탐구 촉진적 역할**을 강조하고 있습니다.
  보기 문장들을 검토해보면:
  ① 무지를 인정하는 것은 탐구의 시작이라는 주장과 완전 일치 → 적절
  ② Helfand의 사례 제시로 주장 뒷받침 → 적절
  ③ 예시 분석으로 “무지를 인정하는 것이 더 과학적”이라는 논지를 강화 → 적절
  ④ “무지는 과학적 발견의 가장 큰 장애물”이라고 주장
  → 글 전체 주장(무지가 탐구를 시작하게 한다)과 정면으로 충돌
  → 글의 흐름과 무관하며 오히려 모순되는 문장
  ⑤ 오히려 설명(explanation)이 지적 편협의 특징이라는 주장 → 원문과 부합 → 적절
정답: ④
<br>We often use the word ignorance to denote a primitive or foolish set of beliefs. In fact, I would say that “explanation” is often primitive or foolish, and the recognition of ignorance is the beginning of scientific discourse. ① When we admit
that something is unknown and inexplicable, then we admit also that it is worthy of investigation. ② David Helfand, the astronomer, traces how our view of the wind evolved from the primitive to the scientific: first “the wind is angry,”
followed by “the wind god is angry,” and finally “the wind is a measurable form of energy.” ③ The first two statements provide a complete explanation but are clearly ignorant; the third shows our ignorance (we can’t predict or alter the
weather yet) but is surely less ignorant. ④ It is undeniable that ignorance stands as the greatest barrier to scientific discovery and thus it fails to function as a support to scientists. ⑤ Explanation rather than ignorance is the hallmark of intellectual narrowness.`},
];
//글의 순서
const sequenceExData = [
  {
    role: "user", content: `[발문]: 주어진 글 다음에 이어질 글의 순서로 가장 적절한 것은?
    [지문]: Some propositions about lotteries are extremely likely to be true. Consider the proposition ‘any given ticket in a ten-million ticket lottery is a losing ticket’.Despite being overwhelmingly likely to be true, many philosophers think that such propositions, 
    based on probabilities alone, are different from other propositions we regularly rely upon. It’s been popular to suppose, for instance, that we don’t know that we have lost the lottery just by reflecting on how unlikely winning is. This is puzzling, because there are many things we take ourselves to know even though we presumably have more than a 
    one-in-ten-million chance of being wrong. For example, you might know you will attend a meeting later, even though occasionally meetings get cancelled unexpectedly — and surely more frequently than one-in-ten-million meetings! 
    If we want to avoid conceding that the scope of our knowledge is much more limited than usually supposed, there must be some difference between the probabilistic evidence we have about the lottery and evidence for regular things that we do know.`},
  {
    role: "assistant", content: `<h6>주어진 글 다음에 이어질 글의 순서로 가장 적절한 것은?</h6>
    <span>
      Some propositions about lotteries are extremely likely to be true. Consider the proposition ‘any given ticket in a ten-million ticket lottery is a losing ticket’.
      (A) If we want to avoid conceding that the scope of our knowledge is much more limited than usually supposed, there must be some difference between the probabilistic evidence we have about the lottery and evidence for regular things that we do know.
      (B) Despite being overwhelmingly likely to be true, many philosophers think that such propositions, based on probabilities alone, are different from other propositions we regularly rely upon. It’s been popular to suppose, for instance, that we don’t know that we have lost the lottery just by reflecting on how unlikely winning is.
      (C) This is puzzling, because there are many things we take ourselves to know even though we presumably have more than a one-in-ten-million chance of being wrong. For example, you might know you will attend a meeting later, even though occasionally meetings get cancelled unexpectedly — and surely more frequently than one-in-ten-million meetings!
    </span>
    <ul>
      <li>① (A) - (C) - (B)</li>
      <li>② (B) - (A) - (C)</li>
      <li>③ (B) - (C) - (A)</li>
      <li>④ (C) - (A) - (B)<li>
      <li>⑤ (C) - (B) - (A)</li>
    </ul>
    <h6>⭐ 해설</h6>
<p>
  <strong>주어진 글의 흐름</strong><br><br>
  ● 로터리(복권) 명제: “각 티켓은 질 가능성이 매우 높다.”<br>
  ● 그러나 “매우 가능성이 높은 명제 = 우리가 안다고 할 수 있는가?”라는 철학적 문제 제기.<br>
  → 이어지는 문장은 로터리 명제는 확률이 높아도 ‘알고 있다’고 말하기 어렵다는 철학적 입장을 소개해야 자연스럽습니다.
</p>
<p>
  <strong>(B)</strong> 확률만으로 아는 것과 일상적 지식은 다르다고 철학자들이 본다. 우리는 ‘당첨 가능성이 낮다고 해서 내가 졌다고 아는 것은 아니다’ 고 본다.<br>
  → 로터리 문제와 직접 연결되는 철학적 주장 제시 (자연스러운 다음 흐름)<br>
  → 따라서 <strong>첫 번째 위치</strong>에 적합.
</p>
<p>
  <strong>(C)</strong> 그런데 이것이 이상하다. 우리는 일상에서 ‘더 자주 틀릴 가능성이 있는’ 일도 안다고 생각한다.<br>
  → (B)의 주장에 대한 <strong>반박(문제 제기)</strong> 역할<br>
  → (B) 다음에 와야 논리가 맞음.
</p>
<p>
  <strong>(A)</strong> 지식의 범위가 지나치게 좁아지는 것을 원하지 않는다면, 로터리와 일상적 지식 사이에 차이를 찾아야 한다.<br>
  → (C)에서 드러난 “이상함”을 해결하는 <strong>방향 제시</strong><br>
  → 즉, 문제 제기 → 해결 방향 제안 흐름.
</p>
<p>
  <strong>전체 자연스러운 순서</strong><br>
  1) (B) 확률 기반 명제는 우리가 ‘안다’고 말하는 다른 명제들과 다르다고 철학자들이 주장<br>
  2) (C) 그러나 이 주장에는 문제가 있음 (일상 지식도 비슷한 수준의 불확실성 존재)<br>
  3) (A) 따라서 로터리와 일상 지식 간의 차이를 구분해야 한다는 결론 제시
</p>`}];
//문장 삽입
const insertExData = [
  {
    role: "user", content: `[발문]: 글의 흐름으로 보아, 주어진 문장이 들어가기에 가장 적절한 곳은?
    [지문]: Since its invention at the end of the nineteenth century, the automobile remained a machine that had to be controlled by a human driver. Without human control of steering wheel, gas pedal and brakes none of the billions of miles could have
been traversed by the billions of cars in the world: A car always needed the driving skills of a human to fulfill its function. Without a driver, it would have been only an immobile artifact, left to stand still in its parking lot. In the early years of motoring, this necessity of a human driver
was not seen as a barrier. Manual driving promised to fulfill the human dream of individual mobility and freedom, of self-guidance, of autonomy. But with the emerging mass automobility in the first decades of the twentieth century, the negative effects of
human agency behind the steering wheel — accidents for example — became a serious topic of concern.It is no surprise that the fantasy of a self-driving car, a car that can navigate without a human driver, can be dated to this period.`},
  {
    role: "assistant", content: `<h6>글의 흐름으로 보아, 주어진 문장이 들어가기에 가장 적절한 곳은?</h6>
  <p><strong>주어진 문장:</strong><br>
  <u>But with the emerging mass automobility in the first decades of the twentieth century, the negative effects of human agency behind the steering wheel — accidents for example — became a serious topic of concern.</u>
  </p>
  <span>
    Since its invention at the end of the nineteenth century, the automobile remained a machine that had to be controlled by a human driver. ( ① ) Without human control of steering wheel, gas pedal and brakes none of the billions of miles could have
been traversed by the billions of cars in the world: A car always needed the driving skills of a human to fulfill its function. ( ② ) Without a driver, it would have been only an immobile artifact, left to stand still in its parking lot. ( ③ ) In
the early years of motoring, this necessity of a human driver was not seen as a barrier. ( ④ ) Manual driving promised to fulfill the human dream of individual mobility and freedom, of self-guidance, of autonomy. ( ⑤ ) It is no surprise that the
fantasy of a self-driving car, a car that can navigate without a human driver, can be dated to this period. </span>
<h6>⭐ 해설</h6>
<p>
  주어진 문장의 핵심 내용:<br>
  ● 20세기 초 대량 자동차 보급으로 인간 운전의 부정적 측면(특히 사고)이 심각한 문제로 떠올랐음<br>
  ● 'But'으로 시작하여 이전 흐름과 대비되는 전환 역할을 함<br><br>
  문단 전반의 흐름은 다음과 같이 진행됨:<br>
  ● (①), (②): 자동차는 인간 조작 없이는 움직이지 않는다는 ‘기계적 사실 설명’<br>
  → 이 부분에 주어진 문장을 넣으면 부정적·역사적 문제 제기가 갑자기 끼어 자연스럽지 못함 → <strong>부적합</strong><br><br>
  ● (③), (④): 초창기에는 인간 운전 필요성이 문제로 보이지 않았고, 오히려 자유·자율성의 상징으로 여겨졌다는 ‘긍정적 묘사’<br>
  → 여기에도 주어진 문장을 넣으면 분위기가 급격히 바뀌어 논리 흐름이 깨짐 → <strong>부적합</strong><br><br>
  ● (⑤): 자율주행차의 ‘환상(fantasy)’이 등장하는 지점<br>
  → 사람들이 왜 자율주행차를 꿈꾸기 시작했는가?<br>
  → 그 배경이 바로 **인간 운전의 부정적 측면(사고 등) 증가**라는 내용과 정확히 연결됨<br><br>
  따라서 주어진 문장은 (⑤) 앞에서 자연스럽게 자율주행 기술에 대한 열망을 설명하는 **전환·배경 문장** 역할을 한다.
</p>
<p><strong>정답: ⑤</strong></p>`}];
//요약
const summaryExData = (type, question, text, level) => [
  {
    role: "user", content: `[유형]: 요약, [발문]: 다음 글의 내용을 한 문장으로 요약하고자 한다. 빈칸 (A), (B)에 들어갈 말로 가장 적절한 것은?
    [지문]: Cinema and law share the same subjects and audience. Rather than an abstract desire for truth as a value in itself, the law deals with the messiness of human relations. Both disciplines struggle with what it means to be human and try to communicate to us something about
our existence; both are human artifacts directed at man. Indeed, foundational to law is its anxiety about human nature: man desires freedom but is simultaneously too violent to exist in a state of nature without a regime of commands and prohibitions. However, there is also an
important difference here that makes a study of the interaction between cinema and law interesting: while cinema expresses man’s affective life, the law keeps it in check. It tries to ensure that we are not overwhelmed and destroyed by our desires and drives. The law obsessively tries to suppress affects, fearing the horror of their consequences, whereas cinema introduces us to our affects, often forcing us to identify the most unbearable ones in ourselves. ,[학년]: 고2, 
[추가 규칙]: 1. 주어진 지문의 주제를 한 문장으로 요약하기.
2. 주어진 요약문에서 keyword가 되는 명사, 동사, 형용사, 또는 부사 2곳을 각각 ___(A)___와 ___(B)___로 치환하기.
3. 치환된 기존의 단어가 정답이며 4개의 distractors를 추가하여 오지선다형 선택지를 제공하기.
4. 지문 + 한 문장으로 된 요약문을 정답 해설 이후에 <br> 태그로 구분해서 제공하기.
`},
  {
    role: "assistant", content: `① symbols ······· places</li>② symbols ······· reinforces</li>③ nature ······· removes</li>④ humanity ······· imposes</li>⑤ humanity ······· undermines<br>
    ⭐해설
 1) (A)에 들어갈 말 찾기 — 영화와 법이 공통적으로 탐구하는 것
  원문에서 반복적으로 강조되는 핵심은 다음과 같습니다:
  ● “what it means to be human”
  ● “human artifacts directed at man”
  ● “anxiety about human nature”
  즉, 두 분야 모두 인간(humanity) / 인간 존재(human existence)를 탐구한다는 의미입니다.
  따라서 (A)는 humanity가 가장 자연스럽습니다.
  → 정답 후보: ④, ⑤
  2) (B)에 들어갈 말 찾기 — 법이 감정을 어떻게 다루는가?
  본문에서 법의 역할은 다음과 같이 설명됩니다
  ● “the law keeps it (emotion) in check”
  ● “tries to ensure we are not overwhelmed by our desires”
  ● “obsessively tries to suppress affects”
  즉, 법은 감정을 억제하고 제한하는 기능을 함.
  → 문맥상 가장 자연스러운 표현은 <strong>imposes (limits on emotion)
  반면,
  ● undermines = 약화시키다 → 감정 그 자체를 약화시킨다는 의미로 부적절.
정답: ④ humanity ······· imposes<br>
Cinema and law share the same subjects and audience. Rather than an abstract desire for truth as a value in itself, the law deals with the messiness of human relations. Both disciplines struggle with what it means to be human and try to communicate to us something about our existence; both are human artifacts directed at man. Indeed, foundational to law is its anxiety about human nature: man desires freedom but is simultaneously too violent to exist in a state of nature without a regime of commands and prohibitions. However, there is also an important difference here that makes a study of the interaction between cinema and law interesting: while cinema expresses man’s affective life, the law keeps it in check. It tries to ensure that we are not overwhelmed and destroyed by our desires and drives. The law obsessively tries to suppress affects, fearing the horror of their consequences, whereas cinema introduces us to our affects, often forcing us to identify the most unbearable ones in ourselves.
→ 요약문: Cinema and law are both human creations that explore -___(A)___, yet they differ in how they handle emotion — cinema has us confront it, and law ___(B)___ limits on it.`},
  {
    role: "user",
    content: `[유형]: ${type}, [발문]: ${question}, [지문]: ${text}, [학년]: ${level},
    [추가 규칙]: 1. 주어진 지문의 주제를 한 문장으로 요약하기.
2. 주어진 요약문에서 keyword가 되는 명사, 동사, 형용사, 또는 부사 2곳을 각각 ___(A)___, ___(B)___로 치환하기.
3. 치환된 기존의 단어들이 정답이며 4개의 distractors를 추가하여 오지선다형 선택지를 제공하기. ex) ④ humanity ······· imposes
4. 지문 + 한 문장으로 된 요약문을 정답 해설 이후에 <br> 태그로 구분해서 제공하기.`}];
const typeData = {
  "글의 목적": "다음 글의 목적으로 가장 적절한 것은?",
  "심경, 분위기": "다음 글에 드러난 대상의 심경 변화로 가장 적절한 것은?",
  "필자의 주장": "다음 글에서 필자가 주장하는 바로 가장 적절한 것은?",
  "함축 의미": "밑줄 친 내용이 다음 글에서 의미하는 바로 가장 적절한 것은?",
  "지칭 추론": "밑줄 친 부분이 가리키는 대상이 나머지 넷과 다른 것은?",
  "글의 요지": "다음 글의 요지로 가장 적절한 것은?",
  "글의 주제": "다음 글의 주제로 가장 적절한 것은?",
  "글의 제목": "다음 글의 제목으로 가장 적절한 것은?",
  "일치/불일치": "다음 글의 내용과 일치하지 않는 것은?",
  "어법 ABC": "(A), (B), (C)의 각 네모 안에서 어법에 맞는 표현으로 가장 적절한 것은?",
  "어법 밑줄": "다음 글의 밑줄 친 부분 중, 어법상 틀린 것은?",
  "어휘 ABC": "(A), (B), (C)의 각 네모 안에서 문맥에 맞는 낱말로 가장 적절한 것은?",
  "어휘 밑줄": "다음 글의 밑줄 친 부분 중, 문맥상 낱말의 쓰임이 적절하지 않은 것은?",
  "빈칸 추론": "다음 빈칸에 들어갈 말로 가장 적절한 것은?",
  "무관한 문장": "다음 글에서 전체 흐름과 관계 없는 문장은?",
  "글의 순서": "주어진 글 다음에 이어질 글의 순서로 가장 적절한 것은?",
  "문장 삽입": "글의 흐름으로 보아, 주어진 문장이 들어가기에 가장 적절한 곳은?",
  "요약": "다음 글의 내용을 한 문장으로 요약하고자 한다. 빈칸 (A), (B)에 들어갈 말로 가장 적절한 것은?"
};

export { numbers, typeData, purposeExData, feelingChangeExData, authorMainPointExData, meaningExData, mainIdeaExData, thesisExData, titleExData, trueFalseExData, grammarExData, lexisExData, blankExData, nonRelatedExData, sequenceExData, insertExData, summaryExData }