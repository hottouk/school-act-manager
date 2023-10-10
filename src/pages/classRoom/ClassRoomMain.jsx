import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext';
import useCollection from '../../hooks/useCollection'
import ClassRoomList from './ClassRoomList';
import styles from './ClassRoomMain.module.css';


const ClassRoomMain = () => {
  const { user } = useAuthContext();
  const { documents, err } = useCollection('classRooms', ['uid', '==', user.uid], 'subject')
  const urlMove = useNavigate()
  const classroomList = documents
  //testCode
  // console.log('교실List',classroomList)

  const handleOnClick = (event) => {
    event.preventDefault()
    urlMove('/classrooms_setting')
  }

  return (
    <main>
      <ul className={styles.classRoom_list}>
        {classroomList && <ClassRoomList classRooms={classroomList} />}
        {!classroomList && <h3>아직 클래스가 없어요. 클래스를 만들어주세요</h3>}
        {err && <strong>{err}</strong>}
      </ul>
      <button onClick={handleOnClick}>클래스 만들기</button>
    </main>
  )
}

export default ClassRoomMain