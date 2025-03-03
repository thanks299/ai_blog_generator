import { NextResponse } from "next/server"
import { YoutubeTranscript } from "youtube-transcript"
import { google } from "googleapis"

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json()

    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid YouTube URL. Please provide a valid YouTube video URL.",
        },
        { status: 400 },
      )
    }

    try {
      // Fetch transcript and metadata concurrently
      const [transcript, metadata] = await Promise.all([
        fetchTranscriptWithFallback(videoId),
        fetchVideoMetadataWithFallback(videoId),
      ])

      if (!transcript) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Could not get video transcript. Please try a video with captions enabled or provide a transcript manually.",
          },
          { status: 400 },
        )
      }

      return NextResponse.json({
        success: true,
        videoId,
        transcript,
        metadata,
      })
    } catch (error) {
      console.error("Error fetching video data:", error)
      throw error
    }
  } catch (error) {
    console.error("Error in /api/transcribe:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process video",
      },
      { status: 500 },
    )
  }
}

// Helper function to extract YouTube video ID from URL
function extractVideoId(url: string): string | null {
  try {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^?&/#]+)/,
      /^[a-zA-Z0-9_-]{11}$/, // Direct video ID
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  } catch (error) {
    console.error("Error extracting video ID:", error)
    return null
  }
}

// Fetch transcript with fallback options
async function fetchTranscriptWithFallback(videoId: string): Promise<string | null> {
  try {
    // Try official YouTube transcript API first
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en", // Prefer English captions
    })

    return transcriptItems
      .map((item) => item.text.trim())
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
  } catch (transcriptError) {
    console.error("Error fetching transcript:", transcriptError)

    try {
      // Fallback: Try to get auto-generated captions if available
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${process.env.YOUTUBE_API_KEY}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch captions")
      }

      const data = await response.json()

      if (data.items && data.items.length > 0) {
        // Get the first available caption track
        const captionTrack = data.items[0]

        // Fetch the actual caption content
        const captionResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/captions/${captionTrack.id}?key=${process.env.YOUTUBE_API_KEY}`,
        )

        if (!captionResponse.ok) {
          throw new Error("Failed to fetch caption content")
        }

        const captionData = await captionResponse.json()
        return captionData.text || null
      }
    } catch (captionError) {
      console.error("Error fetching captions:", captionError)
    }

    // If all attempts fail, return null
    return null
  }
}

// Fetch video metadata with fallback
async function fetchVideoMetadataWithFallback(videoId: string) {
  try {
    // Try official YouTube API first
    const response = await youtube.videos.list({
      part: ["snippet"],
      id: [videoId],
    })

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error("Video not found")
    }

    const { title, description, thumbnails, channelTitle, publishedAt } = response.data.items[0].snippet!

    return {
      title,
      description,
      thumbnails,
      channelTitle,
      publishedAt,
    }
  } catch (apiError) {
    console.error("Error fetching video metadata:", apiError)

    try {
      // Fallback: Try to scrape basic metadata from oEmbed endpoint
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      const response = await fetch(oembedUrl)

      if (!response.ok) {
        throw new Error("Failed to fetch oEmbed data")
      }

      const data = await response.json()

      return {
        title: data.title || "Untitled Video",
        description: "Description not available",
        thumbnails: {
          default: {
            url: data.thumbnail_url || `/placeholder.svg?height=90&width=120`,
            width: 120,
            height: 90,
          },
        },
        channelTitle: data.author_name || "Unknown Channel",
        publishedAt: new Date().toISOString(),
      }
    } catch (oembedError) {
      console.error("Error fetching oEmbed data:", oembedError)

      // Return minimal metadata if all attempts fail
      return {
        title: "Video Title Unavailable",
        description: "Description not available",
        thumbnails: {
          default: {
            url: `/placeholder.svg?height=90&width=120`,
            width: 120,
            height: 90,
          },
        },
        channelTitle: "Unknown Channel",
        publishedAt: new Date().toISOString(),
      }
    }
  }
}

