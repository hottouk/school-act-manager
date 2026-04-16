import React, { useCallback, useEffect, useState } from 'react'

const useAiExamParser = ({ setPassage, setOptionList, setExplanation }) => {
	const gptParser = useCallback((gptAnswer, type, passage, nonRelatedAnswer) => {
		console.log("gptAnswer:", gptAnswer);
		if (!gptAnswer) return '';
		const options = gptAnswer.split("<br>")[0];
		const explanations = gptAnswer.split("<br>")[1];
		const alteredPassage = gptAnswer.split("<br>")[2];
		const list = options.split("</li>").slice(0, 5);
		setOptionList(list);
		setExplanation(explanations.trim());
		if (alteredPassage) setPassage(alteredPassage.trim());
		if (type === "무관한 문장") {
			const sentenceList = passage.split(". ").filter((item) => item !== '');
			const delIdx = sentenceList.length - (4 - nonRelatedAnswer);
			const fabricated = [...sentenceList.slice(0, delIdx), options, ...sentenceList.slice(delIdx),]
				.map((item, index, arr) => {
					const circledNums = ["①", "②", "③", "④", "⑤"].reverse();
					const idx = arr.length - 1 - index;
					return `${circledNums[idx] || ''} ${item}. `
				})
				.join(' ');
			setPassage(fabricated);
			setExplanation(explanations.trim());
		}
		if (["어법 밑줄", "어휘 밑줄"].includes(type)) {
			setPassage(options);
			setOptionList([]);
		};

		// return {
		// 	options: list,
		// 	explanations: explanations ? explanations.trim() : '',
		// 	alteredPassage: alteredPassage ? alteredPassage.trim() : ''
		// }
	}, []);

	return { gptParser };
}

export default useAiExamParser
