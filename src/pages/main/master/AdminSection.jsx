import React, { useEffect, useMemo, useState } from 'react'
import useFireBasic from '../../../hooks/Firebase/useFireBasic'

import styled from 'styled-components';
import ClickableIcon from '../../../components/Styled/ClickableIcon';
import DotTitle from '../../../components/Title/DotTitle';
import MidBtn from '../../../components/Btn/MidBtn';

const AdminSection = () => {
  const { setData, docListener } = useFireBasic("notice");
  useEffect(() => {
    docListener("admin", "notice", setNotice);
    docListener("admin", "isCouponOn", setIsCouponOn)
  }, [docListener]);
  const [notice, setNotice] = useState(null);
  const [noticeList, setNoticeList] = useState([]);
  useEffect(() => {
    if (!notice) return;
    setNoticeList(notice.noticeList);
  }, [notice]);
  //공지사항
  const handleOnChange = (idx, value) => {
    setNoticeList((prev) => prev.map((item, i) => (i === idx ? value : item)))
  }
  const noticeInfo = { noticeList: noticeList }
  //쿠폰
  const [isCouponOn, setIsCouponOn] = useState(false);

  return (
    <section style={{ display: "flex", flexDirection: "column" }}>
      <NoticeWrapper >
        <DotTitle>공지사항</DotTitle>
        {noticeList?.map((item, idx) =>
          <Row key={idx}>
            <TextInput
              type='text'
              value={item}
              onChange={(evt) => handleOnChange(idx, evt.target.value)}
            />
            <ClickableIcon
              className=' fa-solid fa-minus'
              title={"삭제"}
              onClick={() => setNoticeList((prev) => prev.filter((_, i) => i !== idx))}
            >
            </ClickableIcon>
          </Row>
        )}
        <div style={{ margin: "0 auto" }}>
          <ClickableIcon
            className='fa-solid fa-plus'
            title={"추가"}
            onClick={() => setNoticeList((prev) => [...prev, ""])}
          />
        </div>
        <Center>
          <MidBtn onClick={() => setData(noticeInfo, "notice", "admin")}>저장</MidBtn>
        </Center>
      </NoticeWrapper>
      <Row style={{ marginBottom: "20px" }}>
        <DotTitle>쿠폰 입력창</DotTitle>
        <span style={{ marginRight: "10px" }}>켜기</span>
        <input
          type='checkbox'
          checked={isCouponOn}
          onChange={() => setData({ isCouponOn: isCouponOn }, "isCouponOn", "admin")}
        />
      </Row>
    </section>
  )
}

const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const Center = styled(Row)`
  justify-content: center;
`
const NoticeWrapper = styled(Column)`
  gap: 10px;
  margin-bottom: 20px;
`
const TextInput = styled.input`
  height: 35px;
  border-radius: 5px;
  border: 1px solid #787878;
  flex-grow: 1
`

export default AdminSection
