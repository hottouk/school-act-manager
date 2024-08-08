import { appFireStore } from '../../firebase/config'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';

const useDeleteFireData = () => {
  const db = appFireStore
  const deleteClassWithStudents = async (classId) => {
    // class 문서 참조
    const classDocRef = doc(db, "classRooms", classId);
    // students 서브컬렉션 참조
    const studentsColRef = collection(classDocRef, "students");
    // 서브컬렉션의 모든 문서 가져오기
    const studentsSnapshot = await getDocs(studentsColRef);

    // 서브컬렉션의 모든 문서 삭제
    const deletePromises = [];
    studentsSnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    try {
      await Promise.all(deletePromises)
      await deleteDoc(classDocRef).then(() => {
        window.alert("클래스와 모든 학생 정보가 삭제 되었습니다.")
      })
    } catch (err) {
      window.alert("학생 정보 삭제 중 문제가 발생하였습니다. 캡쳐해서 관리자에게 보내주세요.", err)
      console.log(err)
    }

  };
  return { deleteClassWithStudents }
}

export default useDeleteFireData