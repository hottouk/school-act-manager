import styles from '../classRoom/ClassRoomDetails.module.css';

const ActivitySimpleList = ({ activities }) => {

  return (
    <>
      {activities.map((item) => {
        return (
          <li key={item.id} className={styles.item}>
            <strong className={styles.title}>{item.title}</strong>
            <label>활동 설명</label>
            <p className={styles.text}>{item.content}</p>
          </li>
        )
      })}
    </>
  )
}

export default ActivitySimpleList