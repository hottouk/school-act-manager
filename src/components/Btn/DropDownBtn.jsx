import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const DropDownBtn = (props) => {
  return (
    <DropdownButton id="dropdown-basic-button" title={props.btnName}>
      {props.dropdownItem.map((item, index) => {
        return <Dropdown.Item key={index} href={item.href} >{item.label}</Dropdown.Item>
      })}
    </DropdownButton>
  );
}

export default DropDownBtn;