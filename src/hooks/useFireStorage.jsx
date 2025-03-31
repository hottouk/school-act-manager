import { listAll, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/config";

const useFireStorage = () => {

  //storage 내에 파일 있는지 검색(250331)
  const findFile = async (folder, file) => {
    const folderRef = ref(storage, `${folder}`)
    const res = await listAll(folderRef);
    const matched = res.items.find(item => item.name.includes(`${file}`));
    if (matched) {
      console.log("일치하는 파일 발견:", matched.fullPath);
      return true;
    } else {
      console.log("일치하는 파일이 없습니다.");
      return false;
    }
  }

  //파일 storage 업로드(250314)
  const uploadFile = async (path, file) => {
    const fileRef = ref(storage, `${path}/${file.name}`)
    try {
      await uploadBytes(fileRef, file);
      alert("파일이 성공적으로 업로드되었습니다!");
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      alert("파일 업로드 중 오류가 발생했습니다.");
    }
  }

  return { uploadFile, findFile }
}

export default useFireStorage
