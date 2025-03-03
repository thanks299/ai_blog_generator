"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

interface VideoPreviewProps {
  videoId: string | null
  isLoading?: boolean
}

export function VideoPreview({ videoId, isLoading = false }: VideoPreviewProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (videoId) {
      setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)
    } else {
      setThumbnailUrl(null)
    }
  }, [videoId])

  if (isLoading) {
    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden animate-pulse">
        <Skeleton className="w-full h-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full aspect-video rounded-lg bg-muted flex items-center justify-center animate-fade-in">
        <p className="text-muted-foreground text-sm sm:text-base">{error}</p>
      </div>
    )
  }

  if (!thumbnailUrl) {
    return (
      <div className="w-full aspect-video rounded-lg bg-muted flex items-center justify-center animate-fade-in">
        <p className="text-muted-foreground text-sm sm:text-base px-4 text-center">Enter a YouTube URL to preview</p>
      </div>
    )
  }

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden relative group animate-fade-in">
      <Image
        src={thumbnailUrl || "/placeholder.svg"}
        alt="Video thumbnail"
        fill
        className="object-cover transition-transform duration-200 group-hover:scale-105"
        onError={() => setError("Failed to load thumbnail")}
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 group-hover:bg-black/60">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-600 flex items-center justify-center transform transition-transform duration-200 group-hover:scale-110">
          <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-white border-b-8 border-b-transparent ml-1"></div>
        </div>
      </div>
    </div>
  )
}

