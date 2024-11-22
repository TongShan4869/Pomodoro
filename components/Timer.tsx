import { useState, useEffect } from 'react'
import useSound from 'use-sound'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface TimerProps {
  studyTime: number
  breakTime: number
  isStudying: boolean
  isActive: boolean
  toggleTimer: () => void
  resetTimer: () => void
  switchMode: () => void
  currentCycle: number
  totalCycles: number
}

export default function Timer({
  studyTime,
  breakTime,
  isStudying,
  isActive,
  toggleTimer,
  resetTimer,
  switchMode,
  currentCycle,
  totalCycles,
}: TimerProps) {
  const [time, setTime] = useState(studyTime)
  const [playDing] = useSound('/sounds/ding.mp3')

  useEffect(() => {
    setTime(isStudying ? studyTime : breakTime)
  }, [studyTime, breakTime, isStudying])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 4) {
            playDing()
          }
          if (prevTime === 1) {
            switchMode()
            return isStudying ? breakTime : studyTime
          }
          return prevTime - 1
        })
      }, 1000)
    } else {
      if (interval) clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, time, switchMode, playDing, breakTime, studyTime, isStudying])

  const handleReset = () => {
    resetTimer();
    setTime(isStudying ? studyTime : breakTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = isStudying
    ? ((studyTime - time) / studyTime) * 100
    : ((breakTime - time) / breakTime) * 100

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">{isStudying ? 'Focus' : 'Break'}</h2>
          <div className="text-5xl font-bold">{formatTime(time)}</div>
          <Progress value={progress} className="w-full" />
          <div className="text-sm text-muted-foreground">
            Cycle: {currentCycle} / {totalCycles}
          </div>
          <div className="flex justify-center space-x-2">
            <Button onClick={toggleTimer} variant="default">
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={handleReset} variant="secondary">
              Reset
            </Button>
            <Button onClick={switchMode} variant="outline">
              Switch
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

