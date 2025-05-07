import SmallBtn from './Btn/SmallBtn';
import styled from 'styled-components';

const Pagenation = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage); //소수점 올림
  const handleOnClick = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <Container>
      <SmallBtn onClick={() => handleOnClick(currentPage - 1)} disabled={currentPage === 1}>이전</SmallBtn>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => handleOnClick(i + 1)}
          className={currentPage === i + 1 ? 'active' : ''}
        >
          {i + 1}
        </button>
      ))}
      <SmallBtn onClick={() => handleOnClick(currentPage + 1)} disabled={currentPage === totalPages}>다음</SmallBtn>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  height: 30px;
  gap: 10px;
`
export default Pagenation
