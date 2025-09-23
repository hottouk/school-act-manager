//라이브러리
import React, { useRef } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
//컴포넌트
import ByteCalculator from '../../components/Etc/ByteCalculator';
import SmallBtn from '../../components/Btn/SmallBtn';
//img
import x_btn from '../../image/icon/x_btn.png';
import { useSelector } from 'react-redux';
//생성(250223)
const HomeActiListGridSection = ({ isModifying, list, setList, type, allActiList }) => {
	const user = useSelector(({ user }) => user);
	const selectRef = useRef({});
	//------함수부------------------------------------------------
	//순서 변경
	const moveActiItem = (index, direction) => {
		setList((prevActiList) => {
			const newActiList = [...prevActiList];
			const targetIndex = direction === 'up' ? index - 1 : index + 1;
			// 범위를 벗어나면 이동하지 않음
			if (targetIndex < 0 || targetIndex >= newActiList.length) return prevActiList;
			// swap
			[newActiList[index], newActiList[targetIndex]] = [newActiList[targetIndex], newActiList[index]];
			return newActiList;
		});
	};
	//셀렉터 체크
	const check = (event) => {
		if ((list.findIndex(({ id }) => id === event.value.id)) === -1) { return { isValid: true, msg: "같은 활동 없음" } }
		else { return { isValid: false, msg: "중복된 활동입니다." } }
	}
	//기존 셀렉터 변경
	const handleSelectOnChange = (event, index) => {
		const result = check(event);
		if (result.isValid) {
			const assignedDate = new Date().toISOString().split('T')[0];
			const selected = event.value;																																																		  //클릭한 활동 id
			const { byte, studentDoneList, particiList, particiSIdList, likedCount, isPrivate, isHomework, createdTime, ...rest } = selected; //★필요한 prop만 사용하고 제외
			const newActi = { ...rest, assignedDate };
			const newActiList = [...list.slice(undefined, index), newActi, ...list.slice(index + 1)];
			setList(newActiList);
		} else { alert(result.msg) }
	}
	//활동 추가
	const handleAddActiOnClick = () => {
		const assignedDate = new Date().toISOString().split('T')[0];
		const newActiItem = {
			title: "임의기록", record: '', id: "random" + assignedDate, uid: user.uid,
			assignedDate, madeBy: user.name, subject: "담임", subjDetail: type,
		};
		let newList;
		if (list) { newList = [...list, newActiItem]; }
		else { newList = [newActiItem] }
		setList(newList);
	}
	//textarea 변경1 (gpt, 수기 변경)
	const handleTextareaOnChange = (event, index) => changeAccRecord(index, event.target.value);
	//textarea 변경2 (gpt, 수기 변경)
	const changeAccRecord = (index, newRec) => {
		const curActi = list[index];
		const newActi = { ...curActi, record: newRec };
		const newActiList = [...list.slice(undefined, index), newActi, ...list.slice(index + 1)];
		setList(newActiList);
	};
	//삭제 버튼
	const handleDeleteActiOnClick = (index) => {
		const leftList = list.filter((_, i) => i !== index);
		setList(leftList);
	};

	return (
		<GridBotContainer>
			<GridRow>
				<StyledHeader>연번</StyledHeader>
				<StyledHeader>활동</StyledHeader>
				<StyledHeader>생기부</StyledHeader>
				<StyledHeader>{!isModifying ? "날짜" : "삭제"}</StyledHeader>
				<StyledHeader>기록자</StyledHeader>
				<StyledHeader>바이트</StyledHeader>
			</GridRow>
			{!list || list.length === 0
				? <GridItem style={{ gridColumn: "1/7" }}>활동이 없어요ㅠㅠ</GridItem>
				: list.map((item, index) => {
					const { madeBy, title, record, assignedDate } = item;
					return <React.Fragment key={item.id}>
						{/* 일반 */}
						{!isModifying &&
							<GridRow>
								<GridItem>{index + 1}</GridItem>
								<GridItem>{title}</GridItem>
								<GridItem className='left-align'>{record}</GridItem>
								<GridItem>{assignedDate || "없음"}</GridItem>
								<GridItem>{madeBy}</GridItem>
								<GridItem><ByteCalculator str={record} styles={{ isTotalByteHide: true }} /></GridItem>
							</GridRow>}
						{/* 수정 */}
						{isModifying && <GridRow>
							{/* 순서  */}
							<GridItem>
								<div style={{ display: "flex", flexDirection: "column" }}>
									<button onClick={() => moveActiItem(index, 'up')}>▲</button>
									<button onClick={() => moveActiItem(index, 'down')}>▼</button>
								</div>
							</GridItem>
							{/* 활동 변경 */}
							<GridItem>
								<Select
									ref={(ele) => selectRef.current[index] = ele}
									options={allActiList?.map((item) => { return { label: item.title, value: item } })}
									onChange={(event) => { handleSelectOnChange(event, index) }} />
							</GridItem>
							{/* 문구 */}
							<GridItem>
								<StyledTextarea
									value={list[index].record}
									onChange={(event) => handleTextareaOnChange(event, index)} />
							</GridItem>
							{/* 삭제 */}
							<GridItem>
								<DeleteButton src={x_btn} id="delete_acti_btn" alt="삭제x" onClick={() => handleDeleteActiOnClick(index)} />
							</GridItem>
							<GridItem>{madeBy}</GridItem>
							<GridItem><ByteCalculator str={record} styles={{ isTotalByteHide: true }} /></GridItem>
						</GridRow>}
					</React.Fragment>
				})}
			{isModifying && <GridRow>
				<GridItem style={{ gridColumn: "1/7", gap: "20px" }} >
					<SmallBtn onClick={handleAddActiOnClick}>추가</SmallBtn>
				</GridItem>
			</GridRow>}
		</GridBotContainer>
	)
}

const GridBotContainer = styled.div`
	width: 100%;
	margin: 10px auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  display: grid;
  grid-template-columns: 52px 130px 9fr 1fr 1fr 1fr;
`
const GridRow = styled.div`
	display: contents;
`
const StyledHeader = styled.div`
  height: 40px;
  display: flex;
  background-color: #3454d1; 
  color: white;
  padding: 10px;
  font-weight: bold;
  justify-content: center;
  &: first-child {
    border-top-left-radius: 5px;
  }
  &: last-child {
    border-top-right-radius: 5px;
  }
`
const GridItem = styled.div`
  display: flex;
  background-color: #efefef;
  padding: 10px;
  color: black;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  justify-content: center;
  align-items: center;
	&.left-align { 
    text-align: left;
    justify-content: flex-start;
    overflow-y: scroll;
  }
`
const StyledTextarea = styled.textarea`
  width: 95%;
	min-height: 80px;
  height: 100%
  padding: 5px;
  border-radius: 5px;
`
const DeleteButton = styled.img`
	width: 30px;
	height: 30px;
	cursor: pointer;
	margin: auto;
`
export default HomeActiListGridSection
