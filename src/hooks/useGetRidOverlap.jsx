const useGetRidOverlap = () => {

  //중복 제거(배열 구성이 obj일때)
  const makeUniqueArrWithEle = (curList, newEle, idName) => {
    let newArr = [...curList, newEle]
    let uArr
    if (idName === "uid") {
      uArr = newArr.reduce((acc, cur) => {
        if (acc.findIndex(({ uid }) => uid === cur.uid) === -1) {
          acc.push(cur)
        }
        return acc
      }, []);
    } else if (idName === "id") {
      uArr = newArr.reduce((acc, cur) => {
        if (acc.findIndex(({ id }) => id === cur.id) === -1) {
          acc.push(cur)
        }
        return acc
      }, []);
    }
    return uArr
  }

  const makeUniqueArrOfEle = (curList, newEle) => {//배열 구성이 원시형일때
    let newArr = [...curList, newEle]
    let jsonString = newArr.map(JSON.stringify)
    let uSet = new Set(jsonString)
    let uArr = Array.from(uSet).map(JSON.parse);
    return uArr
  }

  //교체(ele 기존 item 교체)
  const replaceItem = (curList, newEle, idName) => {
    let uArr
    if (idName === "uid") {
      let deletedArr = curList.filter(({ uid }) => uid !== newEle.uid)
      uArr = [...deletedArr, newEle]
    }
    else if (idName === "id") {
      let deletedArr = curList.filter(({ id }) => id !== newEle.id)
      uArr = [...deletedArr, newEle]
    }
    return uArr
  }

  return { makeUniqueArrWithEle, makeUniqueArrOfEle, replaceItem }
}

export default useGetRidOverlap