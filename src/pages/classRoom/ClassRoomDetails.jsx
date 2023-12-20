import { useNavigate, useParams } from 'react-router-dom'
//customHooks
import useDoc from '../../hooks/useDoc';
import useCollection from '../../hooks/useCollection';
import useSubCollection from '../../hooks/useSubCollection';
import { useAuthContext } from '../../hooks/useAuthContext';

//컴포넌트
import StudentList from '../../components/StudentList';

//스타일
import styles from './ClassRoomDetails.module.css';
import styled from 'styled-components';

//파이어베이스
import MainSelector from './MainSelector.jsx';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAllStudents } from '../../store/allStudentsSlice';

//스타일
const StyledStudentList = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    list-style: none;
    padding: 10px;
    border: 1px black solid;
    border-radius: 10px;
    padding: 0px 0px;
  `

const ClassRoomDetails = () => {
  const navigate = useNavigate()
  const { user } = useAuthContext();
  //개별 클래스 구별해주는 변수
  const classId = useParams(); //id와 param의 key-value(id:'id') 오브젝트로 반환
  const { document, err } = useDoc(classId) //param을 받아서 전달하면 교실 정보 문서 반환

  //데이터 통신 변수
  const { subDocuments, subColErr } = useSubCollection('classRooms', classId.id, 'students', 'studentNumber') //모든 학생 List
  const { documents, colErr } = useCollection('activities', ['uid', '==', user.uid], 'title') //활동 List)

  let dispatcher = useDispatch()

  useEffect(() => {
    dispatcher(setAllStudents(subDocuments))
  }, [subDocuments])
  
  console.log(classId.id, '반 활동List', documents)
  console.log(classId.id, '반 학생List', subDocuments)


  return (
    <>
      {err && <strong>err</strong>}
      {!document && <h3>반 정보를 불러올 수 없습니다.</h3>}
      {document &&
        <>
          <h2 className={styles.classTitle}>{document.classTitle}교실 입니다.</h2>
          <p>{document.numberOfStudent}명의 학생들이 있습니다.</p>
          <p>{document.intro}</p>
          {/* 셀렉터 */}
          <MainSelector studentList={subDocuments} activitiyList={documents} classId={classId} />
          <main className={styles.classroomDetailsCont}>
            {/* 학생 상세 보기 */}
            <StyledStudentList>
              {!subDocuments ? <h3>반에 학생들이 등록되어 있지 않습니다. {subColErr}</h3>
                : subDocuments.length === 0 ? <h3>반에 학생들이 등록되어 있지 않습니다. {subColErr}</h3>
                  : <StudentList studentList={subDocuments} />}
            </StyledStudentList>
          </main>
          <footer>
            <button onClick={() => { navigate('allStudents', { state: subDocuments }) }}>이동</button>
          </footer>
        </>
      }
    </>
  )
}

export default ClassRoomDetails