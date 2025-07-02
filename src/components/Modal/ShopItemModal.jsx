//라이브러리
import { useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import styled from "styled-components"
import { useSelector } from "react-redux"
//컴포넌트
import ModalBtn from "../Btn/ModalBtn"
import DotTitle from "../Title/DotTitle"
//hooks
import useFireUserData from "../../hooks/Firebase/useFireUserData"
//이미지
import rira_gem from "../../image/money.png"
//생성(250701)
const ShopItemModal = ({ show, onHide, rira, giftImgList, selected, teacherId }) => {
	const user = useSelector(({ user }) => user);
	useEffect(() => { bindItemInfo(); }, [selected]);
	const { updateUserInfo, updateUserArrayInfo, deleteUserArrayInfo, purchaseShopItem } = useFireUserData();
	//위치
	const [order, setOrder] = useState(null);
	//정보
	const [_title, setTitle] = useState('');
	const [_price, setPrice] = useState(0);
	const [_stock, setStock] = useState(0);
	const [_imgIndex, setImgIndex] = useState(null);
	//학생
	const [_quantity, setQuantity] = useState(0);
	//css
	const dotStyle = { dotColor: "#3454d1", width: "50%" }
	const confirmBtnStyle = { btnColor: "royalblue", hoverColor: "#3454d1" }
	//------공용 함수부------------------------------------------------  
	//초기화
	const init = () => {
		setPrice(0);
		setStock(0);
		setTitle('');
		setImgIndex(null);
	}
	//path
	const getGiftPath = () => {
		let path
		switch (_imgIndex) {
			case 0:
				path = "images/store_gift_r.png"
				break;
			case 1:
				path = "images/store_gift_g.png"
				break;
			case 2:
				path = "images/store_gift_b.png"
				break;
			default:
				path = "images/store_gift_y.png"
				break;
		}
		return path
	}
	//인덱스
	const getIndex = (path) => {
		let index
		switch (path) {
			case "images/store_gift_r.png":
				index = 0
				break;
			case "images/store_gift_g.png":
				index = 1
				break;
			case "images/store_gift_b.png":
				index = 2
				break;
			default:
				index = 3
				break;
		}
		return index
	}
	//아이템 정보
	const bindItemInfo = () => {
		if (!selected) return
		setOrder(selected.index);
		if (selected?.item) {
			const { price, stock, title, giftPath } = selected.item;
			setPrice(Number(price));
			setStock(Number(stock));
			setTitle(title);
			const imgIndex = getIndex(giftPath);
			setImgIndex(imgIndex);
		} else {
			init();
		}
	}
	//리라 체크
	const checkRira = (my, need) => {
		if (my >= need) { return true }
		else {
			alert("리라가 부족합니다.");
			return false
		}
	}
	//재고 체크
	const checkStock = (stock, quantity) => {
		if (stock >= quantity) { return true }
		else {
			alert("상품 재고가 부족합니다.");
			return false
		}
	}
	//------교사용 함수------------------------------------------------ 
	//선물 리스트 클릭
	const handleGiftOnClick = (index) => {
		if (selected?.item) return
		setImgIndex(index);
	}
	//등록
	const handleConfirmOnClick = () => {
		const product = { title: _title, price: _price, stock: _stock, giftPath: getGiftPath(), order };
		if (checkRira(rira, _price * _stock)) {
			updateUserArrayInfo(user.uid, "shopItemList", product);
			updateUserInfo("rira", rira - _price * _stock);
			alert("상품을 등록했습니다.");
			onHide();
		}
	}
	//회수
	const handleRetrieveOnClick = () => {
		const result = window.confirm("상품을 회수할까요?")
		if (result) {
			deleteUserArrayInfo(user.uid, "shopItemList", selected.item);
			updateUserInfo("rira", rira + _price * _stock);
			alert("상품을 회수했습니다.");
			onHide();
		}
	}
	//------학생용 함수------------------------------------------------  
	//구매
	const handleBuyOnClick = () => {
		const result = window.confirm("상품을 구매할까요?")
		if (result) {
			if (checkRira(rira, _price * _quantity) && checkStock(_stock, _quantity)) {
				purchaseShopItem(user.name, rira, selected.item, _quantity, teacherId);
				alert(`${_title}상품을 구매했습니다.`);
				onHide();
			}
		}
	}
	return (
		<Modal
			show={show}
			onHide={onHide}
			backdrop="static"
		>
			<Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>{user.isTeacher ? "상품 등록" : "상품 구매"}</Modal.Header>
			<Modal.Body>
				<Column style={{ gap: "10px" }}>
					<DotTitle title={"상품 이미지"} styles={dotStyle} />
					<Row style={{ margin: "0 auto" }}>
						{giftImgList.map((path, index) => <GiftImg key={index} $selected={index === _imgIndex} src={path} alt="상품" onClick={() => { handleGiftOnClick(index) }} />)}
					</Row>
					<Row style={{ justifyContent: "space-between" }}>
						<DotTitle title={"상품 이름"} styles={dotStyle} />
						<StyledInput type="text" value={_title} onChange={(event) => { setTitle(event.target.value) }} disabled={selected?.item} />
					</Row>
					<Row style={{ justifyContent: "space-between" }}>
						<DotTitle title={"상품 가격"} styles={dotStyle} />
						<StyledInput type="number" value={_price} onChange={(event) => { setPrice(Number(event.target.value)) }} disabled={selected?.item} />
					</Row>
					<Row style={{ justifyContent: "space-between" }}>
						<DotTitle title={"재고"} styles={dotStyle} />
						<StyledInput type="number" value={_stock} onChange={(event) => { setStock(Number(event.target.value)) }} disabled={selected?.item} />
					</Row>
					{/* 학생 구매 수량 */}
					{!user.isTeacher && <Row style={{ justifyContent: "space-between" }}>
						<DotTitle title={"수량"} styles={dotStyle} />
						<StyledInput type="number" value={_quantity} onChange={(event) => { setQuantity(Number(event.target.value)) }} />
					</Row>}
					<Row style={{ justifyContent: "space-between", borderTop: "1px solid rgba(120,120,120,0.5)", paddingTop: "15px", marginTop: "15px" }}>
						<DotTitle title={"나의 리라"} styles={dotStyle} />
						<Row>
							<img src={rira_gem} alt="재화" width="25px" />
							{rira || 0}
						</Row>
					</Row>
					<Row style={{ justifyContent: "space-between" }}>
						<DotTitle title={"필요 리라"} styles={dotStyle} />
						<Row>
							<img src={rira_gem} alt="재화" width="25px" />
							<p style={{ margin: "0" }}>-{_price * (user.isTeacher ? _stock : _quantity)}</p>
						</Row>
					</Row>
					<Row style={{ justifyContent: "space-between" }}>
						<DotTitle title={"합계"} styles={dotStyle} />
						<Row>
							<img src={rira_gem} alt="재화" width="25px" />
							{checkRira(rira, _price * _stock)
								? <p style={{ margin: "0", fontWeight: "bold" }}>{rira - _price * (user.isTeacher ? _stock : _quantity)}</p>
								: <p style={{ margin: "0", color: "red", fontWeight: "bold" }}>{rira - _price * (user.isTeacher ? _stock : _quantity)}</p>}
						</Row>
					</Row>
				</Column>
			</Modal.Body>
			<Modal.Footer>
				<ModalBtn onClick={onHide}>취소</ModalBtn>
				{(selected?.item && user.isTeacher) && <ModalBtn onClick={handleRetrieveOnClick} styles={confirmBtnStyle}>회수</ModalBtn>}
				{(selected?.item && !user.isTeacher) && <ModalBtn onClick={handleBuyOnClick} styles={confirmBtnStyle}>구매</ModalBtn>}
				{!selected?.item && <ModalBtn onClick={handleConfirmOnClick} styles={confirmBtnStyle}>등록</ModalBtn>}
			</Modal.Footer>
		</Modal >
	)
}

const Row = styled.div`
	display: flex;
`
const Column = styled(Row)`
	flex-direction: column;
`
const GiftImg = styled.img`
	width: 100px;
	height: 100px;
	cursor: pointer;
	background-color: ${({ $selected }) => $selected ? "rgba(52, 84, 209, 0.4)" : "white"};
	border-radius: 10px;
`
const StyledInput = styled.input`
  height: 35px;
  border: 1px solid rgba(120, 120, 120, 0.5);
  border-radius: 7px;
  padding-left: 5px;
  &:disabled { color: gray; } /* 해당 input disabled 되었을 때 */
`
export default ShopItemModal
