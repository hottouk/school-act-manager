//숫자 id 생성
export const getRandomStringId = () => {
  return String(crypto.getRandomValues(new Uint32Array(1))[0]);
}
//구매 id
export const generateRandomString = () => { return window.btoa(Math.random().toString()).slice(0, 20); };
