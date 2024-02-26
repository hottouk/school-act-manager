import { doc, updateDoc } from 'firebase/firestore'
import { appFireStore } from '../firebase/config'
import { useDispatch, useSelector } from 'react-redux'
import { setUserPersonalInfo } from '../store/userSlice'

const useSetUser = () => {
  const user = useSelector(({ user }) => user)
  const db = appFireStore
  const dispatcher = useDispatch()

  const updateUserInfo = (userInfo) => {
    let userRef = doc(db, "user", user.uid)
    updateDoc(userRef, { ...userInfo })
      .then(() => {
        dispatcher(setUserPersonalInfo(userInfo))
      }).catch((err) => {
        window.alert(err)
        console.log(err)
      })
  }

  return ({ updateUserInfo })
}

export default useSetUser