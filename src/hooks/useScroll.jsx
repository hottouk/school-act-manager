import { useEffect } from 'react'
import { throttle } from "lodash";
import { useDispatch } from 'react-redux';
import { setEndSignal } from '../store/pageEndSignifierSlice';

// console.log('총높이', scrollHeight, '지나간', scrollTop, '화면높이', clientHeight)
const useScroll = (documentElement) => {
  const dispatcher = useDispatch()
  const handleScroll = () => {
    const scrollHeight = documentElement.scrollHeight; //총 높이
    const scrollTop = documentElement.scrollTop; //지나간 부분의 길이
    const clientHeight = documentElement.clientHeight; //사용자 화면 길이
    if (scrollTop + clientHeight >= scrollHeight) {
      dispatcher(setEndSignal(true))
    } else {
      dispatcher(setEndSignal(false))
    }
  }
  useEffect(() => {
    let unsubscribe = () => window.removeEventListener("scroll", handleScroll) 
    window.addEventListener("scroll", throttle(handleScroll, 500))
    return unsubscribe
  }, [])
  return null
}


export default useScroll