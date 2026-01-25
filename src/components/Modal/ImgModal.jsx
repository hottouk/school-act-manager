import React from 'react'
import { Modal, Spinner } from 'react-bootstrap'
import styled from 'styled-components';

const ImgModal = ({ show, onHide, imgUrl }) => {
	return (
		<Modal
			show={show}
			size='lg'
			onHide={onHide}
		>
			<Modal.Body>
				{!imgUrl && <Spinner />}
				{imgUrl && <Row><img src={imgUrl} alt="확대 화면" style={{ margin: "0 auto" }} /></Row>}
			</Modal.Body>
		</Modal>)
}
const Row = styled.div`
	display: flex;
`

export default ImgModal
