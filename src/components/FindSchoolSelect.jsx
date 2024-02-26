import axios from 'axios';
import React, { useState } from 'react'
import styled from 'styled-components';

const FindSchoolSelect = ({ setSchool }) => {
  const [_schoolList, setSchoolList] = useState('')
  const [_schoolOffice, setSchoolOffice] = useState('default')
  const [_schoolKind, setSchoolKind] = useState('default')
  const [_schoolName, setSchoolName] = useState("학교명")
  const [_message, setMessage] = useState('')
  const [_isSearch, setSearch] = useState(false)

  const handleOnChange = (event) => {
    switch (event.target.id) {
      case "school_office_select":
        setSchoolOffice(event.target.value)
        break;
      case "school_knd_select":
        setSchoolKind(event.target.value)
        break;
      case "school_name_input":
        setSchoolName(event.target.value)
        break;
      default: return;
    }
  }

  const handleOnClick = (event) => {
    switch (event.target.id) {
      case "search_school_btn":
        if (_schoolOffice !== 'default' && _schoolKind !== 'default' && _schoolName !== "학교명") {
          getSchoolList()
        } else {
          window.alert("교육청, 학교급, 학교명으로 검색해주세요")
        }
        break;
      default: return;
    }
  }

  const getSchoolList = async () => {
    setMessage('')
    setSchoolList('')
    const baseUrl = "https://open.neis.go.kr/hub/schoolInfo"
    axios.get(baseUrl, {
      params: {
        KEY: process.env.REACT_APP_FIND_SCHOOL_KEY,
        type: "json",
        ATPT_OFCDC_SC_CODE: _schoolOffice,
        SCHUL_KND_SC_NM: _schoolKind,
        SCHUL_NM: _schoolName
      }
    })
      .then((response) => {
        let result = response.data.RESULT
        let schoolInfo = response.data.schoolInfo
        if (result) {
          setMessage(result.MESSAGE) //검색 결과 없음
        }
        if (schoolInfo) {
          setSchoolList(schoolInfo[1].row) //검색 결과
        }
      })
      .catch((err) => {
        window.alert(err)
        console.log(err)
      })
      .finally(() => {
        setSearch(true)
      });
  }

  return (<StyledContainer>
    <div className="upper_section">
      <select id="school_office_select" required value={_schoolOffice} onChange={handleOnChange}>
        <option value="default" disabled >시도교육청</option>
        <option value="B10">서울특별시교육청</option>
        <option value="C10">부산광역시교육청</option>
        <option value="D10">대구광역시교육청</option>
        <option value="E10">인천광역시교육청</option>
        <option value="F10">광주광역시교육청</option>
        <option value="G10">대전광역시교육청</option>
        <option value="H10">울산광역시교육청</option>
        <option value="I10">세종특별자치시교육청</option>
        <option value="J10">경기도교육청</option>
        <option value="K10">강원특별자치도교육청</option>
        <option value="M10">충청북도교육청</option>
        <option value="N10">충청남도교육청</option>
        <option value="P10">전라북도교육청</option>
        <option value="Q10">전라남도교육청</option>
        <option value="R10">경상북도교육청</option>
        <option value="S10">경상남도교육청</option>
        <option value="T10">제주특별자치도교육청</option>
      </select>
      <select id="school_knd_select" required value={_schoolKind} onChange={handleOnChange}>
        <option value="default" disabled>학교급</option>
        <option value="고등학교">고등학교</option>
        <option value="중학교">중학교</option>
        <option value="초등학교">초등학교</option>
      </select>
      <input id="school_name_input" type="text" value={_schoolName} onChange={handleOnChange} />
    </div>
    <div className="bot_section">
      <button id="search_school_btn" type="button" onClick={handleOnClick}>검색</button>
    </div>
    <StyledSchoolListWrapper $isSeacrh={_isSearch}>
      {_message && _message}
      <ul>
        {_schoolList && _schoolList.map((item) => {
          let schoolInfo = { //필요 정보
            eduOfficeCode: item.ATPT_OFCDC_SC_CODE,
            eduOfficeName: item.ATPT_OFCDC_SC_NM,
            address: item.ORG_RDNMA,
            schoolCode: item.SD_SCHUL_CODE,
            schoolName: item.SCHUL_NM,
            schoolTel: item.ORG_TELNO
          }
          return (<li key={item.SD_SCHUL_CODE} className="schul_item" id="schul_item" onClick={() => { setSchool(schoolInfo) }}>
            <p className="schul_nm">{item.SCHUL_NM}</p>
            <p className="schul_address">{item.ORG_RDNMA}</p>
          </li>)
        })}
      </ul>
    </StyledSchoolListWrapper>
  </StyledContainer>
  )
}

const StyledContainer = styled.div`
  select, input {
    width: 100%;
    padding: 5px;
    border-radius: 7px;
  }
  div.upper_section {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  button {
    height: 35px;
    margin: 0;
    font-size: 12px;
  }
`

const StyledSchoolListWrapper = styled.div`
  width: 100%;
  background-color: #efefef;
  height: ${({ $isSeacrh }) => { return $isSeacrh ? "200px" : "0" }};
  transition: height 0.3s;
  overflow-y: scroll;
  color: black;
  li.schul_item {
    cursor: pointer;
    &:hover {
      color: blue;
    }
  }
  p.schul_nm {
    margin: 0;
  }
  p.schul_address {
    font-size: 13px;
  }
`

export default FindSchoolSelect