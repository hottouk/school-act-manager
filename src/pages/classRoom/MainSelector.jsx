//컴포넌트
import { useEffect, useState } from 'react';
import MultiSelector from '../../components/MultiSelector';

//리덕스
import { useSelector } from 'react-redux';

//파이어베이스
import { appFireStore } from '../../firebase/config.js'
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import styles from './ClassRoomDetails.module.css';

const MainSelector = ({ studentList, activitiyList, classId }) => {
  //redux 전역변수
  const studentSelected = useSelector(({ studentSelected }) => { return studentSelected })
  const activitySelected = useSelector(({ activitySelected }) => { return activitySelected })

  //누가기록 작성 함수
  const makeAccWithSelectedActs = async (activityList) => {
    let accRecord = '' //누가기록 담는 변수
    await Promise.all( //Promise.All을 사용하면 모든 Promise가 반환될 때까지 기다린다.
      activityList.map(async ({ value }) => { //선택된 모든 활동에서 아래 작업 반복
        let activityId = value //id 참조
        const activityRef = doc(appFireStore, "activities", activityId); //id로 활동 data 위치 참조
        const activitySnap = getDoc(activityRef);
        await activitySnap.then((activity) => {
          accRecord = accRecord.concat(' ' + activity.data().record) //선택한 활동들의 누가 기록
        })
        return null
      }))
    return accRecord
  }

  const handleSelectComplete = async () => { //★★★ 핵심 로직
    console.log('선택 학생', studentSelected)
    console.log('선택 활동', activitySelected)
    studentSelected.map(({ value }) => { //선택된 모든 학생에게서 아래 작업 반복 
      let studentId = value //id 참조
      const studentRef = doc(appFireStore, "classRooms", classId.id, "students", studentId); //id로 학생 data 위치 참조
      const studentSnap = getDoc(studentRef); //학생 데이터 반환 Promise
      studentSnap.then((student) => {
        try {
          let accumulativeRecord = student.data().accumulativeRecord //선택 학생 한명의 기존 누가 기록 str/undefined 반환
          console.log(`${studentId}의 기존 누가기록`, accumulativeRecord)
          //누가기록 작성 함수
          makeAccWithSelectedActs(activitySelected).then((acc) => {
            //데이터 서버에 업데이트
            if (!accumulativeRecord) { //기존 누가기록이 undefined라면 대체
              accumulativeRecord = acc;
              setDoc(studentRef, {
                accumulativeRecord: accumulativeRecord
              }, { merge: true })
            } else {//기존 누가기록이 존재한다면 추가 작성
              accumulativeRecord += acc
              setDoc(studentRef, {
                accumulativeRecord: accumulativeRecord
              }, { merge: true })
            }
            console.log(`${studentId}의 새로운 누가기록`, accumulativeRecord)
          })
        } catch (error) {
          console.log(error.message)
        }
      })
      return null;
      //학생 반복 종료
    })
  }

  return (
    <>
      {/* 셀렉터 */}
      <div className={styles.main_slector}>
        <div className={styles.student_slector}>
          <MultiSelector studentList={studentList} />
        </div>
        <div className={styles.activity_slector}>
          <MultiSelector activitiyList={activitiyList} />
        </div>
        <button className={styles.slectorButton} onClick={() => {
          handleSelectComplete()
        }}>선택 완료</button>
      </div>
    </>

  )
}

export default MainSelector