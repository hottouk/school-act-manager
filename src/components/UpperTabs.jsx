import styled from "styled-components"
//생성(260228)
const UpperTabs = ({ top, left, tabList = ["샘플1", "샘플2"], selectedIdx, onClick, disabled }) => {

	const handleOnClick = () => {
		if (disabled) return;
		onClick();
	}
	return (
		<Container $top={top || 0} $left={left || 0}>
			{tabList.map((name, idx) => {
				const selected = idx === selectedIdx;
				return <Tab key={idx}
					$selected={selected}
					$disabled={disabled}
					onClick={() => onClick(idx)}
				>{name}
				</Tab >
			})}

		</Container>
	)
}
const Container = styled.div`
	position: absolute;
	display: flex;
	top: ${({ $top }) => $top};
	left: ${({ $left }) => $left};
`
const Tab = styled.p`
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  color: white;
  padding: 5px 15px;
  cursor: ${({ $disabled }) => $disabled ? "auto" : "pointer"};
	background-color: ${({ $selected, $disabled }) => {
		if ($disabled) return " #919294"
		else return ($selected ? "#3454d1" : "#3454d191");
	}};
`

export default UpperTabs