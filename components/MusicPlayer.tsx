import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface MusicPlayerProps {
  isStudying: boolean
  isActive: boolean
  uploadedMusic: string[]
}

export default function MusicPlayer({ isStudying, isActive, uploadedMusic }: MusicPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      gainNodeRef.current = audioContextRef.current.createGain()
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current)
      sourceNodeRef.current.connect(gainNodeRef.current)
      gainNodeRef.current.connect(audioContextRef.current.destination)
      gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime)
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      if (isStudying && isActive) {
        fadeIn()
      } else {
        fadeOut()
      }
    }
  }, [isStudying, isActive])

  const fadeIn = () => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.cancelScheduledValues(audioContextRef.current.currentTime)
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, audioContextRef.current.currentTime)
      gainNodeRef.current.gain.linearRampToValueAtTime(1, audioContextRef.current.currentTime + 2)
      audioRef.current?.play()
    }
  }

  const fadeOut = () => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.cancelScheduledValues(audioContextRef.current.currentTime)
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, audioContextRef.current.currentTime)
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 2)
      setTimeout(() => {
        audioRef.current?.pause()
      }, 2000)
    }
  }

  const handleEnded = () => {
    setCurrentTrack((prevTrack) => (prevTrack + 1) % uploadedMusic.length)
  }

  return (
    <Card>
      <CardContent>
        <h3 className="text-lg font-semibold mb-4 mt-2">Background Music</h3>
        {uploadedMusic.length > 0 ? (
          <audio
            ref={audioRef}
            src={uploadedMusic[currentTrack]}
            onEnded={handleEnded}
            loop={uploadedMusic.length === 1}
          />
        ) : (
          <p className="text-sm text-muted-foreground">No music uploaded yet.</p>
        )}
      </CardContent>
    </Card>
  )
}

