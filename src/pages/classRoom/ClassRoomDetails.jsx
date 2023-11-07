import { useState } from 'react';
import { useParams } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext';

//customHooks
import useDoc from '../../hooks/useDoc';
import useCollection from '../../hooks/useCollection';
import useSubCollection from '../../hooks/useSubCollection';
//컴포넌트
import StudentList from '../../components/StudentList';
import ActivitySimpleList from '../activity/ActivitySimpleList';

//스타일
import styles from './ClassRoomDetails.module.css';
import MultiSelector from '../../components/MultiSelector';
import { useSelector } from 'react-redux';

const ClassRoomDetails = () => {
  const { user } = useAuthContext();
  const classId = useParams(); //id와 param의 key-value(id:'id') 오브젝트로 반환
  const [actOn, setActOn] = useState(false);
  const { document, err } = useDoc(classId) //param을 받아서 전달하면 문서 반환

  //redux 전역변수
  const studentSelected = useSelector(({ studentSelected}) => { return studentSelected }) 
  const activitySelected = useSelector(({ activitySelected }) => { return activitySelected }) 
  
  const { subDocuments, subColErr } = useSubCollection('classRooms', classId.id, 'students', 'studentNumber') //학생 List
  const { documents, colErr } = useCollection('activities', ['uid', '==', user.uid], 'title') //활동 List

  // testCodecd 
  console.log(classId.id, '반 학생List', subDocuments)
  console.log(classId.id, '반 활동List', documents)

  console.log(Array.isArray(subDocuments) && subDocuments.length)

  const handleBringActivities = () => {
    setActOn(!actOn)
  }

  const handleSelectComplete = () => {
    console.log('선택 학생', studentSelected)
    console.log('선택 활동', activitySelected)
  }

  return (
    <>
      {err && <strong>err</strong>}
      {!document && <h3>반 정보를 불러올 수 없습니다.</h3>}
      {document &&
        <>
          <h2 className={styles.classTitle}>{document.classTitle}교실 입니다.</h2>
          <p>{document.numberOfStudent}명의 학생들이 있습니다.</p>
          <p>{document.intro}</p>
          {/* 셀렉터 */}
          <div className={styles.main_slector}>
            <div className={styles.student_slector}>
              <MultiSelector studentList={subDocuments} />
            </div>
            <div className={styles.activity_slector}>
              <MultiSelector activitiyList={documents} />
            </div>
            <button className={styles.slectorButton} onClick={() => {
              handleSelectComplete()
            }}>선택 완료</button>
          </div>
          <main className={styles.classroomDetailsCont}>

            {/* 학생 상세 보기 */}
            <aside className={styles.student_list}>
              {!subDocuments ? <h3>반에 학생들이 등록되어 있지 않습니다. {subColErr}</h3>
                : subDocuments.length === 0 ? <h3>반에 학생들이 등록되어 있지 않습니다. {subColErr}</h3>
                  : <StudentList students={subDocuments} />}
            </aside>

            <ul className={styles.activity_list}>
              {actOn && <ActivitySimpleList activities={documents} />}
            </ul>
          </main>
          <footer>
            <button onClick={() => { console.log('doc-->', document) }}>뭐라도 써봐</button>
            <button onClick={() => { handleBringActivities() }}>{!actOn ? <p>활동 불러오기</p> : <p>활동 탭 닫기</p>}</button>
          </footer>
        </>
      }
    </>
  )
}

export default ClassRoomDetails