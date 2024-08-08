import styled from "styled-components"

const CommonTextArea = ({ id, title, value, onChange, placeholder, disabled }) => {
  return (
    <StyledTextAraeWrapper>
      <label htmlFor={id} >{title || "샘플"}</label>
      <textarea id={id} type="text" onChange={onChange} value={value} disabled={disabled}
        placeholder={placeholder || "샘플"} />
    </StyledTextAraeWrapper>
  )
}

const StyledTextAraeWrapper = styled.div`
  label {
    display: block;
  }
  textarea { 
    display: block;
    width: 100%;
    min-width: 400px;
    min-height: 150px;
    margin-top: 5px;
    margin-bottom: 15px;
    border-radius: 7px;
    &:disabled {  /* 해당 개체 disabled 되었을 때 */
      color: #efefef;
    }
  }
`
export default CommonTextArea