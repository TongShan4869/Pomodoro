import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface SettingsProps {
  studyTime: number
  breakTime: number
  setStudyTime: (time: number) => void
  setBreakTime: (time: number) => void
  setUploadedMusic: (music: string[]) => void
  cycles: number
  setCycles: (cycles: number) => void
}

export default function Settings({
  studyTime,
  breakTime,
  setStudyTime,
  setBreakTime,
  setUploadedMusic,
  cycles,
  setCycles,
}: SettingsProps) {
  const handleStudyTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudyTime(Number(e.target.value) * 60)
  }

  const handleBreakTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBreakTime(Number(e.target.value) * 60)
  }

  const handleCyclesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCycles(Number(e.target.value))
  }

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 10) {
      alert('You can only upload up to 10 music files.')
      return
    }
    const musicUrls = files.map((file) => URL.createObjectURL(file))
    setUploadedMusic(musicUrls)
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="settings">
        <AccordionTrigger>Settings</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studyTime">Study Time (minutes)</Label>
              <Input
                type="number"
                id="studyTime"
                value={studyTime / 60}
                onChange={handleStudyTimeChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breakTime">Break Time (minutes)</Label>
              <Input
                type="number"
                id="breakTime"
                value={breakTime / 60}
                onChange={handleBreakTimeChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cycles">Number of Cycles</Label>
              <Input
                type="number"
                id="cycles"
                value={cycles}
                onChange={handleCyclesChange}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="musicUpload">Upload Music (max 10 files)</Label>
              <Input
                type="file"
                id="musicUpload"
                accept="audio/*"
                multiple
                onChange={handleMusicUpload}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

