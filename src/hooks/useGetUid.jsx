
const useGetUid = () => {

  const getUid = (value) => {
    let id = `${value}/${Math.floor((Math.random() * Date.now()))}`
    return id
  }

  return (
    { getUid }
  )
}

export default useGetUid
