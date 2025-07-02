//라이브러리
import styled from "styled-components"
import Select from 'react-select'
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
//컴포넌트
import PixiShopStage from "./PixiShopStage";
import SubNav from "../../components/Bar/SubNav";
import SmallBtn from "../../components/Btn/SmallBtn";
//모달
import ShopItemModal from "../../components/Modal/ShopItemModal";
//hooks
import useFetchRtMyUserData from "../../hooks/RealTimeData/useFetchRtMyUserData"
import useFetchStorageImg from "../../hooks/Game/useFetchStorageImg";
import useFireSchoolData from "../../hooks/Firebase/useFireSchoolData";
import useFireUserData from "../../hooks/Firebase/useFireUserData";
//이미지
import rira_gem from "../../image/money.png";

//생성(250701)
const ShopMainPage = () => {
	const user = useSelector(({ user }) => user);
	const { myUserData } = useFetchRtMyUserData();
	const { subscribeUserData, deleteUserArrayInfo, updateUserArrayInfo } = useFireUserData();
	useEffect(() => {
		fetchMySchoolInfo();
		fetchShopItemInfo();
	}, [myUserData]);
	//선물 이미지
	const { fetchImgUrlList } = useFetchStorageImg();
	const giftImgUrlList = ['images/store_gift_r.png', 'images/store_gift_g.png', 'images/store_gift_b.png', 'images/store_gift_y.png'];
	const [giftImgList, setGiftImgList] = useState([]);
	useEffect(() => { fetchImgUrlList(giftImgUrlList, setGiftImgList) }, []);
	//------공용 변수------------------------------------------------  
	const [_shopItemList, setShopItemList] = useState([null, null, null, null, null, null, null, null]);
	const [selectedGift, setSelectedGift] = useState(null);
	//모달
	const [isModal, setIsModal] = useState(false);
	//------학생용 변수------------------------------------------------  
	//학교 검색
	const { fetchSchoolByCode } = useFireSchoolData();
	const [teacherList, setTeacherList] = useState([]);
	const [teacherId, setTeacherId] = useState(null);
	useEffect(() => { subscribeUserData(teacherId, setSelectedTeacher); }, [teacherId])
	const [selectedTeacher, setSelectedTeacher] = useState(null);
	useEffect(() => { bindTeacherInfo() }, [selectedTeacher]);
	//------교사용 함수------------------------------------------------  
	//공용: 정보
	const fetchShopItemInfo = () => {
		if (!user.isTeacher || !myUserData) return
		const { shopItemList } = myUserData;
		bindShopItemList(shopItemList);
	}
	//공용: 샵 아이템
	const bindShopItemList = (shopItemList) => {
		const arr = [null, null, null, null, null, null, null, null];
		shopItemList.forEach(item => { arr.splice(item.order, 1, item); })
		setShopItemList(arr);
	}
	//------학생용 함수------------------------------------------------  
	//교사 정보
	const fetchMySchoolInfo = () => {
		if (user.isTeacher || !myUserData) return
		const { school } = myUserData;
		const code = school.schoolCode ?? null;
		if (!code) return
		fetchSchoolByCode(code).then((info) => {
			const { memberList } = info;
			const list = memberList?.filter((item) => item.isTeacher === true).map((item) => { return { value: item.uid, label: item.name } });
			setTeacherList(list);
		})
	}
	//교사 선택
	const handleSelectOnChange = (event) => {
		const { value } = event;
		setTeacherId(value);
	}
	//교사 정보 
	const bindTeacherInfo = () => {
		if (!selectedTeacher) return;
		bindShopItemList(selectedTeacher?.shopItemList);
	}
	//아이템 사용
	const handleUseOnClick = (item) => {
		const { title, quantity } = item;
		const result = window.confirm(`${title} 1개를 사용합니다. 사용후 남은 수량은 ${quantity - 1}개 입니다. 꼭 선생님 앞에서 사용하세요.`);
		if (!result) return
		if (quantity - 1 <= 0) { deleteUserArrayInfo(user.uid, "purchasedItemList", item); }
		else {
			deleteUserArrayInfo(user.uid, "purchasedItemList", item);
			updateUserArrayInfo(user.uid, "purchasedItemList", { ...item, quantity: quantity - 1 });
		}
	}
	//------교사용 랜더링------------------------------------------------  
	const SoldItem = ({ item }) => {
		const { title, quantity, stock, student, cost } = item;
		return <InventoryItem>
			<CloseButton onClick={() => { deleteUserArrayInfo(user.uid, "soldItemList", item); }}>x</CloseButton>
			<Text>판매 아이템: {title}</Text>
			<Text>판매량: {quantity}개</Text>
			<Text>남은 재고: {stock}개</Text>
			<Text>구매자: {student} 학생</Text>
			<Row>
				<Text>수입: {cost}</Text>
				<img src={rira_gem} alt="리라" width={"25px"} />
			</Row>
		</InventoryItem>
	}
	//------학생용 랜더링------------------------------------------------  
	const PurchasedItem = ({ item }) => {
		const { title, quantity, cost } = item;
		return <InventoryItem>
			<CenterRow><Title>{title}</Title></CenterRow>
			<Text>보유량: {quantity}개</Text>
			<Row>
				<Text>지출: {cost}</Text>
				<img src={rira_gem} alt="리라" width={"25px"} />
			</Row>
			<CenterRow><SmallBtn btnColor={"#9b0c24"} hoverBtnColor={"red"} onClick={() => { handleUseOnClick(item) }}>사용</SmallBtn></CenterRow>
		</InventoryItem>
	}

	return (<>
		{!user.isTeacher && <SubNav styles={{ padding: "10px" }}><Select options={teacherList} onChange={(event) => { handleSelectOnChange(event) }} />선생님의 상점</SubNav>}
		<Container>
			<GridWrapper>
				<PixiShopStage shopItemList={_shopItemList} setIsModal={setIsModal} setSelected={setSelectedGift} />
				<Inventory>{user.isTeacher
					? myUserData?.soldItemList?.map((item, index) => <SoldItem key={index} item={item} />)
					: myUserData?.purchasedItemList?.map((item, index) => <PurchasedItem key={index} item={item} />)
				}
				</Inventory>
			</GridWrapper>
		</Container>
		<ShopItemModal show={isModal} onHide={() => { setIsModal(false); }} rira={myUserData?.rira ?? 0} giftImgList={giftImgList} selected={selectedGift} teacherId={teacherId} />
	</>
	)
}
const Container = styled.div`
	box-sizing: border-box;
  min-height: 350px;
`
const GridWrapper = styled.div`
	display: grid;
	grid-template-columns: 1200px 400px;
	width: 1600px;
	margin: 0 auto;
`
const Row = styled.div`
	display: flex;
`
const CenterRow = styled(Row)`
	justify-content: center;
`
const Inventory = styled.li`
	display: flex;
	height: 900px;
	gap: 1px;
	flex-direction: column;
	border: 8px solid #e7cdb3;
	background-color: #fdf5d9;
	color: black;
	overflow-y: scroll;
`
const InventoryItem = styled.div`
	position: relative;
	padding: 5px;	
	border: 5px solid #9a5b2c;
	border-radius: 10px;
	background-color: #e7cdb3;
`
const Text = styled.p`
	margin: 0;
`
const Title = styled(Text)`
	font-size: 20px;
`
const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem; // 크기 조절 가능
  cursor: pointer;
  line-height: 1;
  padding: 0.2rem 0.2rem;
  position: absolute;
	top: 0.1rem;
  right: 0.2rem;
  &:hover {
    color: red;
  }
`;

export default ShopMainPage
