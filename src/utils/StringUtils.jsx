import React from 'react'
const StringUtils = () => {
  //줄바꿈 제거
  const removeAllLineBreaks = (str) => str.replace(/[\r\n]+/g, "");
  return ({ removeAllLineBreaks })
}

export default StringUtils
