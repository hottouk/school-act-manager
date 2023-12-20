//바이트 계산 함수
const useGetByte = () => {
  const getByteLengthOfString = (s, b, i, c) => {
    for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
    return b;
  };

  return { getByteLengthOfString }
}

export default useGetByte