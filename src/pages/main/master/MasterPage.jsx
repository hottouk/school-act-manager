//라이브러리
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Select from 'react-select';
//hooks
import MainContainer from '../../../components/Styled/MainContainer'
import MainWrapper from '../../../components/Styled/MainWrapper'
import useFireBasic from '../../../hooks/Firebase/useFireBasic'
import SearchBar from '../../../components/Bar/SearchBar'
import UpperTabs from '../../../components/UpperTabs';
import PurchaseListSection from './PurchaseListSection';
import ChargeListSection from './ChargeListSection';
import SubNav from '../../../components/Bar/SubNav';
import ClickableIcon from '../../../components/Styled/ClickableIcon';
import AdminSection from './AdminSection';

const Master = () => {
  const { fetchAllData, deleteSelectedDocs, collectionListener } = useFireBasic("rira_ledger");
  // db
  const [riraLedgerList, setRiraLedgerList] = useState([]);
  const [purchaseList, setPurchaseList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  // tab
  const [tab, SetTab] = useState(0);

  useEffect(() => {
    if (tab === 0) collectionListener("purchases", setPurchaseList);
    if (tab === 1) collectionListener("rira_ledger", setRiraLedgerList);
    return () => setIsMulti(false);
  }, [fetchAllData, collectionListener, tab]);
  // search
  const [searcyType, setSearcyType] = useState("uid");
  const selectOptions = [{ value: "uid", label: "uid" }, { value: "id", label: "구매번호" }]
  // mode
  const [isMulti, setIsMulti] = useState(false);
  useEffect(() => {
    return setSelectedList([]);
  }, [isMulti])

  // **fn**
  // 삭제
  const handleDeleteOnClick = () => {
    if (selectedList.length === 0) { alert("선택값 없음"); return; }
    const confirm = window.confirm("지우시겠습니까?");
    if (!confirm) return;
    const col = tab === 0 ? "purchases" : "rira_ledger";
    const standard = tab === 0 ? "orderId" : "id";
    const IdList = selectedList.map((item) => item[standard]);
    deleteSelectedDocs(IdList, col);
    setIsMulti(false);
  };
  return (
    <MainContainer>
      {/* 도구모음 */}
      <SubNav>
        <ClickableIcon className='fa-solid fa-trash'
          onClick={() => handleDeleteOnClick()} />
        <ClickableIcon className='fa-solid fa-user-group'
          onClick={() => setIsMulti(!isMulti)} title="다중 선택 모드" />
      </SubNav>
      <MainWrapper styles={{ position: "relative", width: "85%", margin: "50px auto" }}>
        <UpperTabs
          top={"-35px"}
          selectedIdx={tab}
          tabList={["구매내역", "사용내역", "Admin"]}
          onClick={SetTab}
        />
        {/* 구매내역 */}
        {tab === 0 && <PurchaseListSection
          purchaseList={purchaseList}
          setPurchaseList={setPurchaseList}
          isMulti={isMulti}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
        />}
        {/* 사용 내역 */}
        {tab === 1 && <>
          <Row style={{ gap: "15px", justifyContent: "center" }}>
            <SearchBar type={searcyType} list={riraLedgerList} setList={setRiraLedgerList} />
            <Select options={selectOptions} onChange={(event) => setSearcyType(event.value)} />
          </Row>
          <ChargeListSection
            riraLedgerList={riraLedgerList}
            setRiraLedgerList={setRiraLedgerList}
            isMulti={isMulti}
            selectedList={selectedList}
            setSelectedList={setSelectedList}
          />
        </>}
        {/* 운영 */}
        {tab === 2 && <AdminSection />}
      </MainWrapper>
    </MainContainer >
  )
}

const Row = styled.div`
  display: flex;
`
export default Master