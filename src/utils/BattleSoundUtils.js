let audioContext = null;

const getAudioContext = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new AudioContext();
  }
  return audioContext;
};

const scheduleTone = (context, {
  type = 'sine',
  frequency,
  endFrequency = frequency,
  offset = 0,
  duration = 0.2,
  volume = 0.1,
}) => {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const startedAt = context.currentTime + offset;
  const endedAt = startedAt + duration;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startedAt);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, endedAt);
  gain.gain.setValueAtTime(0.0001, startedAt);
  gain.gain.exponentialRampToValueAtTime(volume, startedAt + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, endedAt);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startedAt);
  oscillator.stop(endedAt + 0.01);
};

const soundPatterns = {
  attack: [
    { type: 'sawtooth', frequency: 920, endFrequency: 120, duration: 0.18, volume: 0.1 },
    { type: 'square', frequency: 150, endFrequency: 70, offset: 0.1, duration: 0.16, volume: 0.07 },
  ],
  defense: [
    { type: 'triangle', frequency: 260, endFrequency: 520, duration: 0.28, volume: 0.09 },
    { type: 'sine', frequency: 780, endFrequency: 620, offset: 0.04, duration: 0.38, volume: 0.07 },
  ],
  rest: [
    { frequency: 392, offset: 0, duration: 0.25, volume: 0.08 },
    { frequency: 523.25, offset: 0.13, duration: 0.28, volume: 0.09 },
    { frequency: 659.25, offset: 0.26, duration: 0.38, volume: 0.08 },
  ],
};

export const playBattleSound = async (soundType) => {
  const context = getAudioContext();
  const pattern = soundPatterns[soundType];
  if (!context || !pattern) return;

  try {
    if (context.state === 'suspended') await context.resume();
    pattern.forEach((tone) => scheduleTone(context, tone));
  } catch (error) {
    // 브라우저의 자동 재생 차단이 전투 진행을 방해하지 않게 한다.
    console.debug(`Battle ${soundType} sound could not be played.`, error);
  }
};
