//id 생성
export const getRandomStringId = () => {
  return String(crypto.getRandomValues(new Uint32Array(1))[0]);
}