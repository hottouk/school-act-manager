import ProgressBar from 'react-bootstrap/ProgressBar';
import useGetLevel from '../hooks/useGetLevel';

function AnimatedProgressBar({ exp, level }) {
  const { getMaxExpByLevel } = useGetLevel();
  const progress = exp / getMaxExpByLevel(level) * 100
  
  return <ProgressBar animated now={progress} />;
}

export default AnimatedProgressBar;