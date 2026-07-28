import React, { useEffect, useRef, useState } from 'react'
import { Badge, Spinner } from 'react-bootstrap'
//컴포넌트
import styled from 'styled-components'
import Title from '../../../components/Title/Title'
import DotTitle from '../../../components/Title/DotTitle'
import ClickableIcon from '../../../components/Styled/ClickableIcon'
import ClickableText from '../../../components/Styled/ClickableText'
import BattlePremiumModal from '../../../components/Modal/BattlePremiumModal'
//hooks
import useFileCheck from '../../../hooks/useFileCheck'
import useStorage from '../../../hooks/useStorage'
import {
  BATTLE_PREMIUM_DURATION_DAYS,
  BATTLE_PREMIUM_PRICE,
  getPremiumUntilMillis,
  isUserBattlePremium,
} from '../../../utils/premiumUtils'
//이미지
import unknown from '../../../image/icon/unkown_icon.png'
import useFireUserData from '../../../hooks/Firebase/useFireUserData'
//생성(260206)
const MyinfoSection = ({ userRtData, updateUserInfo, isFromInfoPage }) => {
  useEffect(() => { bindMyInfo(); }, [userRtData]);
  const { deleteUserTransaction } = useFireUserData();
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [premiumUntilOverride, setPremiumUntilOverride] = useState(null);
  //프로필 변경
  const inputFileRef = useRef(null);
  const [newImgFile, setNewImgFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getIsImageCheck } = useFileCheck();
  const { saveProfileImgStorage } = useStorage();
  useEffect(() => { changeProfileImg(); }, [newImgFile]);
  const storedPremiumUntilMillis = getPremiumUntilMillis(userRtData?.battlePremiumUntil);
  const premiumUntilMillis = Math.max(
    storedPremiumUntilMillis ?? 0,
    premiumUntilOverride ?? 0
  );
  const isPremium = isUserBattlePremium({
    battlePremiumUntil: premiumUntilMillis,
  });
  const formattedPremiumUntil = premiumUntilMillis
    ? new Date(premiumUntilMillis).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : null;
  //**함수**
  //바인딩
  const bindMyInfo = () => {
    if (!userRtData) return;
    setName(userRtData.name ?? '');
    setPhoneNumber(userRtData.phoneNumber ?? '');
    setEmail(userRtData.email ?? '');
    setProfileImg(userRtData.profileImg ?? '');
  }
  //프로필 사진 변경
  const handleInputFileOnChange = (event) => {
    const file = event.target.files[0];
    setNewImgFile(file);
  }
  //프로필 변경 시,
  const changeProfileImg = () => {
    if (!newImgFile) return;
    if (!getIsImageCheck(newImgFile.name)) { alert("이미지 파일만 가능합니다."); return; }
    const reader = new FileReader();
    reader.readAsDataURL(newImgFile)
    reader.onloadend = () => setProfileImg(reader.result);
  };
  //사진 삭제
  const handleImgDeleteOnClcick = () => {
    setProfileImg('');
    setNewImgFile(null);
  }
  //클립보드 복사
  const handleCopyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      window.alert(`${label}이(가) 복사되었습니다.`);
    }).catch((err) => {
      window.alert("복사에 실패했습니다.");
      console.error(err);
    })
  }
  //확인
  const handleSaveOnClick = async () => {
    setIsLoading(true);
    const confirm = window.confirm("이대로 회원정보를 수정하시겠습니까?");
    if (!confirm) return;
    let myInfo;
    if (newImgFile) {
      const newImgUrl = await saveProfileImgStorage(newImgFile);
      myInfo = { name, phoneNumber, email, profileImg: newImgUrl };
    } else {
      myInfo = { name, phoneNumber, email, profileImg };
    }
    try { updateUserInfo(myInfo); }
    catch (error) { alert(`관리자에게 문의하세요(useFireUserData_02), ${error}`); }
    setIsEdit(false);
    setIsLoading(false);
  }
  //취소
  const handleCancelOnClick = () => {
    bindMyInfo();
    setIsEdit(false);
    setNewImgFile(null);
  };
  //회원 탈퇴
  const handleLeaveOnClick = () => {
    if (userRtData.school) { alert("학교를 먼저 탈퇴하고 회원 탈퇴를 진행해주세요."); return; }
    const prompt = window.prompt("회원 탈퇴는 모든 클래스와 학생정보가 삭제되며 절대로 복구할 수 없습니다. 진행하려면 '탈퇴합니다'를 입력해주세요");
    if (prompt !== "탈퇴합니다") return;
    const confirm = window.confirm("확인을 누르면 탈퇴가 진행됩니다ㅠㅠ영원한 이별은 아니겠죠?");
    if (!confirm) { alert("잘 생각하셨어요:D 내가 더 잘할게요"); return; }
    alert("작별이다! 다음에 더 좋은 모습으로 만나요 :D");
    deleteUserTransaction();
  }
  //배틀 프리미엄 구매 완료 시 서버가 반환한 만료일을 즉시 화면에 반영
  const handlePremiumPurchaseSuccess = (purchase) => {
    setPremiumUntilOverride(purchase.premiumUntilMillis);
    setIsPremiumModalOpen(false);
  }
  return (
    <section>
      <InfoWrapper>
        <Column style={{ gap: "15px" }}>
          <Title>회원 정보</Title>
          <Row style={{ gap: "10px" }}>
            <DotTitle>고유 번호</DotTitle>
            <span> {userRtData?.uid ?? "에러, 다시 시도 바랍니다."}</span>
            <ClickableIcon className="fa-solid fa-copy" onClick={() => handleCopyToClipboard(userRtData?.uid, "고유번호")} styles={{ fontSize: "14px" }} />
          </Row>
          <Row>
            <DotTitle>회원 구분</DotTitle>
            <span>{userRtData?.isTeacher ? "교사 회원" : "학생 회원"} </span>
          </Row>
          <Row>
            <DotTitle>소속 학교</DotTitle>
            <span>{userRtData?.school?.schoolName ?? "등록된 학교가 없습니다."}</span>
          </Row>
          <Row>
            <DotTitle>성함</DotTitle>
            {!isEdit
              ? <span>{name ?? "로딩"}</span>
              : <TextInput type='text' onChange={(event) => setName(event.target.value)} value={name} />}
          </Row>
          <Row>
            <DotTitle>연락처</DotTitle>
            {!isEdit
              ? <span>{phoneNumber ?? "등록된 연락처가 없습니다."}</span>
              : <TextInput type='text' onChange={(event) => setPhoneNumber(String(event.target.value))} value={phoneNumber} />}
          </Row>
          <Row>
            <DotTitle>이메일</DotTitle>
            {!isEdit
              ? <span>{email ?? "등록된 이메일이 없습니다."}</span>
              : <TextInput type='text' onChange={(event) => { setEmail(event.target.value) }} value={email} />}
          </Row>
          <DotTitle>이용중인 이용권</DotTitle>
        </Column>
        <ImgWrapper>
          <ProfileImg src={profileImg || unknown} alt="프로필 이미지" />
          <input ref={inputFileRef} type="file" onChange={handleInputFileOnChange} accept={"image/*"} style={{ display: "none" }} />
          <Column style={{ gap: "6px", width: "120px", marginTop: "5px" }}>
            {isEdit && <Badge bg="primary" onClick={() => inputFileRef.current.click()} style={{ cursor: "pointer" }}>사진 변경</Badge>}
            {isEdit && <Badge bg="primary" onClick={handleImgDeleteOnClcick} style={{ cursor: "pointer" }}>사진 삭제</Badge>}
          </Column>
        </ImgWrapper>
      </InfoWrapper>
      {(isFromInfoPage && userRtData?.isTeacher) && (
        <PremiumInfoButton
          type="button"
          $active={isPremium}
          onClick={() => setIsPremiumModalOpen(true)}
          aria-label="배틀 프리미엄 구매 안내 열기"
        >
          <PremiumInfoCopy>
            <PremiumEyebrow>
              {isPremium ? 'BATTLE PREMIUM' : 'BATTLE FREE'}
            </PremiumEyebrow>
            <strong>배틀 프리미엄</strong>
            <span>
              만료일: {formattedPremiumUntil ?? '등록된 만료일이 없습니다.'}
            </span>
            {!isPremium && (
              <small>
                {BATTLE_PREMIUM_PRICE.toLocaleString()}리라로{' '}
                {BATTLE_PREMIUM_DURATION_DAYS}일 동안 이용할 수 있습니다.
              </small>
            )}
          </PremiumInfoCopy>
          <PremiumAction>
            {isPremium ? '30일 연장' : '구매하기'}
            <span aria-hidden="true">›</span>
          </PremiumAction>
        </PremiumInfoButton>
      )}
      {(!isEdit && isFromInfoPage) && <EditRow>
        <ClickableText onClick={() => setIsEdit(true)}>회원 정보 변경</ClickableText>
        <ClickableText onClick={handleLeaveOnClick}>쫑알이 회원 탈퇴</ClickableText>
      </EditRow>}
      {isEdit && <Row style={{ gap: "5px" }}>
        <ClickableIcon className='fa-solid fa-check' onClick={handleSaveOnClick}></ClickableIcon>
        <ClickableIcon className='fa-solid fa-x' onClick={handleCancelOnClick} ></ClickableIcon>
      </Row>}
      {isLoading && <Center><Spinner /></Center>}
      <BattlePremiumModal
        show={isPremiumModalOpen}
        onHide={() => setIsPremiumModalOpen(false)}
        onPurchaseSuccess={handlePremiumPurchaseSuccess}
      />
    </section >
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const Center = styled(Row)`
  justify-content: center;
`
const InfoWrapper = styled(Row)`
  @media(max-width: 768px){
    flex-direction: column;
  }
`
const ImgWrapper = styled(Column)`
  justify-content: flex-start; 
  align-items: flex-end;
  flex-grow: 1;
   @media(max-width: 768px){
    align-items: center;
    margin: 10px 0;
  }
`
const TextInput = styled.input`
  height: 35px;
  border-radius: 5px;
  border: #787878 1px solid;
  padding: 5px;
`
const ProfileImg = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 15px;
  border: 1px solid #787878;
  padding: 5px;
`
const PremiumInfoButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  margin-top: 22px;
  padding: 18px 20px;
  border: 1px solid ${({ $active }) => $active ? '#b9c5f8' : '#dfe3ec'};
  border-radius: 14px;
  color: #30384f;
  background: ${({ $active }) => $active
    ? 'linear-gradient(120deg, #eef1ff, #fafbff)'
    : '#f8f9fc'};
  text-align: left;
  cursor: pointer;
  transition: transform .16s ease, box-shadow .16s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(34, 52, 104, .1);
  }

  &:focus-visible {
    outline: 3px solid rgba(52, 84, 209, .28);
    outline-offset: 2px;
  }

  @media(max-width: 520px) {
    align-items: flex-start;
    flex-direction: column;
  }
`
const PremiumInfoCopy = styled.span`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong { font-size: 17px; }
  span { color: #5f6779; font-size: 13px; }
  small { color: #7a8399; font-size: 12px; }
`
const PremiumEyebrow = styled.span`
  color: #3454d1 !important;
  font-size: 10px !important;
  font-weight: 900;
  letter-spacing: .12em;
`
const PremiumAction = styled.span`
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 7px;
  color: #3454d1;
  font-size: 13px;
  font-weight: 850;

  span { font-size: 21px; line-height: 1; }
`
const EditRow = styled(Row)`
  justify-content: flex-end;
  gap: 20px;
  margin-top: 10px;
`

export default MyinfoSection
