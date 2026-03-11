import { useState } from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import styled from "styled-components";
//생성(260223)
const sampleOptions = [
  { label: "Low", value: "low" },
  { label: "Mid", value: "mid" },
  { label: "High", value: "high" },
];

const SpectrumSelector = ({ options = [], value, setValue }) => {
  return (
    <GroupRoot
      type="single"
      value={value}
      onValueChange={(next) => next && setValue(next)}
      aria-label="스펙트럼 선택"
    >
      {options.length === 0 && sampleOptions.map((opt) => (
        <GroupItem key={opt.value} value={opt.value} aria-label={opt.label}>
          {opt.label}
        </GroupItem>
      ))}
      {options.length > 0 && options.map((opt) => (
        <GroupItem key={opt.value} value={opt.value} aria-label={opt.label}>
          {opt.label}
        </GroupItem>
      ))}
    </GroupRoot>
  );
}

export default SpectrumSelector;
const GroupRoot = styled(ToggleGroup.Root)`
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
`;

const GroupItem = styled(ToggleGroup.Item)`
  flex-grow: 1;
  border: 0;
  background: transparent;
  color: ##3454d190;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: #e5e7eb;
  }

  &[data-state="on"] {
    background: #3454d1b1;
    color: #ffffff;
    font-weight: 600;
  }

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
