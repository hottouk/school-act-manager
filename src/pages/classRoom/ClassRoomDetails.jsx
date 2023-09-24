import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import useDoc from '../../hooks/useDoc';
import styles from './ClassRoomMain.module.css';

const ClassRoomDetails = () => {
  const classId = useParams(); //id와 param의 key-value 오브젝트 반환
  const { document, err } = useDoc(classId) //param을 받아서 전달하면 문서 반환\
  console.log(document)

  return (
    <>
      {err && <strong>err</strong>}
      {!document && <h3>반 정보를 불러올 수 없습니다.</h3>}
      {document &&
        <main>
          <h2 className={styles.classTitle}>{document.classTitle}교실 입니다.</h2>
          <p>{document.numberOfStudent}명의 학생들이 있습니다.</p>
          <p>{document.intro}</p>
          <button onClick={() => {
            console.log('doc-->', document)
          }}>뭐라도 써봐</button>
        </main>
      }
    </>

  )
}

export default ClassRoomDetails