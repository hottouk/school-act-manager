import styles from './ActivityMain.module.css'
import useFirestore from '../../hooks/useFirestore'

const ActivityList = ({ activities }) => {
  const { deleteDocument } = useFirestore('activities')

  return (
    <>
      {activities.map((item) => {
        return (
          <li key={item.id} className={styles.item}>
            <strong className={styles.title}>{item.title}</strong>
            <label>활동 설명</label>
            <p className={styles.text}>{item.content}</p>
            <label>생기부 문구</label>
            <p className={styles.text}>{item.record}</p>
            <button onClick={() => { deleteDocument(item.id) }}>X</button>
          </li>
        )
      })}
    </>
  )
}

export default ActivityList