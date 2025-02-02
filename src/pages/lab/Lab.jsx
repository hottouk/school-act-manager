import styled from "styled-components";
import { appFireStore } from "../../firebase/config";
import { collection, getDocs, setDoc, doc, getDoc, updateDoc, arrayUnion, deleteField } from "firebase/firestore";
const Lab = () => {
  
  const db = appFireStore;
  // const deleteMemberList = async () => {
  //   try {
  //     console.log("멤버 데이터 삭제 시작");
  //     const schoolColRef = collection(db, "school");
  //     const schoolSnapshot = await getDocs(schoolColRef);
  //     //전체 학교 문서 가져오기
  //     const promises = schoolSnapshot.docs.map(async (schoolDoc) => {
  //       const schoolDocRef = doc(db, "school", schoolDoc.id);
  //       // membList 필드 삭제
  //       await updateDoc(schoolDocRef, {
  //         memberList: deleteField(),
  //       });
  //     })
  //     await Promise.all(promises)
  //     console.log("멤버 오타 삭제 완료");
  //   } catch (error) {
  //     console.error("Error migrating school data:", error);
  //   }
  // }
  // const addUserInfoToSchool = async () => {
  //   try {
  //     console.log("시작");
  //     // 1. user 컬렉션에서 모든 문서 가져오기
  //     const userCollectionRef = collection(db, "user");
  //     const userSnapshot = await getDocs(userCollectionRef);

  //     // 2. user 데이터 처리
  //     const promises = userSnapshot.docs.map(async (userDoc) => {
  //       const userData = userDoc.data();

  //       // schoolCode 가져오기
  //       const schoolCode = userData.school?.schoolCode;

  //       if (schoolCode) {
  //         // school 컬렉션의 해당 문서 참조
  //         const schoolDocRef = doc(db, "school", schoolCode);

  //         // 유저 정보를 추가
  //         const userInfo = {
  //           uid: userDoc.id,
  //           isTeacher: userData.isTeacher || false, // 기본값 false
  //           name: userData.name || "Unknown", // 기본값 "Unknown"
  //           profileImg: userData.profileImg || null,
  //           email: userData.email || "No email"
  //         };
  //         // memberList 배열에 유저 정보 추가
  //         await updateDoc(schoolDocRef, {
  //           memberList: arrayUnion(userInfo),
  //         });
  //       }
  //     });

  //     // 모든 작업이 완료될 때까지 기다림
  //     await Promise.all(promises);

  //     console.log("User data successfully added to the school collection!");
  //   } catch (error) {
  //     console.error("Error updating school collection:", error);
  //   }
  // };

  return (
    <Container>
      <button onClick={() => { }}>migrate 실행</button>
      <button onClick={() => { }}>member 삭제 실행</button>
    </Container>
  )
};

const Container = styled.div`
`

export default Lab;