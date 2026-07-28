import { useCallback, useEffect, useRef, useState } from 'react'
import battleBgm from '../../../assets/audio/bgm/battle_bgm_aachronist.mp3'
const BGM_VOLUME = 0.2

const useBattleBgm = () => {
  const audioRef = useRef(null)
  const isMutedRef = useRef(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(battleBgm)

      audio.loop = true
      audio.volume = BGM_VOLUME
      audio.preload = 'auto'
      audio.muted = isMutedRef.current
      audioRef.current = audio
    }

    return audioRef.current
  }, [])

  const start = useCallback(async () => {
    const audio = getAudio()

    if (!audio.paused) return

    audio.muted = isMutedRef.current
    await audio.play()
    setIsPlaying(true)
  }, [getAudio])

  const stop = useCallback(() => {
    const audio = audioRef.current

    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }

    setIsPlaying(false)
  }, [])

  const toggleMute = useCallback(() => {
    const nextMuted = !isMutedRef.current

    isMutedRef.current = nextMuted
    setIsMuted(nextMuted)
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  useEffect(() => {
    return () => {
      const audio = audioRef.current

      if (audio) {
        audio.pause()
        audio.src = ''
        audioRef.current = null
      }
    }
  }, [])

  return { isMuted, isPlaying, start, stop, toggleMute }
}

export default useBattleBgm
