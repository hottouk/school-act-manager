import { useNavigate } from 'react-router-dom'
import useFirestore from '../../hooks/useFirestore'
import styles from './ClassRoomMain.module.css'

const ClassRoomList = ({ classRooms }) => {
  const { deleteDocument } = useFirestore('classRooms')
  const urlMove = useNavigate()
  const handleEnterRoom = (classUrl) => {
    urlMove(`/classrooms/${classUrl}`)
  }

  return (
    <>
      {classRooms.map((item) => {
        return (
          <li key={item.id} className={styles.item} >
            <h4 className={styles.title}>{item.classTitle}</h4>
            <p>{item.intro}</p>
            <p>{item.subject}</p>
            <button type='button' onClick={() => {
              handleEnterRoom(item.id)
            }}>입장하기</button>
          </li>
        )
      })}
    </>
  )
}

export default ClassRoomList