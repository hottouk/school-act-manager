//컴포넌트
import Modal from 'react-bootstrap/Modal';
import ModalBtn from '../Btn/ModalBtn';
import { Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import ByteCalculator from '../Etc/ByteCalculator';
//이미지
import xImage from '../../image/icon/x_btn.png'
import useChatGpt from '../../hooks/useChatGpt';
import useFireActiData from '../../hooks/Firebase/useFireActiData';
import MidBtn from '../Btn/MidBtn';

//생성(2506003)
const AddRepeatRecModal = ({ show, onHide, acti, setList }) => {
	useEffect(() => {
		if (!acti) return;
		initData();
	}, [acti])
	const [_repeatRecList, setRepeatRecList] = useState(['']); // 초기 입력 필드 하나를 설정; 얘가 늘어나면 input text개수 알아서 늘어남.
	const [_timesList, setTimesList] = useState([3]);
	const { askRepeatRecord, gptAnswer, gptRes } = useChatGpt();
	useEffect(() => {
		if (gptAnswer === '') return;
		const gptAnswerList = splitGptAnswers(gptAnswer);
		setRepeatRecList(gptAnswerList);
		setTimesList([4, 3, 2]);
	}, [gptAnswer]);
	//데이터 통신
	const { updateActi } = useFireActiData();

	//------함수부------------------------------------------------  
	const initData = () => {
		const repeatInfoList = acti.repeatInfoList;
		setRepeatRecList(repeatInfoList?.map(item => item.record) ?? ['']);
		setTimesList(repeatInfoList?.map(item => item.times) ?? [3]);
	};
	//textarea 내 tab 키
	const handleKeyDown = (index, event) => {
		if (event.key === 'Tab' && index === _repeatRecList.length - 1) {
			event.preventDefault();
			addInputField();
		}
	};
	// n개의 새로운 빈 입력 필드를 추가
	const addInputField = (number = 1) => {
		if (_repeatRecList.length < 3) {
			setRepeatRecList(prev => [
				...prev,
				...Array(number).fill('')
			]);
			setTimesList(prev => [
				...prev,
				...Array(number).fill(2)
			])
		}
		else { window.alert("문구는 최대 3개까지 입니다."); }
	};
	//값 변경
	const handleOnChange = (index, event) => {
		let values;
		switch (event.target.id) {
			case "recTextarea":
				values = [..._repeatRecList];
				values[index] = event.target.value;
				setRepeatRecList(values);
				break;
			case "numberInput":
				values = [..._timesList];
				values[index] = event.target.value;
				setTimesList(values);
				break;
			default:
				break;
		}
	};
	//삭제 버튼
	const handleDeleteOnClick = (index) => {
		const newArr = _repeatRecList.filter((_, i) => { return i !== index });
		setRepeatRecList(newArr);
	};
	//gpt -> 배열
	const splitGptAnswers = (gptAnswers) => { return gptAnswers.split('^'); };
	//gpt 요청 버튼
	const handleGptClick = async () => { await askRepeatRecord(acti.record); };
	//검사
	const check = (arr) => { return new Set(arr).size === arr.length; }
	//저장 버튼
	const handleConfirm = () => {
		const confirm = window.confirm("문구를 저장하시겠습니까?")
		if (confirm) {
			const timesList = [..._timesList.map(Number)];
			const result = check(timesList);
			if (!result) { alert("반복 횟수 설정은 모두 다른 값이어야 합니다"); }
			else {
				const repeatRecList = [..._repeatRecList];
				const repeatInfoList = repeatRecList.map((record, index) => { return { times: timesList[index], record } });
				setList(repeatInfoList);  // 외부 문구 list 셋 
				const modifiedActi = { repeatInfoList }; // firedata 업데이트 위한 객체화
				updateActi(modifiedActi, acti.id);
			}
		}
		onHide();
	};

	return (
		<Modal
			size='lg'
			show={show}
			onHide={onHide}
			backdrop="static"
		>
			<Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>반복 문구 관리</Modal.Header>
			<Modal.Body style={{ backgroundColor: "#efefef" }}>
				<CurWrapper>
					<AchivTap $top={-28}>현재 문구</AchivTap>
					<StyledCurRec>{acti.record}</StyledCurRec>
				</CurWrapper>
				<GridContainer>
					<TableHeaderWrapper>
						<StyledHeader>순번</StyledHeader>
						<StyledHeader>횟수</StyledHeader>
						<StyledHeader>내용</StyledHeader>
						<StyledHeader>바이트</StyledHeader>
						<StyledHeader>삭제</StyledHeader>
					</TableHeaderWrapper>
					{_repeatRecList?.length === 0 && <GridItem $columns={"1/6"} style={{ height: "35px" }}><span>설정된 문구가 없습니다.</span></GridItem>}
					{_repeatRecList.map((record, index) => {
						return <GridRowWrapper key={index} >
							<GridItem $columns={"1/2"}><span>{index + 1}</span></GridItem>
							<GridItem $columns={"2/3"} style={{ gap: "5px" }}>
								<NumberInput
									id="numberInput"
									type='number'
									value={_timesList[index]}
									onChange={(event) => handleOnChange(index, event)}
									min={2} max={10} />
								<p style={{ margin: 0 }}>회</p>
							</GridItem>
							<GridItem $columns={"3/4"}>
								<textarea
									id="recTextarea"
									type="text"
									value={record}
									onChange={(event) => handleOnChange(index, event)}
									onKeyDown={(event) => handleKeyDown(index, event)}
								/></GridItem>
							<GridItem $columns={"4/5"}><ByteCalculator str={record} styles={{ isTotalByteHide: true }} /></GridItem>
							<GridItem $columns={"5/6"}><img src={xImage} alt="삭제 버튼" onClick={() => handleDeleteOnClick(index)} /></GridItem>
						</GridRowWrapper>
					})}
				</GridContainer>
				{(gptRes === "loading")
					? <Row style={{ justifyContent: "center", marginTop: "20px" }}><Spinner animation="border" role="status" /></Row>
					: <Row style={{ justifyContent: "space-evenly", marginTop: "20px", }}>
						<MidBtn onClick={addInputField}>한줄 추가</MidBtn>
						<MidBtn onClick={handleGptClick}>ChatGPT</MidBtn>
					</Row>}
			</Modal.Body>
			<Modal.Footer style={{ backgroundColor: "#efefef" }} >
				<ModalBtn onClick={() => { onHide() }}>취소</ModalBtn>
				<ModalBtn styles={{ btnColor: "rgba(52, 84, 209, 0.8)", hoverColor: "#3454d1" }} onClick={handleConfirm}>저장</ModalBtn>
			</Modal.Footer>
		</Modal >
	)
}
const Row = styled.div`
  display: flex;
`
const CurWrapper = styled.div`
  position: relative;
  margin: 25px 0;
`
const StyledCurRec = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  border-top-left-radius: 0;
  padding: 10px;
  margin-bottom: 10px;
`
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 70px 100px 1fr 100px 70px;
  grid-template-rows: 40px;
  margin: 0 auto;
  padding: 0;
`
const GridRowWrapper = styled.div`
	display: contents;
`
const GridItem = styled.div`
	grid-column: ${(props) => props.$columns};
	background-color: #ddd;
	color: black;
	border: 1px solid rgba(120, 120, 120, 0.3);
	border-radius: 5px;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	textarea {
		width: 100%;
		height: 75px;
		border: none;
		border-radius: 10px;
		display: block;
		margin: 10px;
	}
	img {
		width: 25px;
		cursor: pointer;
	}
`
const NumberInput = styled.input`
	width: 40px;
	height: 30px;
	border: none;
	text-algin: center;
	border-radius: 5px
`
// lastChild의 범위를 명확하게 하기 위함.
const TableHeaderWrapper = styled.div` 
  display: contents;
`
const StyledHeader = styled(Row)`
	background-color: #3454d1;
	color: white;
	padding: 10px;
	justify-content: center;
	&: first-child {
		border-top-left-radius: 5px;
	}
	&: last-child {
		border-top-right-radius: 5px;
	}
`
const AchivTap = styled.div`
  border-bottom: none;
  background-color: #3454d1;
  color: white;
  position: absolute;
  top: ${({ $top }) => $top}px;
  padding: 2px 15px;
  border-radius: 10px 10px 0 0;
`

export default AddRepeatRecModal
