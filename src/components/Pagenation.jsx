import styled from 'styled-components';
//생성(250508)
const Pagenation = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage); //소수점 올림
  const handleOnClick = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <Container>
      <BasicText onClick={() => handleOnClick(currentPage - 1)} disabled={currentPage === 1}>이전</BasicText>
      <NumberWrapper>
        {[...Array(totalPages)].map((_, i) => (
          <NumberText
            $active={currentPage === i + 1}
            key={i + 1}
            onClick={() => handleOnClick(i + 1)}
          >{i + 1}</NumberText>
        ))}
      </NumberWrapper>
      <BasicText onClick={() => handleOnClick(currentPage + 1)} disabled={currentPage === totalPages}>다음</BasicText>
    </Container>
  )
}
const Container = styled.div`  
  display: flex;
  height: 30px;
`
const Row = styled.div`
  display: flex;
`
const NumberWrapper = styled(Row)`
  margin: 0 20px;
  gap: 15px;
`
const BasicText = styled.p`
  margin: 0;
  cursor: pointer;
  &:hover {
    color: #3454d1;
  }
`
const NumberText = styled(BasicText)`
  font-size: ${(props) => { return props.$active ? 20 : 16 }}px;
  text-decoration: underline;
`
export default Pagenation
