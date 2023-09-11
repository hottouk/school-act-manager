import { useState } from 'react';
import styles from './ClassRoomMain.module.css'
import useFirestore from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';


const ClassRoomMakeForm = () => {
  const { user } = useAuthContext();
  const [classTitle, setClassTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [numberOfStudent, setNumberOfStudent] = useState(0);
  const [intro, setIntro] = useState('');
  const { addDocument, response } = useFirestore('classRooms');
  const urlMove = useNavigate()


  const confirmWindow = () => {
    const confirm = window.confirm('클래스를 생성하시겠습니까?')
    if (confirm) {
      const uid = user.uid;
      const newDoc = { uid, classTitle, subject, numberOfStudent, intro }
      addDocument(newDoc)
    }
  }

  const handleChange = (event) => {
    if (event.target.id === 'class_title') {
      setClassTitle(event.target.value)
    } else if (event.target.id === 'class_subject') {
      setSubject(event.target.value)
    } else if (event.target.id === 'class_number_of_studnets') {
      setNumberOfStudent(event.target.value)
    } else if (event.target.id === 'class_explanation') {
      setIntro(event.target.value)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    confirmWindow();
  }

  const handleCancel = () => {
    urlMove('/classRooms')
  }

  return (
    <form className={styles.cont} onSubmit={handleSubmit}>
      <fieldset>
        <legend>클래스 만들기</legend>

        <label htmlFor='class_title'>클래스 이름</label>
        <input id='class_title' type="text" required onChange={handleChange} value={classTitle} />

        <label htmlFor='class_subject'>과목을 선택하세요</label>
        <select id='class_subject' required value={subject} defaultValue='default' onChange={handleChange}>
          <option value="default" disabled >과목을 선택하세요</option>
          <option value="kor">국어과</option>
          <option value="eng">영어과</option>
          <option value="math">수학과</option>
          <option value="soc">사회과</option>
          <option value="sci">과학과</option>
        </select>

        <label htmlFor='class_number_of_studnets'>학생 총원</label>
        <input type="number" id='class_number_of_studnets' required min='1' value={numberOfStudent} onChange={handleChange} />

        <label>간단한 설명을 작성하세요</label>
        <textarea type="text" id='class_explanation' onChange={handleChange} value={intro} />

        <button type='submit'>만들기</button>
        <button type='button' onClick={handleCancel}>취소</button>
      </fieldset>
    </form>
  )
}

export default ClassRoomMakeForm