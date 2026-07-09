import { useCallback, useEffect, useRef, useState } from 'react'

const melody = [
  { note: 261.63, beat: 0.5 },
  { note: 329.63, beat: 0.5 },
  { note: 392.0, beat: 0.5 },
  { note: 523.25, beat: 0.5 },
  { note: 493.88, beat: 0.5 },
  { note: 392.0, beat: 0.5 },
  { note: 329.63, beat: 0.5 },
  { note: 392.0, beat: 0.5 },
]

const beatSeconds = 0.28
const loopMs = melody.reduce((total, { beat }) => total + beat * beatSeconds * 1000, 0)

const createGain = (audioContext, destination, value) => {
  const gain = audioContext.createGain()
  gain.gain.value = value
  gain.connect(destination)
  return gain
}

const useBattleBgm = () => {
  const audioContextRef = useRef(null)
  const masterGainRef = useRef(null)
  const loopTimerRef = useRef(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const getAudioContext = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current

    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return null

    const audioContext = new AudioContext()
    const masterGain = createGain(audioContext, audioContext.destination, isMuted ? 0 : 0.12)
    audioContextRef.current = audioContext
    masterGainRef.current = masterGain
    return audioContext
  }, [isMuted])

  const playMelody = useCallback(() => {
    const audioContext = audioContextRef.current
    const masterGain = masterGainRef.current
    if (!audioContext || !masterGain) return

    let currentTime = audioContext.currentTime + 0.02

    melody.forEach(({ note, beat }, index) => {
      const oscillator = audioContext.createOscillator()
      const noteGain = createGain(audioContext, masterGain, 0.001)
      const startTime = currentTime
      const endTime = currentTime + beat * beatSeconds

      oscillator.type = index % 2 === 0 ? 'triangle' : 'sine'
      oscillator.frequency.value = note
      noteGain.gain.setValueAtTime(0.001, startTime)
      noteGain.gain.linearRampToValueAtTime(0.22, startTime + 0.03)
      noteGain.gain.exponentialRampToValueAtTime(0.001, endTime)
      oscillator.connect(noteGain)
      oscillator.start(startTime)
      oscillator.stop(endTime + 0.02)

      currentTime = endTime
    })
  }, [])

  const stop = useCallback(() => {
    if (loopTimerRef.current) {
      clearInterval(loopTimerRef.current)
      loopTimerRef.current = null
    }
    setIsPlaying(false)
  }, [])

  const start = useCallback(async () => {
    const audioContext = getAudioContext()
    if (!audioContext || loopTimerRef.current) return

    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }

    playMelody()
    loopTimerRef.current = setInterval(playMelody, loopMs)
    setIsPlaying(true)
  }, [getAudioContext, playMelody])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev
      if (masterGainRef.current) {
        masterGainRef.current.gain.value = next ? 0 : 0.12
      }
      return next
    })
  }, [])

  useEffect(() => {
    return () => {
      stop()
      audioContextRef.current?.close()
    }
  }, [stop])

  return { isMuted, isPlaying, start, stop, toggleMute }
}

export default useBattleBgm
