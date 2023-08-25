import React from 'react'
import { Button, Image } from 'react-bootstrap'
import styles from './ActivityMain.module.css'
import { useAuthContext } from '../../hooks/useAuthContext'
import ActivityForm from './ActivitityForm'
import useCollection from '../../hooks/useCollection'
import ActivityList from './ActivityList'

const ActivityMain = () => {
  const { user } = useAuthContext();
  const { documents, err } = useCollection('activities')

  // const loginInfo = useRecoilValue(loginInfoState)
  // const imageUrl = loginInfo.picture;
  // console.log(imageUrl)

  return (
    <main className={styles.cont}>
      <aside className={styles.side_menu}>
        <ActivityForm uid={user.uid} />
      </aside>
      <ul className={styles.content_list}>
        {err && <strong>{err}</strong>}
        {documents && <ActivityList activities={documents} />}
      </ul>

    </main>
  )
}

export default ActivityMain