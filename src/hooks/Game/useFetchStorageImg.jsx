import { getDownloadURL, getStorage, ref } from 'firebase/storage'
//생성(250117)
const useFetchStorageImg = () => {
  const storage = getStorage();
  //path 추출
  const getPathList = (list) => {
    let pathList = [];
    list.forEach((item) => { pathList.push(item.path) });
    return pathList;
  }
  //이미지 list 가져오기
  const fetchImgUrlList = async (pathList, setter) => {
    if (!pathList) return
    let list;
    pathList?.forEach((path) => {
      if (!path) return
      const cachedUrl = sessionStorage.getItem(path);
      if (cachedUrl) { //캐싱
        if (setter) setter(prev => [...prev, cachedUrl]);
        else list.push(cachedUrl);
      } else { //다운
        let imgRef = ref(storage, path)
        getDownloadURL(imgRef).then((url) => {
          if (setter) setter(prev => [...prev, url]);
          else list.push(url);
          sessionStorage.setItem(path, url);
        })
      }
    })
    return list;
  }
  //이미지 하나 가져오기
  const fetchImgUrl = async (path, setter) => {
    if (!path) return
    const cachedUrl = sessionStorage.getItem(path);
    if (cachedUrl) {
      if (!setter) { return cachedUrl }
      else { setter(cachedUrl); }
    }
    else {
      const imgRef = ref(storage, path)
      getDownloadURL(imgRef).then((url) => {
        sessionStorage.setItem(path, url);
        if (!setter) { return url }
        else { setter(url); }
      })
    }
  }
  //path-url 맵
  const fetchPathUrlMap = async (pathList) => {
    if (!pathList) return;
    const promises = pathList.map(async (path) => {
      const cachedUrl = sessionStorage.getItem(path);
      if (cachedUrl) return [path, cachedUrl]
      else {
        const imgRef = ref(storage, path);
        const url = await getDownloadURL(imgRef);
        return [path, url];
      }
    })
    const newMap = await Promise.all(promises);
    return new Map(newMap);
  }

  return { getPathList, fetchImgUrlList, fetchImgUrl, fetchPathUrlMap }
}

export default useFetchStorageImg
