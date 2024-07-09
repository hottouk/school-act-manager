import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const DropDownBtn = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate()

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);


  const handleItemClick = ({ href, itemState }) => {
    navigate(`/${href}`, { state: itemState })
    setIsOpen(false);
  };

  const sampleItems = [ //샘플
    { href: '#/action-1', label: 'Action' },
    { href: '#/action-2', label: 'Another action' },
    { href: '#/action-3', label: 'Something else' }
  ];

  return (
    <StyledDropdown ref={dropdownRef}>
      <DropdownButton onClick={toggleDropdown}>
        {props.btnName ? props.btnName : "드랍 다운 버튼"}
      </DropdownButton>
      {isOpen && (
        <DropdownContent className={isOpen ? 'show' : ''}>
          {!props.dropDownItems && sampleItems.map((item, index) => ( //기본값
            <DropdownItem key={index} onClick={() => handleItemClick(item)} >
              {item.label}
            </DropdownItem>
          ))}
          {props.dropDownItems && props.dropDownItems.map((item, index) => ( //사용자 입력 값
            <DropdownItem key={index} onClick={() => handleItemClick(item)} >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownContent>
      )}
    </StyledDropdown>
  );
}

const StyledDropdown = styled.div`
  position: relative;
  display: inline-block;
`
const DropdownButton = styled.button`
  background-color: #3454d1; 
  color: white; /* White text */
  padding: 10px 0;
  font-size: 16px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #1D4A92;
    border: none;
    border-radius: 10px;
  }
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const DropdownContent = styled.div`
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  top: 100%; /* Place it below the dropdown button */
  left: 0;
  transition: all 0.3s ease-out;
  &.show {
    display: block; /* Show when active */
    animation: ${slideDown} 0.3s ease-out;
  }
`;
const DropdownItem = styled.a`
  color: black!important; /* Dark text color */
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  &:hover {
    background-color: #f1f1f1;
    cursor: pointer;
  }
`;

export default DropDownBtn;