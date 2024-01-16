import { useEffect, useState } from 'react'
//hooks
import useCollection from '../../hooks/useCollection'
//CSS
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import DataList from '../../components/DataList'
import { useNavigate } from 'react-router-dom'
import useClientHeight from '../../hooks/useClientHeight'

//24.01.09
const ActivityMain = () => {
  //전역변수 user정보
  const user = useSelector(({ user }) => { return user })
  const navigate = useNavigate()
  //활동 정보
  const { documentList, colErr } = useCollection('activities', ['uid', '==', user.uid], 'title')
  const [_activityList, setActivityList] = useState(null)
  const clientHeight = useClientHeight(document.documentElement)

  //2. UseEffect
  useEffect(() => {
    setActivityList(documentList)
  }, [documentList])

  return (
    <StyledContainer $clientheight={clientHeight}>
      {_activityList && <DataList activities={_activityList} />}
      {(!_activityList || _activityList.length === 0) && <h3>아직 활동이 없습니다. 활동을 생성해주세요</h3>}
      {colErr && <h3 style={{ color: "red" }}>{colErr}</h3>}
      <StyledBtn onClick={() => { navigate("/activities_setting") }}>활동 만들기</StyledBtn>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  box-sizing: border-box;
  margin: 20px auto;
  margin-bottom: 50px;
  @media screen and (max-width: 767px) {
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
const StyledBtn = styled.button`
  appearance: none;
  backface-visibility: hidden;
  background-color: #3454d1;
  border-radius: 10px;
  border-style: none;
  box-shadow: none;
  box-sizing: border-box;
  margin: 50px auto;
  color: #fff;
  cursor: pointer;
  display: block;
  font-family: Inter,-apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif;
  font-size: 15px;
  font-weight: 500;
  height: 50px;
  letter-spacing: normal;
  line-height: 1.5;
  outline: none;
  overflow: hidden;
  padding: 14px 30px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transform: translate3d(0, 0, 0);
  transition: all .3s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: top;
  white-space: nowrap;

  &:hover {
  background-color: #1366d6;
  box-shadow: rgba(0, 0, 0, .05) 0 5px 30px, rgba(0, 0, 0, .05) 0 1px 4px;
  opacity: 1;
  transform: translateY(0);
  transition-duration: .35s;
  }
  
  &:hover:after {
    opacity: .5;
  }

  &:active {
    box-shadow: rgba(0, 0, 0, .1) 0 3px 6px 0, rgba(0, 0, 0, .1) 0 0 10px 0, rgba(0, 0, 0, .1) 0 1px 4px -1px;
    transform: translateY(2px);
    transition-duration: .35s;
  }

  &:active:after {
    opacity: 1;
  }
`
export default ActivityMain