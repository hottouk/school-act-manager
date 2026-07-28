import { act, renderHook } from '@testing-library/react'
import useBattleBgm from './useBattleBgm'

class AudioMock {
  constructor(src) {
    this.src = src
    this.loop = false
    this.volume = 1
    this.preload = ''
    this.muted = false
    this.paused = true
    this.currentTime = 0
    this.play = jest.fn(async () => {
      this.paused = false
    })
    this.pause = jest.fn(() => {
      this.paused = true
    })
  }
}

describe('useBattleBgm', () => {
  const OriginalAudio = global.Audio
  let audio

  beforeEach(() => {
    global.Audio = jest.fn((src) => {
      audio = new AudioMock(src)
      return audio
    })
  })

  afterEach(() => {
    global.Audio = OriginalAudio
    jest.restoreAllMocks()
  })

  test('재생 중 음소거를 켜고 끈다', async () => {
    const { result } = renderHook(() => useBattleBgm())

    await act(async () => {
      await result.current.start()
    })

    act(() => {
      result.current.toggleMute()
    })

    expect(result.current.isMuted).toBe(true)
    expect(audio.muted).toBe(true)

    act(() => {
      result.current.toggleMute()
    })

    expect(result.current.isMuted).toBe(false)
    expect(audio.muted).toBe(false)
  })

  test('재생 직전에 선택한 음소거 상태를 새 오디오에 적용한다', async () => {
    const { result } = renderHook(() => useBattleBgm())

    act(() => {
      result.current.toggleMute()
    })

    await act(async () => {
      await result.current.start()
    })

    expect(result.current.isMuted).toBe(true)
    expect(audio.muted).toBe(true)
    expect(audio.play).toHaveBeenCalledTimes(1)
  })
})
