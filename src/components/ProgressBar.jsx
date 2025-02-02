import ProgressBar from 'react-bootstrap/ProgressBar';

const AnimatedProgressBar = ({ levelInfo }) => {
  let { exp, nextLvXp } = levelInfo
  return <ProgressBar now={(exp / nextLvXp) * 100} label={`${exp} / ${nextLvXp}`} style={{ height: "22px", flexGrow: "1", fontSize: "16px" }} />;
}

export default AnimatedProgressBar;