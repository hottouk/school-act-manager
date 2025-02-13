import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { doc, onSnapshot } from 'firebase/firestore';
import { appFireStore } from '../../firebase/config'

//250125 실시간 내 유저 정보 구독
const useFetchRtMyUserData = () => {
  const user = useSelector(({ user }) => user)
  const db = appFireStore;
  const [myUserData, setMyUserData] = useState(null);

  useEffect(() => {
    if (Object.keys(user).length === 0) return;
    const userDocRef = doc(db, "user", user.uid)
    const unsubscribe = onSnapshot(userDocRef,
      (snapshot) => {
        setMyUserData(snapshot.data(), snapshot.id)
      }
      , (error) => { console.log(error) }
    )
    return unsubscribe
  }, [user])

  return ({ myUserData })
}

export default useFetchRtMyUserData



