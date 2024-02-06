const useGetRidOverlap = () => {

  //중복 제거(ele 합산)
  const makeUniqueArrWithEle = (cur, newEle, idName) => {
    let curList = cur
    let newList = [...curList, newEle]
    let uniqueList = newList
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

  const replaceItem = (curList, newEle, idName) => {
    let uArr = []
    if (idName === "uid") {
      curList.map((item) => {
        if (item.uid === newEle.uid) {
          uArr.push(newEle)
        } else {
          uArr.push(item)
        }
        return null
      })
    }
    else if (idName === "id") {
      curList.map((item) => {
        if (item.id === newEle.id) {
          uArr.push(newEle)
        } else {
          uArr.push(item)
        }
        return curList
      })
    }
    console.log(uArr)
    return uArr
  }

  return { makeUniqueArrWithEle, replaceItem }
}

export default useGetRidOverlap