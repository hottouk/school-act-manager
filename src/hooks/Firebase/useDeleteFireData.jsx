import { appFireStore } from '../../firebase/config'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';

const useDeleteFireData = () => {
  const db = appFireStore;
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
    await Promise.all(deletePromises);
    await deleteDoc(classDocRef);
  };
  return { deleteClassWithStudents }
}

export default useDeleteFireData