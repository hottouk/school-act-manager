import { useState } from 'react';
import styles from './ClassRoomMain.module.css'
import useFirestore from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import useStudent from '../../hooks/useStudent';

const ClassRoomMakeForm = () => {
  const { user } = useAuthContext();
  const [classTitle, setClassTitle] = useState('');
  //select 선택 값
  const [subject, setSubject] = useState('default');
  const [grade, setGrade] = useState('default');
  const [classNumber, setClassNumber] = useState('default');
  const [numberOfStudent, setNumberOfStudent] = useState(0);
  const [intro, setIntro] = useState('');
  const { addClassroom, response } = useFirestore('classRooms');
  const { makeStudent } = useStudent()
  const urlMove = useNavigate()


  const confirmWindow = () => {
    const confirm = window.confirm('클래스를 생성하시겠습니까?')
    if (confirm) {
      const uid = user.uid;
      const newClassroom = { uid, classTitle, subject, grade, classNumber, numberOfStudent, intro }
      const studentList = makeStudent(numberOfStudent, grade, classNumber)
      addClassroom(newClassroom, studentList)
      urlMove('/classRooms')
      console.log(response)
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
    } else if (event.target.id === 'class_grade') {
      setGrade(event.target.value)
    } else if (event.target.id === 'class_number') {
      setClassNumber(event.target.value)
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

        <select id='class_subject' required value={subject} onChange={handleChange}>
          <option value="default" disabled >과목을 선택하세요</option>
          <option value="kor">국어과</option>
          <option value="eng">영어과</option>
          <option value="math">수학과</option>
          <option value="soc">사회과</option>
          <option value="sci">과학과</option>
        </select>

        <select id='class_grade' required value={grade} onChange={handleChange}>
          <option value="default" disabled >학년</option>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </select>

        <select id='class_number' required value={classNumber} onChange={handleChange}>
          <option value="default" disabled >반</option>
          <option value="01">1반</option>
          <option value="02">2반</option>
          <option value="03">3반</option>
          <option value="04">4반</option>
          <option value="05">5반</option>
          <option value="06">6반</option>
          <option value="07">7반</option>
          <option value="08">8반</option>
          <option value="09">9반</option>
          <option value="10">10반</option>
          <option value="11">11반</option>
          <option value="12">12반</option>
          <option value="14">14반</option>
          <option value="15">15반</option>
          <option value="16">16반</option>
          <option value="17">17반</option>
          <option value="18">18반</option>
          <option value="19">19반</option>
          <option value="20">이동반</option>
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