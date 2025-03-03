"use server"

import { revalidatePath } from "next/cache"

export async function processVideo(formData: {
  videoUrl: string
  tone: string
  wordCount: number
  audience: string
}) {
  try {
    // 1. Call the transcribe API
    const transcribeResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/transcribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoUrl: formData.videoUrl }),
    })

    const transcribeData = await transcribeResponse.json()

    if (!transcribeResponse.ok || !transcribeData.success) {
      throw new Error(transcribeData.error || "Failed to transcribe video")
    }

    const { transcript, metadata, videoId } = transcribeData

    // 2. Call the generate-blog API
    const generateResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/generate-blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcript,
        metadata,
        options: {
          tone: formData.tone,
          wordCount: formData.wordCount,
          audience: formData.audience,
        },
      }),
    })

    const generateData = await generateResponse.json()

    if (!generateResponse.ok || !generateData.success) {
      // Check for specific error types
      if (generateResponse.status === 503) {
        throw new Error("AI service is temporarily unavailable. Please try again later.")
      }
      throw new Error(generateData.error || "Failed to generate blog post")
    }

    const { blogPost, seoMetadata } = generateData

    // 3. Revalidate the page
    revalidatePath("/")

    return {
      success: true,
      videoId,
      blogPost,
      seoMetadata,
      metadata,
    }
  } catch (error) {
    console.error("Error processing video:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred while processing your video",
    }
  }
}

