import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import styled from 'styled-components';
//컴포넌트
import DotTitle from '../Title/DotTitle';
import MainBtn from '../Btn/MainBtn';
//hooks
import useFireUserData from '../../hooks/Firebase/useFireUserData';
import useGetByte from '../../hooks/useGetByte';
//이미지
import arrows_icon from "../../image/icon/arrows_icon.png"
import ByteCalculator from '../Etc/ByteCalculator';

//생성(251027)
const AskEditModal = ({ show, onHide, acti, petInfo, accRecord }) => {
	const user = useSelector(({ user }) => user);
	const { record, madeBy, uid, id } = acti;
	useEffect(() => { setRecord(record) }, [record]);
	const [_record, setRecord] = useState('');
	const { getByteLengthOfString } = useGetByte();
	const { updateUserArrayInfo } = useFireUserData();
	const dotTitleStyle = { fontWeight: "400", dotColor: "#3454d1" };
	//------함수부------------------------------------------------  
	const handleOnClick = () => {
		const confirm = window.confirm("교사에게 수정 요청하시겠습니까?");
		if (!confirm) return;
		const { classId, petId, subject } = petInfo;
		const date = new Date().toISOString();
		const byte = getByteLengthOfString(record);
		const newByte = getByteLengthOfString(_record);
		const submitInfo =
		{
			type: "edit",
			sId: user.uid, actiId: id, classId, petId,
			studentName: user.name, studentNumber: user.studentNumber,
			record, newRecord: _record, subject, date, byte, newByte,
		}
		updateUserArrayInfo(uid, "onSubmitList", submitInfo).then(() => {
			alert("요청이 전송되었습니다.");
			onHide();
		})
	}
	return (
		<Modal
			show={show}
			onHide={onHide}
			size='lg'
		>
			<Modal.Header closeButton style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }}>수정 요청</Modal.Header>
			<Modal.Body style={{ backgroundColor: "#efefef", borderRadius: "5px" }}>
				<Column style={{ gap: "10px" }}>
					<DotTitle styles={dotTitleStyle}>기록자: <Hilit>&nbsp;{madeBy}&nbsp;</Hilit>선생님</DotTitle>
					<DotTitle styles={dotTitleStyle}>수정 전:<Hilit>&nbsp;{getByteLengthOfString(record)}&nbsp;</Hilit>바이트</DotTitle>
					<DotTitle styles={dotTitleStyle}>전체 세특 바이트:<Hilit>&nbsp;{getByteLengthOfString(accRecord) - getByteLengthOfString(record) + getByteLengthOfString(_record)}&nbsp;</Hilit>/1500바이트</DotTitle>
					<div style={{ border: "1px solid gray", padding: "5px", borderRadius: "5px" }}>{record}</div>
					<Column style={{ gap: "10px" }}>
						<Row style={{ justifyContent: "center" }}>
							<img src={arrows_icon} width="25px" alt="아래화살표" />
						</Row>
						<Textarea
							value={_record}
							onChange={(event) => { setRecord(event.target.value) }}
						/>
						<ByteCalculator str={_record} />
					</Column>
					<Column>
						<MainBtn onClick={handleOnClick}>수정 요청</MainBtn>
					</Column>
				</Column>
			</Modal.Body>
		</Modal>
	)
}
const Row = styled.div`
	display: flex;
`
const Column = styled(Row)`
	flex-direction: column;
`
const Textarea = styled.textarea`
	background-color: white;
	padding: 5px;
	border: none;
	border-radius: 5px;
	min-height: 15dvh;
`
const Hilit = styled.span`
	font-weight: bold;
	color: #3454d1;
`
export default AskEditModal
