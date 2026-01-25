import React, { useEffect, useState } from 'react'
import { Modal, Spinner } from 'react-bootstrap'
import styled from 'styled-components'
//컴포넌트
import AnimatedProgressBar from '../../ProgressBar'
//생성(260115)
const GptIngModal = ({ show, onHide, status, progress }) => {
  useEffect(() => setIsMulti(checkIsMulti()), [progress])
  const [isMulti, setIsMulti] = useState(false);
  const checkIsMulti = () => {
    if (!progress) return false;
    if (progress.total === 0) return false;
    return true;
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop={"static"}
    >
      <Modal.Body>
        <Column style={{ justifyContent: "center", alignItems: "center", gap: "10px" }}>
          <Spinner />
          {status}
          <Row style={{ width: "100%" }}>
            {isMulti && <AnimatedProgressBar gptProgress={progress} />}
          </Row>
        </Column>
      </Modal.Body>
    </Modal>
  )
}
const Row = styled.div`
	display: flex;
`
const Column = styled(Row)`
	flex-direction: column;
`
export default GptIngModal
