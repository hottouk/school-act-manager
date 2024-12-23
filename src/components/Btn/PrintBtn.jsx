import React from 'react'
import printIcon from '../../image/icon/print_icon.png';
import styled from 'styled-components'

const PrintBtn = ({ onClick }) => {
  //const printRef = useRef({});
  //const handlePrint = useReactToPrint({ contentRef: printRef });
  //handlePrint() onClick에 구현
  return (
    <Container id="print_btn" src={printIcon} alt="인쇄" onClick={onClick} />
  )
}

const Container = styled.img`
  width: 45px;
  height: 45px;
  cursor: pointer;
  margin-top: 8px;
`


export default PrintBtn