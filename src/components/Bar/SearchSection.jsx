import React from 'react'
import styled from 'styled-components'

//생성(250217)
const SearchSection = ({ keyword, placeholder, onChange, onClick }) => {
	return (
		<Container>
			<input type="text" value={keyword} placeholder={placeholder} onChange={onChange} />
			<button onClick={onClick}>검색</button>
		</Container>
	)
}

const Container = styled.div`
	input, button {
    border: 1px solid black;
    border-radius: 5px;
    height: 35px;
    margin: 0 4px;
  }
`
export default SearchSection
