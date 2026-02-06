export const GPT_MODE = Object.freeze({
	MULTI_GENERAL: "multiGeneral",
	MULTI_TRANS: "multiTrans",
	TRANS: "translate",
	REPORT: "report",
	FILLER: "filler",
	KEYWORD: "keyword",
});
//charge-rara 모달
export const GPT_OPTION_LIST = [
	{
		label: "gpt5.1", value: "gpt-5.1", des: "gpt 범용 모델 중 최고 성능인 gpt-5.2의 바로 이전 모델입니다, 보다 저렴한 가격으로 최고 수준의 성능을 냅니다.", price: 70,
		recommend: "함축 의미, 심경/분위기, 어휘 밑줄, 빈칸 추론, 무관한 문장, 요약 등의 정교한 시험 문항 출제, 세특 개별화 문구 작성 시"
	},
	{
		label: "gpt-5-mini", value: "gpt-5-mini", des: "gpt5.1 보다 더 빠르고 가성비 좋은 추론형 모델입니다. 간단한 수능, 내신형 시험 문제 출제에는 충분한 성능입니다.", price: 20,
		recommend: "주제, 제목, 요지, 글의 목적, 내용 일치/불일치 등 기본적인 시험 문항 출제, 세특 기본 문구 작업 시"
	},
	{
		label: "gpt-5-nano", value: "gpt-5-nano", des: "가장 저렴하지만 추론 능력이 거의 없어 단순 반복 작업, 요약 작업 등에만 적합합니다, 고난도 시험 문항 제작에는 추천하지 않음.", price: 10,
		recommend: "단어 추출, 간단 문장 변환, 단순 요약 등 반복 작업 시"
	}
];
//로딩 상태
export const GPT_RESPONSE = {
	LOADING: "loading",
	COMPLETE: "complete"
}