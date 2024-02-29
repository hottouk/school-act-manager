import React from 'react'
import Form from 'react-bootstrap/Form';

const HomeworkRadio = ({ isHomework, onChange, disabled }) => {
  return (
    <div className='radio_div'>
      <div>활동구분</div>
      <Form.Check onChange={onChange}
        inline
        type='radio'
        id={'activity_radio_btn'}
        name='isHomework_radio'
        label={'생기부 기록 전용'}
        checked={!isHomework}
        disabled={disabled}
      ></Form.Check>
      <Form.Check onChange={onChange}
        inline
        type='radio'
        id={'homework_radio_btn'}
        name='isHomework_radio'
        label={'과제 제출도 가능'}
        checked={isHomework}
        disabled={disabled}
      ></Form.Check>
    </div>
  )
}

export default HomeworkRadio