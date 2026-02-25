import React from 'react'
import { saveAs } from "file-saver";
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
//생성(251229)
const useDocxFile = () => {
	//줄바꿈 정리
	const normalize = (string) => String(string ?? "").replace(/\r?\n/g, "\n");
	//다운로드
	const downloadQuestionDocx = async (item) => {
		const question = normalize(item.question);
		const passage = item.passage;
		const explanation = item.explanation;
		const optionList = Array.isArray(item.optionList) ? item.optionList : [];
		const optionParas = optionList.map((opt) => {
			return new Paragraph({
				children: [new TextRun({ text: normalize(opt) })],
			});
		});

		const doc = new Document({
			sections: [
				{
					children: [
						new Paragraph({ text: "문항", heading: HeadingLevel.HEADING_2, }),

						new Paragraph({
							children: [new TextRun({ text: question, bold: true })],
							spacing: { after: 200 },
						}),
						new Paragraph({
							children: [new TextRun({ text: normalize(passage) })],
							spacing: { after: 200 }
						}),
						...optionParas,
						...(explanation
							? [
								new Paragraph({
									text: "해설",
									heading: HeadingLevel.HEADING_2,
									spacing: { before: 200 }
								}),
								new Paragraph({ text: explanation }),
							]
							: []),
					],
				},
			],
		});

		const blob = await Packer.toBlob(doc);
		const safeName = (item.title || question || "제목없음");
		saveAs(blob, `${safeName}.docx`);
	}
	return { downloadQuestionDocx }
}

export default useDocxFile
