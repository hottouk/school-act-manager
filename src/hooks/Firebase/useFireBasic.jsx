import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, where, writeBatch } from 'firebase/firestore'
import { appFireStore, timeStamp } from '../../firebase/config'
import { useSelector } from 'react-redux'
import { useCallback } from 'react'

//생성(241205)
const useFireBasic = (col) => {
  const user = useSelector(({ user }) => user);
  const db = appFireStore;
  const colRef = collection(db, col);
  //새로 생성
  const addData = useCallback(async (data, col) => {
    const createdTime = timeStamp.fromDate(new Date());
    if (!col) col = colRef;
    await addDoc(col, { ...data, createdTime, uid: String(user.uid) });
  }, []);

  //수정 or 경로지정 생성
  const setData = useCallback(async (data, docId, col) => {
    const createdTime = timeStamp.fromDate(new Date());
    const docRef = col
      ? doc(db, col, docId)
      : doc(colRef, docId)
    await setDoc(docRef, { ...data, createdTime, uid: String(user.uid) }, { merge: true });
    console.log("Saved");
  }, []);

  //문서 하나
  const fetchDoc = useCallback(async (id, col) => {
    if (!col) col = colRef;
    const docRef = doc(colRef, id)
    const docSnapshot = await getDoc(docRef);
    return docSnapshot.data();
  }, []);

  //문서 여러개
  const fetchData = useCallback(async (field, value = String(user.uid)) => {
    let q = query(colRef, where(field, "==", value));
    try {
      let querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      console.log(err)
    }
  }, []);

  // 컬렉션 모든 문서
  const fetchAllData = useCallback(async (colName) => {
    const colRef = collection(db, colName);
    const querySnapshot = await getDocs(colRef);
    const data = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        completedAt: data.completedAt ? data.completedAt.toDate() : null,
        refundedAt: data.refundedAt ? data.refundedAt.toDate() : null,
      }
    });
    return data;
  }, []);
  // 문서 구독
  const docListener = useCallback((col, id, callback) => {
    const colRef = collection(db, col);
    const docRef = doc(colRef, id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) callback(null);
      const data = snapshot.data();
      callback(data)
    })
    return () => unsubscribe();
  }, [])
  // 컬렉션 구독
  const collectionListener = useCallback((col, callback) => {
    if (!col) return;
    const colRef = collection(db, col);
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      callback(snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
          completedAt: data.completedAt ? data.completedAt.toDate() : null,
          refundedAt: data.refundedAt ? data.refundedAt.toDate() : null,
        }
      }
      ));
    })
    return () => unsubscribe();
  }, []);
  //삭제
  const deleteData = async (docId) => {
    try {
      let docRef = doc(db, col, docId)
      await deleteDoc(docRef, null)
    } catch (err) {
      console.error(err)
    }
  }
  //문서 삭제
  const deleteSelectedDocs = async (selectedIds, col) => {
    const batch = writeBatch(db);
    selectedIds.forEach((id) => {
      const docRef = doc(db, col, id);
      console.log(docRef);
      batch.delete(docRef);
    });
    await batch.commit();
  };

  return ({ addData, setData, fetchDoc, fetchData, fetchAllData, docListener, collectionListener, deleteData, deleteSelectedDocs })
}

export default useFireBasic