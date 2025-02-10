import styled from "styled-components"

//2024.12.07 => 250211 수정
const MainPanel = ({ children, styles }) => {
  const marginTop = styles?.marginTop || "25px"

  return (
    <Container
      $marginTop={marginTop}
    >{children}</Container>
  )
}

const Container = styled.div`
  margin-top: ${(props) => props.$marginTop};
  padding: 25px;
  border-left: 12px #3454d1 double;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
   @media screen and (max-width: 767px){
    margin-top: 0;
    border-top: 12px #3454d1 double;
    border-left: none;
    box-shadow: none;
  }
`
export default MainPanel