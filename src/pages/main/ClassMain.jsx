import React from 'react'
import { Button, Image } from 'react-bootstrap'
import styles from './ClassMain.module.css'

const ClassMain = () => {
  // const loginInfo = useRecoilValue(loginInfoState)
  // const imageUrl = loginInfo.picture;
  // console.log(imageUrl)
  return (
    <main className={styles.cont}>
      <aside className={styles.side_menu}>
        DiaryForm
      </aside>
      <ul className={styles.content_list}>
        dairy list
      </ul>

    </main>
  )
}

export default ClassMain