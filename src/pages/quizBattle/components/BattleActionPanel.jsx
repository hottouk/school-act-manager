import React from 'react'
import styled from 'styled-components'

const BattleActionPanel = ({
  buttons = [],
  extraButton = null,
}) => {
  return (
    <ActionPanel>
      <ButtonRow>
        {buttons.map((btn, idx) => (
          <ActionButton
            key={idx}
            type="button"
            $variant={btn.variant || 'primary'}
            disabled={btn.disabled}
            onClick={btn.onClick}
          >
            {btn.label}
          </ActionButton>
        ))}
      </ButtonRow>
      {extraButton}
    </ActionPanel>
  )
}

const ActionPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 14px;
  border: 1px solid #d9e2ff;
  border-radius: 14px;
  background: linear-gradient(135deg, #ffffff 0%, #f7f9ff 100%);
  box-shadow: 0 8px 24px rgba(52, 84, 209, 0.1);
  box-sizing: border-box;

  @media screen and (max-width: 768px) {
    gap: 8px;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 14px rgba(52, 84, 209, 0.08);
  }
`

const ButtonRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;

  @media screen and (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }
`

const buttonColors = {
  primary: {
    color: '#ffffff',
    background: '#3454d1',
    border: '#3454d1',
    hover: '#2945b8',
    shadow: 'rgba(52, 84, 209, 0.24)',
  },
  secondary: {
    color: '#3454d1',
    background: '#ffffff',
    border: '#aebcf2',
    hover: '#eef2ff',
    shadow: 'rgba(52, 84, 209, 0.12)',
  },
  danger: {
    color: '#ffffff',
    background: '#dc3545',
    border: '#dc3545',
    hover: '#bd2837',
    shadow: 'rgba(220, 53, 69, 0.2)',
  },
}

const ActionButton = styled.button`
  min-height: 52px;
  padding: 12px 18px;
  border: 1px solid ${({ $variant }) => buttonColors[$variant]?.border || buttonColors.primary.border};
  border-radius: 10px;
  color: ${({ $variant }) => buttonColors[$variant]?.color || buttonColors.primary.color};
  background: ${({ $variant }) => buttonColors[$variant]?.background || buttonColors.primary.background};
  box-shadow: 0 4px 12px ${({ $variant }) => buttonColors[$variant]?.shadow || buttonColors.primary.shadow};
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  cursor: pointer;
  transition: transform 150ms ease, background-color 150ms ease, box-shadow 150ms ease;

  &:hover:not(:disabled) {
    background: ${({ $variant }) => buttonColors[$variant]?.hover || buttonColors.primary.hover};
    transform: translateY(-1px);
    box-shadow: 0 6px 16px ${({ $variant }) => buttonColors[$variant]?.shadow || buttonColors.primary.shadow};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 2px 8px ${({ $variant }) => buttonColors[$variant]?.shadow || buttonColors.primary.shadow};
  }

  &:focus-visible {
    outline: 3px solid rgba(52, 84, 209, 0.28);
    outline-offset: 2px;
  }

  &:disabled {
    border-color: #d5d9e5;
    color: #8b93a7;
    background: #eef0f5;
    box-shadow: none;
    cursor: not-allowed;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    min-height: 48px;
    padding: 10px 14px;
    font-size: 15px;
  }
`

export default BattleActionPanel
