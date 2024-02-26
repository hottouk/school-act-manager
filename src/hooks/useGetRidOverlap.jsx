const useGetRidOverlap = () => {

  //중복 제거(ele 기존 배열 합산)
  const makeUniqueArrWithEle = (curList, newEle, idName) => {
    let newList = [...curList, newEle]
    let uniqueList
    if (idName === "uid") {
      uniqueList = newList.reduce((acc, cur) => {
        if (acc.findIndex(({ uid }) => uid === cur.uid) === -1) {
          acc.push(cur)
        }
        return acc
      }, []);
    } else if (idName === "id") {
      uniqueList = newList.reduce((acc, cur) => {
        if (acc.findIndex(({ id }) => id === cur.id) === -1) {
          acc.push(cur)
        }
        return acc
      }, []);
    }
    return uniqueList
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

  return { makeUniqueArrWithEle, replaceItem }
}

export default useGetRidOverlap