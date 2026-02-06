import React, { useEffect, useState } from 'react'
import { Badge } from 'react-bootstrap'
//컴포넌트
import styled from 'styled-components'
import Title from '../Title/Title'
import DotTitle from '../Title/DotTitle'
import ClickableIcon from '../Styled/ClickableIcon'
//이미지
import unknown from '../../image/icon/unkown_icon.png'
//생성(260206)
const MyinfoSection = ({ myUserData }) => {
  //클립보드 복사
  const handleCopyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      window.alert(`${label}이(가) 복사되었습니다.`)
    }).catch((err) => {
      window.alert("복사에 실패했습니다.")
      console.error(err)
    })
  }
  return (
    <section>
      <Row>
        <Column style={{ gap: "15px" }}>
          <Title>회원 정보</Title>
          <Row style={{ gap: "10px" }}>
            <DotTitle>고유 번호</DotTitle>
            <span> {myUserData?.uid ?? "에러, 다시 시도 바랍니다."}</span>
            <ClickableIcon className="fa-solid fa-copy" onClick={() => handleCopyToClipboard(myUserData?.uid, "고유번호")} styles={{ fontSize: "14px" }} />
          </Row>
          <Row>
            <DotTitle>성함</DotTitle>
            <span>{myUserData?.name ?? "로딩"}</span>
          </Row>
          <Row>
            <DotTitle>회원 구분</DotTitle>
            <span>{myUserData?.isTeacher ? "교사 회원" : "학생 회원"} </span>
          </Row>
          <Row>
            <DotTitle>연락처</DotTitle>
            <span>{myUserData?.phoneNumber ?? "등록된 연락처가 없습니다."}</span>
          </Row>
          <Row>
            <DotTitle>이메일</DotTitle>
            <span>{myUserData?.email ?? "등록된 이메일이 없습니다."}</span>
          </Row>
          <Row>
            <DotTitle>소속 학교</DotTitle>
            <span>{myUserData?.school?.schoolName ?? "등록된 학교가 없습니다."}</span>
          </Row>
        </Column>
        <Column style={{ alignItems: "flex-end", flexGrow: "1", }}>
          <Column style={{ justifyContent: "center", gap: "5px" }}>
            <ProfileImg src={myUserData?.profileImg || unknown} alt="프로필 이미지" />
            <input id="profile_img_btn" type="file" onChange={(() => { })} accept={"image/*"} style={{ display: "none" }} />
            <Badge bg="primary" id="delete_img_btn" onClick={() => { }}>사진 삭제</Badge>
          </Column>
        </Column>
      </Row>
    </section>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const ProfileImg = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 15px;
  border: 1px solid #787878;
  padding: 5px;
`
export default MyinfoSection
