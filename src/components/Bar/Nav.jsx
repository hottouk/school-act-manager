//라이브러리
import React, { useEffect, useState } from 'react';
import { Link, } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Badge } from 'react-bootstrap';
import styled from 'styled-components';
//컴포넌트
import DropDownBtn from '../Btn/DropDownBtn';
//hooks
import useFetchRtMyUserData from '../../hooks/RealTimeData/useFetchRtMyUserData';
import useMediaQuery from '../../hooks/useMediaQuery';
//이미지
import brandLogo from "../../image/icon/h-logo.png";
import unknown from '../../image/icon/unkown_icon.png';
import useLogout from '../../hooks/useLogout';
//240222(생성) -> 250202(갱신) -> 250215(모바일 수정) -> 260217(학생 삭제)
const Nav = () => {
  //준비
  const user = useSelector(({ user }) => { return user });
  const { logout } = useLogout(); //로그아웃
  const { myUserData } = useFetchRtMyUserData();
  const [_profileImg, setProfileImg] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  //모드
  const isMobile = useMediaQuery("(max-width: 768px)");
  //모달
  const [isNew, setIsNew] = useState(false); //새소식 아이콘
  useEffect(() => {
    const bindData = () => {
      setProfileImg(myUserData?.profileImg || null);//프로필 사진
      if (myUserData?.onSubmitList?.length) { setIsNew(true) }
      else { setIsNew(false) }
    }
    bindData();
  }, [myUserData]);
  //**함수부**
  //축 이동
  const scrollToIntroSection = (id) => {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  //소개
  const handleIntroClick = (event) => {
    event.preventDefault();
    setIsMenuOpen(false);
    scrollToIntroSection("whats-special");
  };
  return (<Container>
    <Helmet>
      {/*폰트어썸 라이브러리*/}
      <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer" />
    </Helmet>
    {!isMobile && <>
      {/* PC 교사 */}
      <Link to="/" style={{ display: "flex" }}>
        <LogoImg src={brandLogo} alt="로고" />
        <BrandTitle>생기부 쫑알이</BrandTitle>
      </Link>
      {user.uid && <>
        <Row style={{ alignItems: "center" }}><p style={{ margin: "0 20px" }}>{user.name} 선생님 사랑합니다.</p></Row>
        <MenuWrapper>
          {!isMobile && <li id="acti_btn" ><Icon className="fa-solid fa-scroll"></Icon>
            <DropDownBtn btnName={"활동 관리"}
              dropDownItems={[
                { href: "activities_setting", label: "새 활동" },
                { href: "activities", label: "나의 활동" },
                { href: "activities_all", label: "전체 활동", itemState: "acti_all" }]} />
          </li>}
          <li>
            <Icon className="fa-solid fa-chalkboard"></Icon>
            <DropDownBtn btnName={"클래스 관리"}
              dropDownItems={[
                { href: "classrooms_setting", itemState: { step: "first" }, label: "새 클래스" },
                { href: "classrooms", label: "나의 클래스" },
              ]} />
          </li>
          <li><Icon className="fa-solid fa-database" />
            <DropDownBtn btnName={"단어 관리"}
              dropDownItems={[
                { href: "quiz_setting", label: "새 단어장" },
                { href: "quiz", label: "나의 단어장" },
                { href: "quiz_public", label: "공개 단어장" },
              ]} />
          </li>
          <li><Icon className="fa-solid fa-star" />
            <DropDownBtn btnName={"문제 관리"}
              dropDownItems={[
                { href: "exam_setting", label: "새 문제" },
                { href: "exam", label: "나의 문제" },
              ]} />
          </li>
          <li>
            <Link to="/myschool">
              <Icon className="fa-solid fa-school"></Icon>
              <span>나의 학교</span>
            </Link>
          </li>
          {user.isMaster && <li id="lab_btn" ><Link to="/lab"><Icon className="fa-solid fa-khanda"></Icon>
            <span>실험실</span></Link></li>}
          {user.isMaster && <li><Link to="/store"><Icon className="fa-solid fa-store"></Icon>
            <span>상점</span></Link></li>}
          {user.isMaster && <li id="master_btn" ><Link to="/master"><Icon className="fa-solid fa-key"></Icon>
            <span>마스터</span></Link></li>}
          <li><Link to="/purchase"><Icon className="fa-solid fa-key"></Icon>
            <span>충전</span></Link></li>
          <NewsWrapper >
            {isNew && <NewIcon><Badge bg="danger">new</Badge></NewIcon>}
            <Link to="/news"><Icon className="fa-solid fa-bell"></Icon></Link>
          </NewsWrapper>
        </MenuWrapper>
        <Link to="/myinfo">
          <ProfileImg className="profileImg" src={_profileImg || unknown} alt="프로필 이미지" />
        </Link>
      </>}
    </>}
    {/* 모바일*/}
    {isMobile &&
      <Row style={{ width: "100%", padding: "10px", alignItems: "center", justifyContent: "space-between" }}>
        <Link to={"/"} style={{ display: "flex" }}>
          <LogoImg src={brandLogo} />
          <BrandTitle>쫑알이</BrandTitle>
        </Link>
        <Row style={{ alignItems: "center", gap: "15px" }}>
          <Link to="/news"><Icon className="fa-solid fa-bell"></Icon></Link>
          {!isMenuOpen && <i className='fa-solid fa-bars' style={{ fontSize: "1.5rem" }} onClick={() => setIsMenuOpen(true)} />}
          {isMenuOpen && <i className='fa-solid fa-x' style={{ fontSize: "1.5rem" }} onClick={() => setIsMenuOpen(false)} />}
        </Row>
      </Row>
    }
    <MobileMenuWrapper $open={isMenuOpen}>
      <MobileMenuList>
        {user.uid && <>
          <MoebileLi><Link to="/activities" onClick={() => setIsMenuOpen(false)}>활동 관리</Link></MoebileLi>
          <MoebileLi><Link to="/activities_all" onClick={() => setIsMenuOpen(false)}>전체 활동</Link></MoebileLi>
          <MoebileLi><Link to="/classrooms" onClick={() => setIsMenuOpen(false)}>클래스 관리</Link></MoebileLi>
          {/* <MoebileLi><Link to="/quiz" onClick={() => setIsMenuOpen(false)}>단어장 관리</Link></MoebileLi> */}
          <MoebileLi><Link to="/exam" onClick={() => setIsMenuOpen(false)}>문제 관리</Link></MoebileLi>
          <MoebileLi><Link to="/myinfo" onClick={() => setIsMenuOpen(false)}>내 정보</Link></MoebileLi>
          <MoebileLi><Link to="/purchase" onClick={() => setIsMenuOpen(false)}>충전</Link></MoebileLi>
          <MoebileLi style={{ fontSize: "15px" }} onClick={() => logout()}>로그아웃</MoebileLi>
        </>}
        {!user.uid && <>
          <MoebileLi><Link to="/activities" onClick={handleIntroClick}>앱 소개</Link></MoebileLi>
        </>}
      </MobileMenuList>
    </MobileMenuWrapper>
  </Container>
  )
}
const Row = styled.div`
  display: flex;
`
const MobileMenuWrapper = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  margin-top: 12%;
  overflow: hidden;
  max-height: ${({ $open }) => ($open ? "420px" : "0")};
  transform: translateY(${({ $open }) => ($open ? "0" : "-8px")});
  transition: max-height 280ms ease, opacity 220ms ease, transform 220ms ease;
  will-change: max-height, transform;
`;
const MobileMenuList = styled.ul`
  list-style: none; 
  padding: 12px;
  background: #3454d1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Container = styled(Row)`
  background-color: #3454d1;
  align-items: center;
  padding: 20px 30px;
  color: #efefef;
  a {
    color: #efefef;
    text-decoration: none;
  }
  @media screen and (max-width: 768px){
    position: fixed;
    top: 0;
    flex-direction: column;
    width: 100%;
    height: 60px;
    padding: 0;
    z-index: 998;
    a { font-size: 12px; }
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
`
const Icon = styled.i`
  margin-right: 5px;
  @media (max-width: 768px) {
    font-size: 1.1rem;
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
  color: white;
  a { font-size: 15px; }
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