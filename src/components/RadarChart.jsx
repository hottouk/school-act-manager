import { Chart } from 'chart.js/auto'; //지우면 에러뜸.
import { Radar } from 'react-chartjs-2';

const RadarChart = ({ abilityScores }) => {
  const { leadership, sincerityScore, attitudeScore, coopScore, careerScore } = abilityScores
  const data = {
    labels: ['리더십', '성실성', '학업', '협업', '진로'],
    datasets: [{
      label: '학생 능력치',
      data: [leadership, sincerityScore, attitudeScore, coopScore, careerScore],
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    }]
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: false
        },
        ticks: { beginAtZero: true, display: true, stepSize: 20 },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    legend: { display: false }
  }

  return (
    <Radar data={data} options={options} />
  )
}

export default RadarChart
