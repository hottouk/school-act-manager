import styled from "styled-components"

const CommonTextarea = ({ id, title, value, onChange, placeholder, disabled, required, styles }) => {

  return (
    <Container>
      <label htmlFor={id} >{title || "샘플"}</label>
      <textarea
        id={id}
        type="text"
        onChange={onChange}
        value={value}
        placeholder={placeholder || "샘플"}
        required={required || false}
        disabled={disabled}
      />
    </Container>
  )
}

const Container = styled.div`
  label {
    display: block;
  }
  textarea { 
    display: block;
    width: 100%;
    min-height: 75px;
    margin-top: 5px;
    margin-bottom: 15px;
    padding: 5px;
    border-radius: 7px;
    border: none;
  }
`
export default CommonTextarea