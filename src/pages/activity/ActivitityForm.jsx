import { useEffect, useState } from "react"
import useFirestore from "../../hooks/useFirestore";

const Activities = ({ uid }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [record, setRecord] = useState('');
  const { addDocument, response } = useFirestore('activities');
  

  const confirmWindow = () => {
    const confirm = window.confirm('활동을 저장하시겠습니까?')
    if (confirm) {
      const newDoc = { uid, title, content, record }
      addDocument(newDoc)
    }
  }

  const handleChange = (event) => {
    if (event.target.id === 'acti_title') {
      setTitle(event.target.value)
    } else if (event.target.id === 'acti_content') {
      setContent(event.target.value)
    } else if (event.target.id === 'acti_record') {
      setRecord(event.target.value)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    confirmWindow();
  }

  useEffect(() => {
    if (response.isSuccess) {
      setTitle('')
      setContent('')
      setRecord('')
    }
  }, [response.isSuccess])

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>활동 작성하기</legend>
        <label htmlFor="acti_title" >활동 제목</label>
        <input id="acti_title" type="text" required onChange={handleChange} value={title} />

        <label htmlFor="acti_content" >활동 설명</label>
        <textarea id="acti_content" type="text" required onChange={handleChange} value={content} />

        <label htmlFor="acti_record" >생기부 문구</label>
        <textarea id="acti_record" type="text" required onChange={handleChange} value={record} />

        <button type="submit">저장하기</button>
      </fieldset>
    </form>
  )
}

export default Activities