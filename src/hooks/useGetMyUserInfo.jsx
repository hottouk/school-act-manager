import { useEffect, useState } from 'react'
import { appFireStore } from '../firebase/config'
import { useSelector } from 'react-redux'
import { doc, getDoc } from 'firebase/firestore'

const useGetMyUserInfo = () => {
  const db = appFireStore
  const user = useSelector(({ user }) => { return user })
  const [myUserInfo, setMyUserinfo] = useState(null)
  const [appliedStudentClassList, setappliedStudentClassList] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      fetchMyUserInfo()
    } catch (error) {
      setError(error)
    }
  }, [])

  const fetchMyUserInfo = async () => {
    const myUserInfoRef = doc(db, "user", user.uid)
    await getDoc(myUserInfoRef).then((myInfo) => {
      setMyUserinfo(myInfo.data())
      setappliedStudentClassList(myInfo.data().appliedStudentClassList)
    })
  }

  return ({ myUserInfo, appliedStudentClassList, errByGetMyUserInfo: error })
}

export default useGetMyUserInfo