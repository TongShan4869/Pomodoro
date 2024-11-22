import { useState, useRef, useEffect } from 'react'
import YouTube from 'react-youtube'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface YouTubePlaylistProps {
  playlistId: string
  setPlaylistId: (id: string) => void
  isActive: boolean
}

export default function YouTubePlaylist({ playlistId, setPlaylistId, isActive }: YouTubePlaylistProps) {
  const [videoLinks, setVideoLinks] = useState<string[]>([])
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const playerRef = useRef<any>(null)

  const handlePlaylistIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistId(e.target.value)
  }

  const handleVideoLinkChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const links = e.target.value.split('\n').filter(link => link.trim() !== '')
    setVideoLinks(links.slice(0, 20))
  }

  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoLinks.length)
  }

  const handlePreviousVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + videoLinks.length) % videoLinks.length)
  }

  useEffect(() => {
    if (playerRef.current) {
      if (isActive) {
        playerRef.current.playVideo()
      } else {
        playerRef.current.pauseVideo()
      }
    }
  }, [isActive])

  const onReady = (event: any) => {
    playerRef.current = event.target
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="youtube">
        <AccordionTrigger>YouTube Videos</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="playlistId">YouTube Playlist ID (optional)</Label>
              <Input
                type="text"
                id="playlistId"
                value={playlistId}
                onChange={handlePlaylistIdChange}
                placeholder="Enter playlist ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoLinks">YouTube Video Links (one per line, max 20)</Label>
              <Textarea
                id="videoLinks"
                rows={5}
                value={videoLinks.join('\n')}
                onChange={handleVideoLinkChange}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            {videoLinks.length > 0 && (
              <div className="space-y-4">
                <YouTube
                  videoId={getVideoId(videoLinks[currentVideoIndex]) || ''}
                  opts={{
                    height: '200',
                    width: '100%',
                    playerVars: {
                      autoplay: 0,
                    },
                  }}
                  onReady={onReady}
                />
                <div className="flex justify-center space-x-2">
                  <Button onClick={handlePreviousVideo} variant="outline">
                    Previous
                  </Button>
                  <Button onClick={handleNextVideo} variant="outline">
                    Next
                  </Button>
                </div>
              </div>
            )}
            {playlistId && (
              <YouTube
                videoId=""
                opts={{
                  height: '200',
                  width: '100%',
                  playerVars: {
                    listType: 'playlist',
                    list: playlistId,
                    autoplay: 0,
                  },
                }}
                onReady={onReady}
              />
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

