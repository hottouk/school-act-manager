import React from 'react'
import styles from './ActivityMain.module.css'

const ActivityList = ({ activities }) => {
  return (
    <>
      {activities.map((item) => {
        return (
          <li key={item.id}>
            <strong className={styles.title}>{item.title}</strong>
            <p className={styles.text}>{item.content}</p>
            <p className={styles.text}>{item.record}</p>
          </li>
        )
      })}
    </>
  )
}

export default ActivityList