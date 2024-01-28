const useGetRidOverlap = () => {

  //중복 제거(ele 합산)
  const makeUniqueArrWithEle = (cur, newEle, idName) => {
    let curList = cur
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

  //중복 제거(arr 합산)
  const makeUniqueArrWithArr = (cur, newArr, uidName) => {
    let curList = cur
    let newList = [...curList, ...newArr]
    let uid = uidName
    let uniqueList = newList.reduce((acc, cur) => {
      if (acc.findIndex(({ uid }) => uid === cur.uidName) === -1) {
        acc.push(cur)
      }
      return acc
    }, []);
    return uniqueList
  }

  return { makeUniqueArrWithEle, makeUniqueArrWithArr }
}

export default useGetRidOverlap