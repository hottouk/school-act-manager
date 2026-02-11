import { arrayRemove, arrayUnion, collection, deleteDoc, deleteField, doc, getDocs, query, runTransaction, where, writeBatch } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { appFireStore } from '../firebase/config'
import useGetRidOverlap from './useGetRidOverlap'
import useAcc from './useAcc'
import { appAuth } from '../firebase/config'
import { deleteUser } from "firebase/auth";
import useLogout from './useLogout'
import { useCallback } from 'react'

//복합 collection 함수 모음
const useFireTransaction = () => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore
  const userCol = collection(db, "user");
  const schoolCol = collection(db, "school");
  const { makeUniqueArrWithEle, replaceItem } = useGetRidOverlap();
  const { makeAccRec } = useAcc();
  const { logout } = useLogout();
  //1. 활동 업어오기: 활동 관리 - 전체활동 - 타교사 - 퍼가기
  const copyActiTransaction = async (acti) => {
    const actiId = acti.id
    const othrId = acti.uid
    const actiRef = doc(db, "activities", actiId)
    const userRef = doc(db, "user", user.uid)
    const otrRef = doc(db, "user", othrId) //다른 교사 user
    //신규값
    await runTransaction(db, async (transaction) => {
      const actiDoc = await transaction.get(actiRef)
      const userDoc = await transaction.get(userRef)
      const otrDoc = await transaction.get(otrRef)
      if (!actiDoc.exists()) { throw new Error("활동 읽기 에러") }
      if (!userDoc.exists()) { throw new Error("유저 읽기 에러") }
      if (!otrDoc.exists()) { throw new Error("타교사 읽기 에러") }
      //기존 데이터 or undefined 반환 undefined인 경우엔 초기값 제공
      let copiedActiList = userDoc.data().copiedActiList || [];  //기존 업어간 활동 //기존 업어간 활동 + 새로 업어온 활동
      copiedActiList = makeUniqueArrWithEle(copiedActiList, { id: actiDoc.id, ...actiDoc.data(), madeById: actiDoc.data().uid, uid: user.uid }, "id")
      let likedCount = (actiDoc.data().likedCount || 0) + 1;
      let targetLikedCount = (otrDoc.data().likedCount || 0) + 1;  //기존 좋아요 + 1 
      //업데이트
      transaction.update(userRef, { copiedActiList })
      transaction.update(actiRef, { likedCount })
      transaction.update(otrRef, { targetLikedCount })
    }).then(() => {
      window.alert("활동이 저장되었습니다.")
    }).catch(err => {
      window.alert(err);
      console.log(err);
    })
  }
  //2. 업어온 활동 삭제하기: 활동 관리 - 나의 활동 - 업어온 활동 - 삭제
  const delCopiedActiTransaction = async (actiId) => {
    let userDocRef = doc(userCol, user.uid)
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userDocRef)
      if (!userDoc.exists()) { throw new Error("유저 읽기 에러") }
      let copiedActiList = userDoc.data().copiedActiList || [];
      copiedActiList = copiedActiList.filter((item) => { return item.id !== actiId })
      transaction.update(userDocRef, { copiedActiList })
    }).then(() => {
      window.alert("활동이 삭제되었습니다.")
    }).catch(err => {
      window.alert(err);
      console.log(err);
    })
  }
  //10. 교사/학생 변경
  const changeIsTeacherTransaction = useCallback(async (schoolCode, memberId) => {
    const schoolDoc = doc(schoolCol, schoolCode);
    const memberDoc = doc(userCol, memberId);
    await runTransaction(db, async (transaction) => {
      //1. read
      const schoolSnapshot = await transaction.get(schoolDoc);
      if (!schoolSnapshot.exists()) { throw new Error("학교 읽기 에러") };
      const memberSnapshot = await transaction.get(memberDoc);
      if (!memberSnapshot) { throw new Error("멤버 읽기 에러") };
      //2. edit
      const isTeacher = memberSnapshot.data().isTeacher;
      const updatedMemberList = schoolSnapshot.data().memberList.map((member) => {
        return member.uid === memberId
          ? { ...member, isTeacher: !isTeacher }
          : member
      })
      transaction.update(memberDoc, { isTeacher: !isTeacher });
      transaction.update(schoolDoc, { memberList: updatedMemberList });
    }).catch((error) => {
      alert(`관리자에게 문의하세요(useFireTransaction_10),${error}`)
      console.log(error);
    })
  }, []);
  //9. 코티칭 교사 가입 승인 
  const approveCoteahingTransaction = async (teacherId, klassId) => {
    const coTeacherRef = doc(userCol, teacherId);
    await runTransaction(db, async (transaction) => {
      //1. read
      const coTeacherSnapshot = await transaction.get(coTeacherRef);
      if (!coTeacherSnapshot.exists()) { throw new Error("교사 읽기 에러") };
      const coTeachingList = coTeacherSnapshot.data().coTeachingList;
      if (!coTeachingList) { throw new Error("코티칭 신청 읽기 에러") };
      //2. edit
      const newList = coTeachingList.map((item) => {
        if (item.id === klassId) { return { ...item, isApproved: true } }
        return item
      });
      transaction.update(coTeacherRef, { coTeachingList: newList });
    }).catch((error) => {
      alert(`관리자에게 문의하세요(useFireTransaction_09),${error}`)
      console.log(error);
    })
  }
  //8. 학교 탈퇴하기(250217)
  const leaveSchoolTransaction = async (schoolCode) => {
    const userDoc = doc(db, "user", user.uid);
    const schoolDoc = doc(schoolCol, schoolCode);
    const classroomsCol = collection(db, "classRooms");
    try {
      await runTransaction(db, async (transaction) => {
        //1. read
        const userSnapshot = await transaction.get(userDoc);
        const schoolSnapshot = await transaction.get(schoolDoc);
        if (!userSnapshot.exists()) { throw new Error("유저 정보 없음"); };
        if (!schoolSnapshot.exists()) { throw new Error("학교 정보 없음"); };
        //2. write
        const memberList = schoolSnapshot.data().memberList;
        const deleted = memberList.filter((item) => { return item.uid !== user.uid });
        transaction.update(userDoc, { school: deleteField(), coTeachingList: deleteField() });
        transaction.update(schoolDoc, { memberList: deleted });
      })
      //3. classroom 컬렉션에서 특정 uid를 가진 문서들 삭제
      const q = query(classroomsCol, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      for (const klassSnapshot of querySnapshot.docs) {
        const klassId = klassSnapshot.id;
        const petsRef = collection(db, "classRooms", klassId, "students");
        while (true) { //무한 반복                                                                         
          const petSnapshots = await getDocs(petsRef);
          const innerBatch = writeBatch(db);
          if (petSnapshots.empty) break;
          petSnapshots.forEach((petSnapshot) => {
            innerBatch.delete(doc(db, "classRooms", klassSnapshot.id, "students", petSnapshot.id)); //subCollection 하위 문서 삭제
          })
          await innerBatch.commit(); // 🔥 subCollection 문서 반복 삭제
        }
        deleteDoc(doc(db, "classRooms", klassSnapshot.id));
      }
    } catch (err) {
      window.alert(err)
      console.log(err)
    }
  }

  //7. 거절 확인
  const confirmDenialTransaction = async (info) => {
    const userRef = doc(db, "user", user.uid);
    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        //1. read
        if (!userDoc.exists()) { throw new Error("유저 정보 없음"); }
        //2. update
        let deleted
        if (user.isTeacher) {
          const coTeachingList = userDoc.data().coTeachingList || [];
          deleted = coTeachingList.filter((item) => { return item.id !== info.id });
          transaction.update(userRef, { onSubmitList: arrayRemove(info), coTeachingList: deleted })
        } else {
          const myKlassList = userDoc.data().myClassList || [];
          deleted = myKlassList.filter((item) => { return item.id !== info.classId })
          transaction.update(userRef, { onSubmitList: arrayRemove(info), myClassList: deleted })
        }
      })
    } catch (err) {
      window.alert(err)
      console.log(err)
    }
  }

  //6. 교사 거절
  const denyTransaction = async (info, reason) => {
    const teacherRef = doc(db, "user", user.uid);
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식
    let denialInfo
    let otherRef
    if (info.type === "join") {
      const { school, classId, classTitle, petLabel, studentId } = info
      denialInfo = { school, classId, classTitle, petLabel, reason, type: "denial" }
      otherRef = doc(db, "user", studentId);
    } else if (info.type === "win") {
      const { sId, title } = info
      denialInfo = { title, reason, type: "denial" }
      otherRef = doc(db, "user", sId);
    } else if (info.type === "co-teacher") {
      const { klass, teacher } = info
      denialInfo = { id: klass.id, klassTitle: klass.classTitle, subject: klass.subject, name: teacher.name, reason, applyDate: today, type: "denial" }
      otherRef = doc(db, "user", teacher.uid);
    } else if (info.type === "edit") {
      const { subject, sId, newRecord } = info
      denialInfo = { subject, reason, date: today, newRecord, type: "denial" }
      otherRef = doc(db, "user", sId);
    }

    await runTransaction(db, async (transaction) => {
      const teacherDoc = await transaction.get(teacherRef);
      const studentDoc = await transaction.get(otherRef);
      //1. 읽기
      if (!teacherDoc.exists()) { throw new Error("교사 정보 없음"); }
      if (!studentDoc.exists()) { throw new Error("학생 정보 없음"); }
      //2. 수정
      transaction.update(teacherRef, { onSubmitList: arrayRemove(info) })      //교사: 상신 목록 삭제
      transaction.update(otherRef, { onSubmitList: arrayUnion(denialInfo) })   //학생: 거절 목록 추가
    }).then(() => {
      window.alert("거절 사유가 해당 학생에게 전달되었습니다.")
    }).catch(err => {
      window.alert(err)
      console.log(err)
    })
  }

  //5. 교사 생기부 기록 승인
  const approvWinTransaction = async (info) => {
    const { actiId, classId, petId, actiRecord, title, date, tId } = info;
    const actiInfo = { assignedDate: date, id: actiId, madeBy: "획득", record: actiRecord, title, uid: tId };
    const teacherRef = doc(db, "user", user.uid);
    const petRef = doc(db, "classRooms", classId, "students", petId);
    const actiRef = doc(db, "activities", actiId);

    await runTransaction(db, async (transaction) => {
      //1. 읽기
      const teacherDoc = await transaction.get(teacherRef);
      const petDoc = await transaction.get(petRef);
      const actiDoc = await transaction.get(actiRef);
      if (!teacherDoc.exists()) { throw new Error("TeacherUserInfo does not exist!"); }
      if (!petDoc.exists()) { throw new Error("Pet does not exist!"); }
      if (!actiDoc.exists()) { throw new Error("Acti does not exist!"); }
      //2. 수정
      //교사: 상신 목록 삭제
      transaction.update(teacherRef, { onSubmitList: arrayRemove(info) })
      //펫: 생기부 기록
      const actiList = petDoc.data().actList || [];
      const uniqueList = replaceItem(actiList, actiInfo, "id");
      const accRecord = makeAccRec(uniqueList);
      transaction.update(petRef, { accRecord, actList: uniqueList });
      //활동: 달성자 기록(test 안해봄)
      const winnerList = actiDoc.data().winnerList || [];
      const studentNumber = petDoc.data().studentNumber || "00000";
      const updatedList = [...winnerList, studentNumber];
      transaction.update(actiRef, { winnerList: updatedList });
    }).then(() => {
      alert("생기부가 해당 학생에게 기록되었습니다.");
    }).catch(err => {
      window.alert(err);
      console.log(err);
    })
  }
  //6. 교사 생기부 수정 요청 승인
  const approveEditTransaction = async (info) => {
    const { renewal, ...other } = info;
    const { sId, classId, petId, actiId, newRecord } = other;
    const confirm = { type: "confirm", subType: "edit", message: "생기부 수정 요청이 승인되었습니다.", newRecord };
    const teacherRef = doc(db, "user", user.uid);
    const studentRef = doc(db, "user", sId);
    const petRef = doc(db, "classRooms", classId, "students", petId);
    await runTransaction(db, async (transaction) => {
      //1. 읽기
      const petDoc = await transaction.get(petRef);
      if (!petDoc.exists()) throw new Error("펫이 존재하지 않습니다.");
      const actiList = petDoc.data().actList || [];
      const target = actiList.find((acti) => acti.id === actiId);
      if (!target) throw new Error("학생이 수정 요청한 활동이 없습니다.");
      const edited = { ...target, assignedDate: new Date().toISOString().split("T")[0], record: renewal || newRecord || '' };
      const newList = replaceItem(actiList, edited, "id");
      //2. 수정
      transaction.update(studentRef, { onSubmitList: arrayUnion(confirm) });
      transaction.update(petRef, { actList: newList });
      transaction.update(teacherRef, { onSubmitList: arrayRemove(other) });
    }).then(() => {
      alert("생기부가 해당 학생에게 기록되었습니다.");
    }).catch(err => {
      window.alert(err);
      console.log(err);
    })
  }


  return {
    changeIsTeacherTransaction, copyActiTransaction, delCopiedActiTransaction, approvWinTransaction, approveEditTransaction,
    denyTransaction, confirmDenialTransaction, leaveSchoolTransaction, approveCoteahingTransaction,
  }
}



export default useFireTransaction