import { useEffect, useState } from 'react'

const useClientHeight = (documentElement) => {
  const clientHeight = documentElement.clientHeight; //사용자 화면 길이
  const [contentHeight, setContentHeight] = useState(null)
  useEffect(() => {
    setContentHeight((clientHeight / 10) * 9)
  }, [documentElement])

  return contentHeight
}

export default useClientHeight