//라이브러리
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectStudent } from '../../store/studentSelectedSlice';
import { setSelectActivity } from '../../store/activitySelectedSlice';
//컴포넌트
import MainBtn from '../../components/Btn/MainBtn';
import SelectedDialogModal from '../../components/Modal/SelectedDialogModal';
//hooks
import useAcc from '../../hooks/useAcc';
import useGetByte from '../../hooks/useGetByte';
import useFirePetData from '../../hooks/Firebase/useFirePetData';

//자율/진로 입력창 생성(250526)
const MySchoolSelectorSection = ({ tab, homeroomList, actiList }) => {
	const dispatcher = useDispatch();
	const { fetchPets } = useFirePetData();
	const { writeHomeAccOnDB } = useAcc();
	const { getByteLengthOfString } = useGetByte();
	useEffect(() => { onClearSelect(); }, [tab])
	const activitySelected = useSelector(({ activitySelected }) => { return activitySelected });
	useEffect(() => {
		const acc = activitySelected.reduce((acc, cur) => acc.concat(' ' + cur.record), '');
		setAccRecord(acc);
	}, [activitySelected]);
	const [selectedHomeroomId, setSelectedHomeroomId] = useState(null);
	useEffect(() => {
		fetchHomePetListInfo();
		dispatcher(setSelectStudent([]));
		onClearSelect();
	}, [selectedHomeroomId]);
	const [homeStudentList, setHomeStudentList] = useState([]);
	const [_accRecord, setAccRecord] = useState('');
	const [isCompleteModal, setIsCompleteModal] = useState(false);
	const selectStudentRef = useRef(null);
	const selectActiRef = useRef(null);
	//------함수부------------------------------------------------  
	//선택 담임반 pet 가져오기
	const fetchHomePetListInfo = () => {
		if (!selectedHomeroomId) return;
		fetchPets(selectedHomeroomId).then((list) => { setHomeStudentList(list); })
	}
	//학생 선택
	const handleSelectStudent = (event) => {
		dispatcher(setSelectStudent(event));
	}
	//활동 선택
	const handleSelectActi = (event) => {
		dispatcher(setSelectActivity(event));
	}
	//셀렉터 ref해제
	const onClearSelect = () => {
		if (selectStudentRef.current) selectStudentRef.current.clearValue();
		if (selectActiRef.current) selectActiRef.current.clearValue();
	}
	//선택 완료
	const handleFunction = () => {
		const type = (tab === 1) ? "self" : "career"
		return functionMap[type] || (window.alert("functionMap에 type 지정 바람"));
	}
	//type에 따른 prop 전달 함수
	const functionMap = {
		self: () => writeHomeAccOnDB(selectedHomeroomId, "self"),
		career: () => writeHomeAccOnDB(selectedHomeroomId, "career"),
	};
	//------랜더링------------------------------------------------  
	//담임반 옵션 랜더링
	const renderHomeroomOptions = () => {
		if (homeroomList.length === 0) return;
		const options = homeroomList?.map((item) => {
			const { grade, classNumber, id } = item;
			return ({ value: id, label: `${grade}학년 ${classNumber}반` })
		})
		return options
	}
	//학생 옵션 랜더링
	const renderHomeStudentOptions = () => {
		if (homeStudentList.length === 0) return;
		const options = homeStudentList?.map((item) => {
			const { studentNumber, name, id } = item;
			return ({ value: id, label: `${studentNumber} ${name ? name : '미등록'}` })
		})
		return options
	}
	//활동 옵션 랜더링
	const renderActiOptions = () => {
		if (actiList.length === 0) return;
		let filtered
		if (tab === 1) { filtered = actiList.filter(acti => acti.subjDetail === "자율"); }
		else if (tab === 2) { filtered = actiList.filter(acti => acti.subjDetail === "진로"); }
		const options = filtered?.map((item) => {
			const { content, title, uid, id, record } = item;
			return ({ value: id, label: title, uid, record, content })
		})
		return options
	}

	return (
		<>
			<Container>
				<Row style={{ width: "50%", justifyContent: "space-between", margin: "0 auto", gap: "30px" }}>
					<SelectWrapper>
						<Select
							options={renderHomeroomOptions()}
							onChange={(event) => { setSelectedHomeroomId(event.value); }}
							placeholder="반 선택" />
					</SelectWrapper>
					<SelectWrapper>
						<Select isMulti
							ref={selectStudentRef}
							options={renderHomeStudentOptions()}
							placeholder="학생 선택"
							onChange={(event) => { handleSelectStudent(event); }}
						/>
					</SelectWrapper>
				</Row>
				<SelectWrapper>
					<Select isMulti
						ref={selectActiRef}
						options={renderActiOptions()}
						placeholder="활동 선택"
						onChange={(event) => { handleSelectActi(event); }}
					/>
				</SelectWrapper>
				<AccWrapper><AccTextArea type="text" value={_accRecord} disabled={true} /></AccWrapper>
				<ByteWrapper>
					<input type="text" disabled={true} value={getByteLengthOfString(_accRecord)} />
					<p style={{ display: "inline" }}> /1500 Byte</p>
				</ByteWrapper>
				<BtnWrapper>
					<MainBtn onClick={() => { setIsCompleteModal(true) }}>선택 완료</MainBtn>
				</BtnWrapper>
			</Container>
			<SelectedDialogModal
				show={isCompleteModal}
				onHide={() => setIsCompleteModal(false)}
				onClearSelect={onClearSelect}
				writeAccDataOnDB={handleFunction()}
			/>
		</>
	)
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
	margin: 0 auto;
`
const Row = styled.div`
	display: flex;
`
const SelectWrapper = styled.div`
  width: 50%;
  margin: 0 auto;
  margin-top: 35px;
  @media(max-width: 768px){
    width: 80%;
    margin-top: 35px;
  }
`
const AccWrapper = styled(Row)`
  margin: 10px auto;
  width: 70%;
`
const AccTextArea = styled.textarea`
  width: 80%;
  height: 100px;
  margin: 10px auto;
  border-radius: 7px;
  @media(max-width: 768px) {
    width: 100%;
  }
`
const ByteWrapper = styled.div`
  margin: 0 auto;
  margin-right: 22%;
  input {
    height: 35px;
    width: 85px;
    border-radius: 7px;
  }
`
const BtnWrapper = styled(Row)`
  margin: 20px auto;
  gap: 40px;
`
export default MySchoolSelectorSection
