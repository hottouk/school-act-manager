import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
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

  const submitHomeworkStorage = (file, actiParam) => {
    const homeworkRef = ref(storage, `assignments/${user.uid}/${actiParam.id}/${file.name}`)
    const createdTime = timeStamp.fromDate(new Date());
    uploadBytes(homeworkRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!', snapshot, createdTime);
    }).catch((err) => {
      console.log(err)
    })
  }

  const modifyHomeworkStorage = (newFile, curFileName, actiParam) => {
    console.log(newFile, curFileName, actiParam)
    const oldWorkRef = ref(storage, `assignments/${user.uid}/${actiParam.id}/${curFileName}`)
    const newWorkRef = ref(storage, `assignments/${user.uid}/${actiParam.id}/${newFile.name}`)
    const createdTime = timeStamp.fromDate(new Date());
    deleteObject(oldWorkRef).then((snapshot) => {
      console.log("File deleted successfully", snapshot, createdTime)
    }).catch((err) => {
      window.alert(err)
      console.log(err)
    })
    uploadBytes(newWorkRef, newFile).then((snapshot) => {
      console.log('Uploaded a blob or file!', snapshot, createdTime);
    }).catch((err) => {
      window.alert(err)
      console.log(err)
    })
  }

  const cancelHomeworkStorage = (fileName, actiParam) => {
    const homeworkRef = ref(storage, `assignments/${user.uid}/${actiParam.id}/${fileName}`)
    deleteObject(homeworkRef).catch((err) => {
      console.log(err)
    });
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

  const getDownloadHomeworkFile = async (fileName, actId, studentId) => {
    getDownloadURL(ref(storage, `assignments/${studentId}/${actId}/${fileName}`)).then((url) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = () => {//다운로드하기
        const blob = xhr.response;
        const downloadUrl = window.URL.createObjectURL(blob); // 해당 file을 가리키는 url 생성
        const anchorElement = document.createElement('a');
        document.body.appendChild(anchorElement);
        anchorElement.download = `${fileName}`; // a tag에 download 속성을 줘서 클릭할 때 다운로드가 일어날 수 있도록 하기
        anchorElement.href = downloadUrl; // href에 url 달아주기
        anchorElement.click(); // 코드 상으로 클릭을 해줘서 다운로드를 트리거
        document.body.removeChild(anchorElement); // cleanup - 쓰임을 다한 a 태그 삭제
        URL.revokeObjectURL(downloadUrl); // cleanup - 쓰임을 다한 url 객체 삭제
      };
      xhr.open('GET', url);
      xhr.send();
      window.alert("다운로드가 완료되었습니다.")
    })
  }
  return (
    { submitHomeworkStorage, modifyHomeworkStorage, cancelHomeworkStorage, getImgUrl, getDownloadHomeworkFile, saveProfileImgStorage, getProfileImgUrl }
  )
}

export default useStorage