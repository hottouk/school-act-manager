import { getDownloadURL, getStorage, ref } from 'firebase/storage'
//25.01.17
const useFetchStorageImg = () => {
  const storage = getStorage();
  //path 추출
  const getPathList = (list) => {
    let pathList = []
    list.forEach((item) => { pathList.push(item.path) })
    return pathList
  }

  //이미지 list 가져오기
  const fetchImgUrlList = async (pathList, setter) => {
    if (!pathList || !setter) return
    pathList?.forEach((path) => {
      const cachedUrl = sessionStorage.getItem(path);
      if (cachedUrl) { //캐싱
        setter(prev => [...prev, cachedUrl])
      } else { //다운
        let imgRef = ref(storage, path)
        getDownloadURL(imgRef).then((url) => {
          setter(prev => [...prev, url])
          sessionStorage.setItem(path, url)
        })
      }
    })
  }

  //이미지 하나 가져오기
  const fetchImgUrl = async (path, setter) => {
    if (!path || !setter) return
    const cachedUrl = sessionStorage.getItem(path);
    if (cachedUrl) { setter(cachedUrl); }
    else {
      const imgRef = ref(storage, path)
      getDownloadURL(imgRef).then((url) => {
        setter(url);
        sessionStorage.setItem(path, url);
      })
    }
  }

  return { getPathList, fetchImgUrlList, fetchImgUrl }
}

export default useFetchStorageImg
