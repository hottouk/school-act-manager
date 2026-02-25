import React, { useEffect, useState } from 'react'
import { Modal, Spinner } from 'react-bootstrap'
import styled from 'styled-components'
//컴포넌트
import AnimatedProgressBar from '../../ProgressBar'
//생성(260115)
const GptIngModal = ({ show, onHide, status, progress }) => {
  //요청 1개
  const [_count, setCount] = useState(1);
  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {                //초마다 countdown 내리기
      setCount((prev) => {
        if (prev < 10) return prev + 1;
      });
    }, 1000);
    return () => {
      setCount(1);
      clearInterval(interval);
    }               // 컴포넌트 언마운트 시 정리
  }, [show]);
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
            {progress && <AnimatedProgressBar gptProgress={progress} />}
            {!progress && <AnimatedProgressBar count={_count} />}
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
