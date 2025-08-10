import React from 'react'
import styled from 'styled-components'
//생성(250728)
const PlayerInfoUI = ({ user, pet }) => {
  return (
    <Container>
      {(user && pet) && <>
        <Text>{user.name || "??"}님의</Text>
        <Text>Lv{pet.level.level} {pet.name}</Text>
      </>}
      {(!user || !pet) && <Text>상대방을 기다립니다.</Text>}
    </Container>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const Container = styled(Column)`
  height: 75px;
  padding: 12px;
	justify-content: center;
  box-sizing: border-box;
	border: 1px solid rgb(185,185,185);
	border-radius: 10px;
`
const Text = styled.p`
	margin: 0;
`
export default PlayerInfoUI
