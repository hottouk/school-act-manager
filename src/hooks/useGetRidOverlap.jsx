const useGetRidOverlap = () => {

  //중복 제거(ele 합산)
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

  const replaceItem = (curList, newEle, idName) => {
    let uArr = []
    if (idName === "uid") {
      curList.map((item) => {
        if (item.uid === newEle.uid) { //기존 item들과 신규 ele비교
          uArr.push(newEle) //같으면 신규
        } else { //다르면 기존
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
    return uArr
  }

  return { makeUniqueArrWithEle, replaceItem }
}

export default useGetRidOverlap