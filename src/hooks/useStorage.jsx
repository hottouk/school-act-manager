import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage, } from "../firebase/config"
import { useSelector } from "react-redux"

const useStorage = () => {
  const user = useSelector(({ user }) => user)
  //프로필 사진 업로드(260209)
  const saveProfileImgStorage = async (file) => {
    if (!file) throw new Error("업로드할 파일이 없습니다.");
    const profileRef = ref(storage, `profile/${user.uid}`);
    const snapshot = await uploadBytes(profileRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  };

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

  return ({ getImgUrl, saveProfileImgStorage, })
}

export default useStorage