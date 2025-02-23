import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage, timeStamp } from "../firebase/config"
import { useSelector } from "react-redux"

const useStorage = () => {
  const user = useSelector(({ user }) => user)

  //프로필 변경
  const saveProfileImgStorage = async (file) => {
    const profileRef = ref(storage, `profile/${user.uid}`)
    const createdTime = timeStamp.fromDate(new Date());
    await uploadBytes(profileRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!', snapshot, createdTime);
    }).catch((err) => {
      window.alert(err)
      console.log(err)
    })
  }

  //프로필 url
  const getProfileImgUrl = async (setProfileImg, voidImg) => {
    let url
    const profileRef = ref(storage, `profile/${user.uid}`)
    await getDownloadURL(profileRef).then((downloadUrl) => {
      url = downloadUrl
    }).catch((err) => {
      console.log(err);
    })
    return (url)
  }

  const getImgUrl = async (fileName, actId, prevImgRef, studentId) => { //이미지가 있다면 그
    if (user.isTeacher) { //교사
      getDownloadURL(ref(storage, `assignments/${studentId}/${actId}/${fileName}`))
        .then((url) => {
          prevImgRef.current.setAttribute("src", url);
        }).catch((err) => {
          console.log(err);
        })
    } else { //학생
      getDownloadURL(ref(storage, `assignments/${user.uid}/${actId}/${fileName}`))
        .then((url) => {
          prevImgRef.current.setAttribute("src", url);
        }).catch((err) => {
          console.log(err);
        })
    }
  }

  return ({ getImgUrl, saveProfileImgStorage, getProfileImgUrl })
}

export default useStorage