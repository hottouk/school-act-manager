import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Text } from '../../../components/Game/SafePixiText';
//creation(250111) -> modified(250722) -> codex(260712)
const Countdown = ({ count, endCountCallback, x, y }) => {
  const audioContextRef = useRef(null);

  const playCountdownSound = useCallback(async (currentCount) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const audioContext = audioContextRef.current || new AudioContext();
    audioContextRef.current = audioContext;

    try {
      if (audioContext.state === 'suspended') await audioContext.resume();

      const startedAt = audioContext.currentTime;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const urgency = Math.max(0, 4 - currentCount);

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(330 + urgency * 70, startedAt);
      oscillator.frequency.exponentialRampToValueAtTime(220 + urgency * 45, startedAt + 0.16);
      gain.gain.setValueAtTime(0.0001, startedAt);
      gain.gain.exponentialRampToValueAtTime(0.12, startedAt + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, startedAt + 0.2);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(startedAt);
      oscillator.stop(startedAt + 0.21);
    } catch (error) {
      // 브라우저의 자동 재생 차단이 카운트다운 진행을 방해하지 않게 한다.
      console.debug('Countdown sound could not be played.', error);
    }
  }, []);

  useEffect(() => setCount(count), [count])
  const [_count, setCount] = useState(count);    //카운트다운 상태
  const [progress, setProgress] = useState(0);

  const textStyle = {
    fontFamily: "Arial",
    fontSize: 118,
    fontWeight: "900",
    fill: ["#ffffff", "#ffea00", "#ff5a1f"],           //그라데이션 색상
    stroke: "#2a0500",
    strokeThickness: 9,
    dropShadow: true,
    dropShadowColor: "#ff3200",
    dropShadowBlur: 12,
    dropShadowAngle: Math.PI / 2,
    dropShadowDistance: 0,
    align: "center",
  };

  const glowStyle = {
    ...textStyle,
    fill: "#ff7a00",
    stroke: "#fff1a8",
    strokeThickness: 4,
    dropShadow: false,
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const impactProgress = clamp(progress / 0.22, 0, 1);
  const settleProgress = clamp((progress - 0.22) / 0.38, 0, 1);
  const exitProgress = clamp((progress - 0.82) / 0.18, 0, 1);
  const bounce = Math.sin(settleProgress * Math.PI * 4) * (1 - settleProgress) * 0.12;
  const textScale = (0.28 + impactProgress * 1.22) - settleProgress * 0.42 + bounce - exitProgress * 0.24;
  const glowScale = 0.35 + progress * 2.2;
  const echoScale = 1 + progress * 0.95;
  const textAlpha = exitProgress > 0 ? 1 - exitProgress * 0.78 : impactProgress;

  //카운트다운 
  useEffect(() => {
    if (_count === 0) { endCountCallback(); return; }
    const timeout = setTimeout(() => {                //초마다 countdown 내리기
      setCount((prev) => {
        if (prev > 1) return prev - 1;
        return 0;
      });
    }, 1000);
    return () => clearTimeout(timeout);               // 컴포넌트 언마운트 시 정리
  }, [_count, endCountCallback]);

  useEffect(() => {
    if (_count <= 0) return;

    playCountdownSound(_count);

    let animationFrame;
    const startedAt = performance.now();

    const animate = (now) => {
      const nextProgress = Math.min((now - startedAt) / 1000, 1);
      setProgress(nextProgress);

      if (nextProgress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    setProgress(0);
    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [_count, playCountdownSound]);

  useEffect(() => () => {
    audioContextRef.current?.close();
    audioContextRef.current = null;
  }, []);

  if (_count <= 0) return null;

  const countdownText = String(_count);

  return (
    <>
      <Text
        text={countdownText}
        x={x}
        y={y}
        anchor={0.5}
        alpha={Math.max(0, 0.75 - progress * 1.4)}
        rotation={-0.18 + progress * 0.36}
        scale={{ x: glowScale, y: glowScale }}
        style={glowStyle}
      />
      <Text
        text={countdownText}
        x={x}
        y={y - progress * 16}
        anchor={0.5}
        alpha={Math.max(0, 0.5 - progress)}
        scale={{ x: echoScale, y: echoScale }}
        style={textStyle}
      />
      <Text
        text={countdownText}
        x={x}
        y={y + 24 * (1 - impactProgress) - exitProgress * 10}
        anchor={0.5}
        alpha={textAlpha}
        rotation={-0.08 + impactProgress * 0.14 - settleProgress * 0.06}
        scale={{ x: textScale, y: textScale }}
        style={textStyle}
      />
    </>
  )
}

export default Countdown
