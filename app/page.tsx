'use client'

import { useState } from 'react'
import Timer from '@/components/Timer'
import MusicPlayer from '@/components/MusicPlayer'
import Settings from '@/components/Settings'
import YouTubePlaylist from '@/components/YouTubePlaylist'

export default function PomodoroApp() {
  const [studyTime, setStudyTime] = useState(25 * 60)
  const [breakTime, setBreakTime] = useState(5 * 60)
  const [isStudying, setIsStudying] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const [uploadedMusic, setUploadedMusic] = useState<string[]>([])
  const [youtubePlaylistId, setYoutubePlaylistId] = useState('')
  const [cycles, setCycles] = useState(1)
  const [currentCycle, setCurrentCycle] = useState(1)

  const toggleTimer = () => setIsActive(!isActive)

  const resetTimer = () => {
    setIsActive(false)
    setIsStudying(true)
    setCurrentCycle(1)
  }

  const switchMode = () => {
    if (isStudying) {
      setIsStudying(false)
    } else {
      if (currentCycle < cycles) {
        setCurrentCycle(currentCycle + 1)
        setIsStudying(true)
      } else {
        resetTimer()
      }
    }
    setIsActive(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-center">Pomodoro</h1>
        <Timer
          studyTime={studyTime}
          breakTime={breakTime}
          isStudying={isStudying}
          isActive={isActive}
          toggleTimer={toggleTimer}
          resetTimer={resetTimer}
          switchMode={switchMode}
          currentCycle={currentCycle}
          totalCycles={cycles}
        />
        <MusicPlayer
          isStudying={isStudying}
          isActive={isActive}
          uploadedMusic={uploadedMusic}
        />
        <Settings
          studyTime={studyTime}
          breakTime={breakTime}
          setStudyTime={setStudyTime}
          setBreakTime={setBreakTime}
          setUploadedMusic={setUploadedMusic}
          cycles={cycles}
          setCycles={setCycles}
        />
        <YouTubePlaylist
          playlistId={youtubePlaylistId}
          setPlaylistId={setYoutubePlaylistId}
          isActive={isActive}
        />
      </div>
    </div>
  )
}

