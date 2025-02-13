//라이브러리
import React from 'react'
import { Modal } from 'react-bootstrap'
import styled from 'styled-components'
//컴포넌트
import PetImg from '../PetImg'
import ScoreWrapper from '../ScoreWrapper'

//250208 생성
const ActiInfoModal = ({ show, onHide, acti }) => {
	const { madeBy, record, content, scores, money, title } = acti
	const { attitudeScore, careerScore, coopScore, sincerityScore, leadership } = scores
	const bodyStyle = { backgroundColor: "#efefef", padding: "20px 20px 0 20px", }
	return (
		<Modal
			show={show}
			onHide={onHide}
			size='lg'
		>
			<Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>활동 정보</Modal.Header>
			<Modal.Body style={bodyStyle}>
				<Row style={{ alignItems: "center" }}>
					<ImgWrapper><PetImg styles={{ width: "80px", height: "80px" }} onClick={() => { }} /></ImgWrapper>
					<Row style={{ flexDirection: "column" }}>
						<p>활동명: {title}</p>
						<p style={{ width: "100%" }}>설명: {content}</p>
						<p style={{ margin: "0" }}>만든 사람: {madeBy}	선생님</p>
					</Row>
				</Row>
				<TextWrapper>{record}</TextWrapper>
				<Row style={{ margin: "10px" }}>
					<ScoreWrapper attitudeScore={attitudeScore} careerScore={careerScore} coopScore={coopScore} sincerityScore={sincerityScore} leadershipScore={leadership} money={money} disabled={true} />
				</Row>
			</Modal.Body>
			<Modal.Footer style={{ backgroundColor: "#efefef" }}></Modal.Footer>
		</Modal>
	)
}

export default ActiInfoModal

const Row = styled.div`
	display: flex;
`
const TextWrapper = styled.div`
	width: 100%;
	margin: 10px;
	padding: 10px;
	border: 1px solid rgba(120,120,120,0.5);
	border-radius: 10px;
	background: white;
`
const ImgWrapper = styled.div`
	margin: 0 16px 16px 10px;
	img {
    padding: 7px;
    border: 1px solid rgba(120,120,120,0.5);
    border-radius: 70px;
    background-color: white;
  } 
`