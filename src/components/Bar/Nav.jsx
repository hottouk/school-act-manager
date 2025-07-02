//라이브러리
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Badge } from 'react-bootstrap';
import styled from 'styled-components';
//컴포넌트
import DropDownBtn from '../Btn/DropDownBtn';
import MyInfoModal from '../Modal/MyInfoModal';
//hooks
import useFetchRtMyUserData from '../../hooks/RealTimeData/useFetchRtMyUserData';
import useMediaQuery from '../../hooks/useMediaQuery';
//이미지
import brandLogo from "../../image/icon/h-logo.png";
import unknown from '../../image/icon/unkown_icon.png';

//240222(생성) -> 250202(갱신) -> 250215(모바일 수정)
const Nav = () => {
  //준비
  const user = useSelector(({ user }) => { return user });
  const { myUserData } = useFetchRtMyUserData();
  const [_profileImg, setProfileImg] = useState(null);
  //모드
  const isMobile = useMediaQuery("(max-width: 768px)");
  //모달
  const [isMyInfoShow, setIsMyInfoShow] = useState(false);
  const [isNew, setIsNew] = useState(false); //새소식 아이콘
  useEffect(() => { bindData(); }, [myUserData]);

  //------함수부------------------------------------------------ 
  const bindData = () => {
    setProfileImg(user.profileImg);//프로필 사진
    if (myUserData?.onSubmitList?.length) { setIsNew(true) } else { setIsNew(false) }
  }

  return (<Container>
    <Helmet>
      {/*폰트어썸 라이브러리*/}
      <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer" />
    </Helmet>
    {!user.uid && <>
      <MenuWrapper>
        <li><Link to='/login'><Icon className="fa-solid fa-key"></Icon> <span>로그인</span></Link></li>
      </MenuWrapper></>}
    {(user.isTeacher && !isMobile) && <>
      {/* PC 교사 */}
      <LogoImg src={brandLogo} alt="로고" />
      <BrandTitle>생기부 쫑알이</BrandTitle>
      <Row style={{ alignItems: "center" }}><p style={{ margin: "0 20px" }}>{user.name} 선생님 사랑합니다.</p></Row>
      <MenuWrapper>
        <li><Link to="/"><Icon className="fa-solid fa-house"></Icon>
          <span>Home</span></Link></li>
        {!isMobile && <li id="acti_btn" ><Icon className="fa-solid fa-scroll"></Icon>
          <DropDownBtn btnName={"활동 관리"}
            dropDownItems={[
              { href: "activities", label: "나의 활동" },
              { href: "activities_all", label: "전체 활동", itemState: "acti_all" }]} />
        </li>}
        <li><Link to="/classRooms"><Icon className="fa-solid fa-chalkboard"></Icon>
          <span>클래스 관리</span></Link></li>
        <li><Link to="/quiz"><Icon className="fa-solid fa-database"></Icon>
          <span>퀴즈 관리</span></Link></li>
        <li><Link to="/myschool"><Icon className="fa-solid fa-school"></Icon>
          <span>나의 학교</span></Link></li>
        {/* {user.isMaster && <li id="lab_btn" ><Link to="/lab"><Icon className="fa-solid fa-khanda"></Icon>
          <span>실험실</span></Link></li>} */}
        <li><Link to="/store"><Icon className="fa-solid fa-store"></Icon>
          <span>상점</span></Link></li>
        {user.isMaster && <li id="master_btn" ><Link to="/master"><Icon className="fa-solid fa-key"></Icon>
          <span>마스터</span></Link></li>}
        <NewsWrapper >
          {isNew && <NewIcon><Badge bg="danger">new</Badge></NewIcon>}
          <Link to="/news"><Icon className="fa-solid fa-bell"></Icon></Link>
        </NewsWrapper>
      </MenuWrapper>
      {_profileImg && <ProfileImg className="profileImg" src={_profileImg} alt="프로필 이미지" onClick={() => setIsMyInfoShow(true)} />}
      {!_profileImg && <ProfileImg className="profileImg" src={unknown} alt="프로필 이미지" onClick={() => setIsMyInfoShow(true)} />}
    </>}
    {/* PC 학생 */}
    {(user.uid && !user.isTeacher && !isMobile) && <>
      <LogoImg src={brandLogo} alt="로고" />
      <BrandTitle>생기부 쫑알이</BrandTitle>
      <Row style={{ alignItems: "center" }}><p style={{ margin: "0 20px" }}>{user.name} 학생 사랑합니다.</p></Row>
      <MenuWrapper>
        <li><Link to="/"><Icon className="fa-solid fa-house"></Icon>
          <span>Home</span></Link></li>
        <li><Link to="/classRooms"><Icon className="fa-solid fa-chalkboard"></Icon>
          <span>참여 클래스</span></Link></li>
        <li><Link to="/myschool"><Icon className="fa-solid fa-school"></Icon>
          <span>나의 학교</span></Link></li>
        <li><Link to="/store"><Icon className="fa-solid fa-store"></Icon>
          <span>상점</span></Link></li>
        <NewsWrapper>
          {isNew && <NewIcon><Badge bg="danger">new</Badge></NewIcon>}
          <Link to="/news" ><Icon className="fa-solid fa-bell" /></Link>
        </NewsWrapper>
      </MenuWrapper>
      {_profileImg && <ProfileImg className="profileImg" src={_profileImg} alt="프로필 이미지" onClick={() => setIsMyInfoShow(true)} />}
      {!_profileImg && <ProfileImg className="profileImg" src={unknown} alt="프로필 이미지" onClick={() => setIsMyInfoShow(true)} />}

    </>}
    {/* 모바일 교사*/}
    {(user.isTeacher && isMobile) && <>
      <MenuWrapper>
        <MoebileLi><Link to="/"><Icon className="fa-solid fa-house"></Icon></Link></MoebileLi>
        <MoebileLi><Link to="/classRooms"><Icon className="fa-solid fa-chalkboard"></Icon></Link></MoebileLi>
        <NewsWrapper>
          {isNew && <NewDot>.</NewDot>}
          <Link to="/news"><Icon className="fa-solid fa-bell"></Icon></Link>
        </NewsWrapper>
        <MoebileLi><Icon className="fa-solid fa-user" onClick={() => setIsMyInfoShow(true)}></Icon></MoebileLi>
      </MenuWrapper>
    </>}
    {/* 모바일 학생 */}
    {(user.uid && !user.isTeacher && isMobile) && <>
      <MenuWrapper>
        <MoebileLi><Link to="/"><Icon className="fa-solid fa-house"></Icon></Link></MoebileLi>
        <MoebileLi><Link to="/classRooms"><Icon className="fa-solid fa-chalkboard"></Icon></Link></MoebileLi>
        <MoebileLi><Link to="/myschool"><Icon className="fa-solid fa-school"></Icon></Link></MoebileLi>
        <MoebileLi><Icon className="fa-solid fa-user" onClick={() => setIsMyInfoShow(true)}></Icon></MoebileLi>
        <NewsWrapper>
          {isNew && <NewDot>.</NewDot>}
          <Link to="/news"><Icon className="fa-solid fa-bell"></Icon></Link>
        </NewsWrapper>
      </MenuWrapper>
    </>}
    {/*개인 정보 수정 Modal 창 */}
    <MyInfoModal
      show={isMyInfoShow}
      onHide={() => setIsMyInfoShow(false)}
      isMobile={isMobile}
    />
  </Container >
  )
}
const Container = styled.nav`
  width: 100%;
  display: flex;
  background-color: #3454d1;
  align-items: center;
  padding: 20px 30px;
  color: #efefef;
  a {
    color: #efefef;
    text-decoration: none;
  }
  @media screen and (max-width: 767px){
    display: flex;
    position: fixed; 
    bottom: 0;
    height: 10%;
    background-color: #efefef;
    padding: 5px;
    z-index: 999;
    a {
      color: #3454d1;
      font-size: 12px;
    }
`
const Row = styled.div`
  display: flex;
`
const NewsWrapper = styled.li`
  position: relative;
`
const LogoImg = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`
const BrandTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  color: #efefef;
  font-weight: bold;   
`
const MenuWrapper = styled.ul`
  margin-bottom: 0;
  padding: 0 30px;
  flex-grow: 2;
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 30px;
  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 0;
    gap: 0;
  }
`
const Icon = styled.i`
  margin-right: 5px;
  @media (max-width: 768px) {
    font-size: 25px;
    margin: 0;
  }
`
const NewIcon = styled.div`
  position: absolute;
  top: -25px;
  right: -8px;
`
const ProfileImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  cursor: pointer;
`
const MoebileLi = styled.li`
  color: #3454d1;
  display: flex;
`
const NewDot = styled.div`
  position: absolute;
  top: -10px;
  left: 20px;
  background-color: red;
  width: 10px;
  height: 10px;
  border-radius: 10px;
  color: #efefef;
`
export default Nav