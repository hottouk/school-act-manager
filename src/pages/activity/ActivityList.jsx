import React from 'react'
import styles from './ActivityMain.module.css'
import useFirestore from '../../hooks/useFirestore'

const ActivityList = ({ activities }) => {
  const { deleteDocument } = useFirestore('activities')

  return (
    <>
      {activities.map((item) => {
        return (
          <li key={item.id}>
            <strong className={styles.title}>{item.title}</strong>
            <p className={styles.text}>{item.content}</p>
            <p className={styles.text}>{item.record}</p>
            <button onClick={() => { deleteDocument(item.id) }}>삭제하기</button>
          </li>
        )
      })}
    </>
  )
}

export default ActivityList