import React, { useState } from 'react';
import styled from 'styled-components';
import HexagonRadarChart from './HexagonRadarChart';

const Container = styled.div`
  padding: 40px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto';
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 40px;
  font-size: 28px;
`;

const Container2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 500px;
`;

const ControlBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ControlGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #6496ff;
  }
`;

const RangeInput = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e0e0e0;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #6496ff;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #6496ff;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
`;

const ValueDisplay = styled.span`
  display: inline-block;
  background: #f0f4ff;
  color: #6496ff;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 13px;
  margin-left: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  flex: 1;
  padding: 10px;
  background: ${(props) => (props.secondary ? '#f0f4ff' : '#6496ff')};
  color: ${(props) => (props.secondary ? '#6496ff' : 'white')};
  border: ${(props) => (props.secondary ? '2px solid #6496ff' : 'none')};
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${(props) => (props.secondary ? '#e0e8ff' : '#5080dd')};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(100, 150, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ChartTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 18px;
  text-align: center;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
`;

/**
 * 육각형 레이더 차트 데모 컴포넌트
 * 6개의 값을 입력하고 실시간으로 육각형 차트를 확인할 수 있습니다.
 */
const HexagonRadarChartDemo = () => {
    const defaultLabels = ['힘', '속도', '지구력', '방어력', '마력', '행운'];
    const [values, setValues] = useState([60, 75, 50, 80, 65, 70]);
    const [labels, setLabels] = useState(defaultLabels);
    const [maxValue, setMaxValue] = useState(100);

    const handleValueChange = (index, newValue) => {
        const updatedValues = [...values];
        updatedValues[index] = Math.min(Math.max(Number(newValue) || 0, 0), maxValue);
        setValues(updatedValues);
    };

    const handleLabelChange = (index, newLabel) => {
        const updatedLabels = [...labels];
        updatedLabels[index] = newLabel || `축${index + 1}`;
        setLabels(updatedLabels);
    };

    const handleRandomize = () => {
        const randomValues = Array.from({ length: 6 }, () =>
            Math.floor(Math.random() * (maxValue + 1))
        );
        setValues(randomValues);
    };

    const handleReset = () => {
        setValues([50, 50, 50, 50, 50, 50]);
        setLabels(defaultLabels);
        setMaxValue(100);
    };

    return (
        <Container>
            <Title>🎮 육각형 레이더 차트</Title>

            <Container2>
                {/* 차트 표시 */}
                <ChartBox>
                    <ChartTitle>육각형 시각화</ChartTitle>
                    <HexagonRadarChart
                        values={values}
                        maxValue={maxValue}
                        labels={labels}
                        size={350}
                        fillColor="rgba(100, 150, 255, 0.3)"
                        strokeColor="rgba(100, 150, 255, 0.8)"
                        gridColor="rgba(200, 200, 200, 0.2)"
                        labelColor="#333"
                    />
                </ChartBox>

                {/* 컨트롤 */}
                <ControlBox>
                    <h2 style={{ marginTop: 0, color: '#333', marginBottom: 20 }}>
                        값 조정
                    </h2>

                    {/* 최대값 설정 */}
                    <ControlGroup>
                        <Label>
                            최대값: <ValueDisplay>{maxValue}</ValueDisplay>
                        </Label>
                        <RangeInput
                            type="range"
                            min="10"
                            max="200"
                            value={maxValue}
                            onChange={(e) => setMaxValue(Number(e.target.value))}
                        />
                    </ControlGroup>

                    <div style={{ borderTop: '1px solid #e0e0e0', margin: '20px 0' }} />

                    {/* 6개 값 입력 */}
                    <GridContainer>
                        {values.map((value, index) => (
                            <ControlGroup key={`value-${index}`}>
                                <Label>
                                    {labels[index]}:
                                    <ValueDisplay>{value}</ValueDisplay>
                                </Label>
                                <RangeInput
                                    type="range"
                                    min="0"
                                    max={maxValue}
                                    value={value}
                                    onChange={(e) =>
                                        handleValueChange(index, Number(e.target.value))
                                    }
                                />
                            </ControlGroup>
                        ))}
                    </GridContainer>

                    <div style={{ borderTop: '1px solid #e0e0e0', margin: '20px 0' }} />

                    {/* 라벨 입력 */}
                    <div style={{ marginBottom: 20 }}>
                        <Label style={{ marginBottom: 12 }}>축 라벨 수정</Label>
                        <GridContainer>
                            {labels.map((label, index) => (
                                <Input
                                    key={`label-${index}`}
                                    type="text"
                                    value={label}
                                    onChange={(e) => handleLabelChange(index, e.target.value)}
                                    placeholder={`축 ${index + 1}`}
                                />
                            ))}
                        </GridContainer>
                    </div>

                    {/* 버튼 */}
                    <ButtonContainer>
                        <Button onClick={handleRandomize}>🎲 랜덤</Button>
                        <Button secondary onClick={handleReset}>
                            🔄 초기화
                        </Button>
                    </ButtonContainer>
                </ControlBox>
            </Container2>
        </Container>
    );
};

export default HexagonRadarChartDemo;
