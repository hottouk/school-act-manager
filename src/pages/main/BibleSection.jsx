import React from 'react'
import styled from 'styled-components'
import { useFloatOnScroll } from '../../hooks/useFloatOnScroll';

const BibleSection = ({ text, from, backgroundColor }) => {
  const { ref: ref1, isVisible: v1 } = useFloatOnScroll();
  return (
    <Section $backgroundColor={backgroundColor}>
      <BibleText ref={ref1} $visible={v1}>{text} <br />{from}</BibleText>
    </Section>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
const Section = styled(Column)`
  width: 100%;
  height: 200px;
  background-color: ${({ $backgroundColor }) => $backgroundColor || 'white'};
  gap: 20px;
  @media(max-width: 768px) {
    min-height: 200px;
  }
`
const BibleText = styled.p`
  width: 400px;
  color: #black;
  margin: auto;
  text-align: center;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'translateY(0)' : 'translateY(36px)')};
  transition: opacity 1500ms ease, transform 1200ms ease;
  will-change: opacity, transform;
  @media (max-width: 768px) {
    width: 100%;
    font-size: 14px;
  }
`
export default BibleSection
