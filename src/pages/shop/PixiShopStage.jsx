//라이브러리
import * as PIXI from 'pixi.js'; //pixi 쓸 때 필수!
import { useEffect, useState } from 'react'
import { Sprite, Stage, Text } from '@pixi/react';
import { useSelector } from 'react-redux';
//컴포넌트
import Background from '../../components/Game/Background';
import ShopItemBox from './ShopItemBox';
//hook
import useFetchStorageImg from '../../hooks/Game/useFetchStorageImg';
//이미지
import qustion_icon from '../../image/icon/question.png'
//데이터
import hintList from '../../data/hintList';

//생성(250624)
const PixiShopStage = ({ setIsModal, shopItemList, setSelected }) => {
	const user = useSelector(({ user }) => user);
	const { fetchImgUrl } = useFetchStorageImg();
	//배경, 주인, 말풍선
	const [background, setBackground] = useState(null);
	const [catImg, setCatImg] = useState(null);
	const [speechBubble, setSpeechBubble] = useState(null);
	useEffect(() => { fetchImg(); }, []);
	//선물 이미지
	const [giftImgList, setGiftImgList] = useState([null, null, null, null, null, null, null, null]);
	useEffect(() => { fetchGiftImgList(); }, [shopItemList]);
	//말풍선 도움말
	const { TeacherShopHintList, StudentShopHintList } = hintList;
	const [_hintList, setHintList] = useState([]);
	useEffect(() => { if (user.isTeacher) { setHintList(TeacherShopHintList) } else { setHintList(StudentShopHintList) } }, [])
	const [hintNumber, setHintNumber] = useState(0);

	//------함수부------------------------------------------------  
	//기본 이미지
	const fetchImg = () => {
		fetchImgUrl('images/store_basic.png', setBackground);
		fetchImgUrl('images/store_cat.png', setCatImg);
		fetchImgUrl('images/store_speech_bubble.png', setSpeechBubble);
	}
	//선물 이미지
	const fetchGiftImgList = async () => {
		if (shopItemList.length === 0) return
		const arr = [];
		await shopItemList.forEach((item, index) => {
			if (!item) { arr[index] = null; }
			else { fetchImgUrl(item.giftPath).then((result) => { arr[index] = result; }) }
		});
		setGiftImgList(arr);
	};
	//선물 클릭
	const handleNthGiftOnClick = (index) => {
		if (user.isTeacher) { //교사
			setIsModal(true);
			setSelected({ item: shopItemList[index], index });
		} else { //학생
			if (!shopItemList[index]) { alert("등록된 상품이 없습니다.") }
			else {
				setIsModal(true);
				setSelected({ item: shopItemList[index], index });
			}
		}
	}
	//힌트 클릭
	const handleHintOnClick = () => {
		if (_hintList.length - 1 === hintNumber) { setHintNumber(0); }
		else { setHintNumber(prev => prev + 1) }
	}

	return (<Stage width={1200} height={900}>
		<Background src={background || qustion_icon} width={1200} height={900} />
		<Sprite
			image={catImg || qustion_icon}
			x={850}
			y={350}
			width={200}
			height={200}
			eventMode="static"
			cursor="pointer"
			pointerdown={handleHintOnClick}
		/>
		<Sprite
			image={speechBubble || qustion_icon}
			x={475}
			y={200}
			width={425}
			height={225}
			eventMode="static"
			cursor="pointer"
			pointerdown={handleHintOnClick}
		/>
		{_hintList.length !== 0 && <Text Text text={`${_hintList[hintNumber]}`} x={700} y={300} anchor={0.5} style={{ fontSize: 20, fontWeight: 'bold', }} ></Text>}
		<ShopItemBox x={50} y={600} width={90} height={90} onClick={() => { handleNthGiftOnClick(0) }} src={giftImgList[0] || qustion_icon} />
		<ShopItemBox x={180} y={600} width={90} height={90} onClick={() => { handleNthGiftOnClick(1) }} src={giftImgList[1] || qustion_icon} />
		<ShopItemBox x={50} y={725} width={90} height={90} onClick={() => { handleNthGiftOnClick(2) }} src={giftImgList[2] || qustion_icon} />
		<ShopItemBox x={180} y={725} width={90} height={90} onClick={() => { handleNthGiftOnClick(3) }} src={giftImgList[3] || qustion_icon} />
		<ShopItemBox x={350} y={600} width={90} height={90} onClick={() => { handleNthGiftOnClick(4) }} src={giftImgList[4] || qustion_icon} />
		<ShopItemBox x={475} y={600} width={90} height={90} onClick={() => { handleNthGiftOnClick(5) }} src={giftImgList[5] || qustion_icon} />
		<ShopItemBox x={350} y={725} width={90} height={90} onClick={() => { handleNthGiftOnClick(6) }} src={giftImgList[6] || qustion_icon} />
		<ShopItemBox x={475} y={725} width={90} height={90} onClick={() => { handleNthGiftOnClick(7) }} src={giftImgList[7] || qustion_icon} />
	</Stage >
	)
}

export default PixiShopStage
