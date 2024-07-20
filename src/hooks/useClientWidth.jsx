import { useEffect, useState } from 'react'

const useClientWidth = (documentElement) => {
  const clientWidth = documentElement.clientWidth; //사용자 화면 너비
  const [contentWidth, setContentWidth] = useState(null)
  useEffect(() => {
    setContentWidth(clientWidth)
  }, [documentElement])
  return contentWidth
}

export default useClientWidth