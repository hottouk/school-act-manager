import ProgressBar from 'react-bootstrap/ProgressBar';
//추가(250722)
const AnimatedProgressBar = ({ levelInfo, gptProgress }) => {
  if (levelInfo) {
    const { exp, nextLvXp } = levelInfo;
    return <ProgressBar now={(exp / nextLvXp) * 100} label={`${exp} / ${nextLvXp}`} style={{ height: "22px", flexGrow: "1", fontSize: "16px" }} />;
  } else if (gptProgress) {
    const { current, total } = gptProgress;
    return <ProgressBar animated now={(current / total) * 100} label={`${current} / ${total}명`} style={{ height: "22px", flexGrow: "1", fontSize: "16px" }} />;
  }
}

export default AnimatedProgressBar;