import React from 'react'
import styled from 'styled-components'
import FormHeader from '../Form/FormHeader';
//생성(260217)
const StyledForm = ({ children, title, styles }) => {
	return (
		<Container>
			<FormHeader>{title || "샘플"}</FormHeader>
			{children}
		</Container>
	)
}
const Container = styled.div`
	position: relative;
	width: 35%;
  max-width: 600px;
	display: flex;
	flex-direction: column;
  gap: 10px;
	margin: 40px auto 30px;
  padding: 20px;
  color: black;
  background-color: #efefef;
  border-radius: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  box-shadow: rgba(52, 94, 209, 0.2) 0px 8px 24px, rgba(52, 84, 209, 0.2) 0px 16px 56px, rgba(52, 84, 209, 0.2) 0px 24px 80px;
  @media (max-width: 768px){
    width: 100%;
  }
`
export default StyledForm
