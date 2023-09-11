import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import useFirestore from '../../hooks/useFirestore';

const ClassRoomDetails = () => {
  const location = useLocation();
  const classId = useParams();
  const { docRef } = useFirestore('classRooms', `${classId}`)

  console.log('doc',docRef)

  useEffect(() => {
    console.log(classId)
  }, [location])


  return (
    <div>ClassRoomDetails</div>
  )
}

export default ClassRoomDetails