import React from 'react'
import styles from './ActivityMain.module.css'
import { useAuthContext } from '../../hooks/useAuthContext'
import ActivityForm from './ActivitityForm'
import useCollection from '../../hooks/useCollection'
import ActivityList from './ActivityList'

const ActivityMain = () => {
  const { user } = useAuthContext();
  const { documents, colErr } = useCollection('activities', ['uid', '==', user.uid], 'title')

  return (
    <main className={styles.cont}>
      <aside className={styles.side_menu}>
        <ActivityForm uid={user.uid} />
      </aside>
      <ul className={styles.content_list}>
        {colErr && <strong>{colErr}</strong>}
        {documents && <ActivityList activities={documents} />}
      </ul>
    </main>
  )
}

export default ActivityMain