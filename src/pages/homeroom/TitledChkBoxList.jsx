import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import SmallTitle from '../../components/Title/SmallTitle'
import { academicAbility, coopAbility, careerAbility } from '../../data/abilityList'

//2024.10.10 1차 완성
const TitledChkBoxList = ({ step, selectedSpec, setSelectedSpec }) => {
  //----1.변수부--------------------------------
  useEffect(() => {
    if (step === "first") { sortData(academicAbility, titleList, specList) }
    else if (step === "second") { sortData(coopAbility, titleList, specList) }
    else if (step === "third") { sortData(careerAbility, titleList, specList) }
  }, [step])
  const [titleList, setTitleList] = useState([]);
  const [specList, setSpecList] = useState([]);
  useEffect(() => {
    setEtc(createMatrix(titleList, ''))
    setFreeze(createMatrix(titleList, false))
  }, [titleList])
  const inputRefs = useRef({})
  const btnRefs = useRef({})
  const [etc, setEtc] = useState()
  const [freeze, setFreeze] = useState()

  //----2.함수부--------------------------------
  //원본 데이터 가공
  const sortData = (list, tList, sList) => {
    list.forEach((item) => {
      let title = Object.keys(item)[0]
      let spec = Object.values(item)[0]
      tList = [...tList, title]
      sList = [...sList, spec]
    })
    setTitleList(tList)
    setSpecList(sList)
  }
  //이중 객체 생성
  const createMatrix = (list, initVal) => {
    let matrix = {}
    list.forEach((key) => (matrix[key] = initVal)); // 각 문자열을 키로 하고 빈 배열을 값으로 하는 객체 생성
    return matrix
  }
  //체크박스
  const handleChkboxOnChage = (event, title) => {
    let { name, checked } = event.target
    setSelectedSpec((prev) => {
      let currentSelected = prev[title] || [];
      let updatedSelected = checked
        ? [...currentSelected, name] // 항목 추가
        : currentSelected.filter(item => item !== name); // 항목 제거
      return {
        ...prev,
        [title]: updatedSelected, // title에 해당하는 배열 업데이트
      };
    })
  }
  //해당 ref 가시성 토글
  const handleVisiblityChange = (refs, index) => {
    let refElement = refs.current[index];
    if (refElement) {
      refElement.style.visibility = refElement.style.visibility === 'hidden' ? 'visible' : 'hidden';
    }
  };
  //기타 저장 버튼
  const handleEtcSave = (title) => {
    let check = etc[title] !== ''
    if (check) {
      setFreeze((prev) => { return { ...prev, [title]: true } }) // 버튼, input 동결
      setSelectedSpec((prev) => {
        let current = prev[title] || [];
        let updated = [...current, etc[title]]
        return { ...prev, [title]: updated }
      })
    } else { window.alert("값을 입력하세요") }
  }
  //기타 체크 해제
  const handleUnselect = (title) => {
    let check = etc[title] !== '' && selectedSpec[title]?.includes(etc[title]) //etc가 빈값이 아니거나 저장을 눌러 slect된 경우
    if (check) {
      setFreeze((prev) => { return { ...prev, [title]: false } }) // 버튼, input 동결 해제
      setSelectedSpec((prev) => {
        let current = prev[title] || [];
        let updated = current.filter((item) => item !== etc[title]) //etc 값 삭제
        return { ...prev, [title]: updated }
      })
    } else {
      console.log('넘어가기')
    }
  }

  return (
    <Container>
      {titleList.map((title, index) => { //index는 title index임.
        return <StyledBox key={title}>
          <StyledTopRow >
            <SmallTitle title={title} />
            <input
              type="text"
              value={selectedSpec[title] ? selectedSpec[title].join(', ') : ''} // 선택된 항목 표시
              disabled
            />
          </StyledTopRow>
          {/* 리스트 */}
          {specList[index].map((spec) => {
            let checked = selectedSpec[title] && selectedSpec[title].includes(spec) ? true : false
            return <ChkBoxWrapper key={spec}>
              <input type="checkbox"
                name={spec}
                onChange={(event) => { handleChkboxOnChage(event, title) }}
                checked={checked}
              />
              <p>{spec}</p>
            </ChkBoxWrapper>
          })}
          <ChkBoxWrapper>
            <input type="checkbox"
              name={"기타"}
              onChange={(event) => {
                handleVisiblityChange(btnRefs, index)
                handleVisiblityChange(inputRefs, index)
                if (event.target.checked === false) {
                  handleUnselect(title)
                }
              }} />
            <p>기타</p>
            <input
              className="etc"
              type="text"
              ref={(ele) => { return inputRefs.current[index] = ele }}
              value={etc[title] || ''}
              onChange={(event) => {
                setEtc((prev) => ({ ...prev, [title]: event.target.value }))
              }}
              style={{ visibility: 'hidden' }}
              disabled={freeze[title] || false}
            />
            <button
              ref={(ele) => { return btnRefs.current[index] = ele }}
              style={{ visibility: 'hidden' }}
              onClick={() => { handleEtcSave(title) }}
              disabled={freeze[title] || false}>저장</button>
          </ChkBoxWrapper>
        </StyledBox>
      })}
    </Container >
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 35px;
  gap: 37px;
`
const StyledBox = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  border: 1px solid black;
  border-radius: 5px;
  width: 100%;
`
const StyledTopRow = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  gap: 10px;
  top: -30px;
  left: 0;
  input { 
    border-radius: 5px;
    flex-grow: 1;
  }
`
const ChkBoxWrapper = styled.div`
  display: flex;
  margin-right: 1px;
  input { margin-right: 3px;}
  p { margin: 0; }
  input.etc {
    margin-left: 3px;
    border-radius: 5px;
  }
`
export default TitledChkBoxList