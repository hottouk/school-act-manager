import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage, timeStamp } from "../firebase/config"
import { useSelector } from "react-redux"

const useStorage = () => {
  const user = useSelector(({ user }) => user)

  const submitHomeworkStorage = (file, activityParam) => {
    const assignmentRef = ref(storage, `assignments/${user.uid}/${activityParam.id}/${file.name}`)
    const createdTime = timeStamp.fromDate(new Date());
    uploadBytes(assignmentRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!', snapshot, createdTime);
    }).catch((err) => {
      console.log(err)
    })
  }

  const cancelHomeworkStorage = (fileName, activityParam) => {
    const assignmentRef = ref(storage, `assignments/${user.uid}/${activityParam.id}/${fileName}`)
    deleteObject(assignmentRef).catch((err) => {
      console.log(err)
    });
  }

  const getImgUrl = async (fileName, actId, prevImgRef) => { //이미지가 있다면 그
    getDownloadURL(ref(storage, `assignments/${user.uid}/${actId}/${fileName}`))
      .then((url) => {
        prevImgRef.current.setAttribute("src", url);
      }).catch((err) => {
        console.log(err);
      })
  }

  return (
    { submitHomeworkStorage, cancelHomeworkStorage, getImgUrl }
  )
}

export default useStorage