import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { transcript, metadata, options } = await request.json()

    if (!transcript) {
      return NextResponse.json(
        {
          success: false,
          error: "Transcript is required",
        },
        { status: 400 },
      )
    }

    // Generate blog post using AI
    const blogPost = await generateBlogPost(transcript, metadata, options)

    // Generate SEO metadata
    const seoMetadata = await generateSEOMetadata(blogPost, metadata.title)

    return NextResponse.json({
      success: true,
      blogPost,
      seoMetadata,
    })
  } catch (error) {
    console.error("Error generating blog post:", error)

    // Handle OpenAI quota exceeded error specifically
    if (error instanceof Error && error.message.includes("insufficient_quota")) {
      return NextResponse.json(
        {
          success: false,
          error: "AI service is currently unavailable. Please try again later or contact support.",
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate blog post",
      },
      { status: 500 },
    )
  }
}

async function generateBlogPost(
  transcript: string,
  metadata: any,
  options: {
    tone: string
    wordCount: number
    audience: string
  },
) {
  const { tone, wordCount, audience } = options

  // Truncate transcript if it's too long
  const truncatedTranscript = transcript.length > 10000 ? transcript.substring(0, 10000) + "..." : transcript

  const prompt = `
    Create a well-structured blog post based on the following YouTube video:
    
    Title: "${metadata.title}"
    Description: "${metadata.description}"
    Transcript: "${truncatedTranscript}"
    
    The blog post should:
    - Be written in a ${tone} tone
    - Be approximately ${wordCount} words
    - Target a ${audience} audience
    - Include a compelling title, introduction, and conclusion
    - Have clear headings and subheadings
    - Be SEO-optimized
    - Include key points and insights from the video
    - Include relevant quotes from the transcript where appropriate
    
    Format the blog post in Markdown.
  `

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
    })

    return text
  } catch (error) {
    console.error("Error in generateBlogPost:", error)

    // Check for OpenAI-specific errors
    if (error instanceof Error) {
      if (error.message.includes("insufficient_quota")) {
        throw new Error("OpenAI API quota exceeded. Please check your billing details.")
      }
      if (error.message.includes("rate_limit")) {
        throw new Error("Too many requests. Please try again in a few moments.")
      }
    }

    throw new Error("Failed to generate blog post")
  }
}

// Generate SEO metadata
async function generateSEOMetadata(blogPost: string, videoTitle: string) {
  const prompt = `
    Based on the following blog post and original video title, generate SEO metadata:
    
    Original Video Title: "${videoTitle}"
    
    Blog Post:
    "${blogPost.substring(0, 2000)}..."
    
    Please provide:
    1. An SEO-optimized title (max 60 characters)
    2. A meta description (max 155 characters)
    3. 5-7 relevant keywords or phrases
    
    Format your response as JSON with the following structure:
    {
      "title": "SEO Title",
      "description": "Meta description that entices clicks and summarizes the content.",
      "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
    }
  `

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    // Parse the JSON response
    return JSON.parse(text)
  } catch (error) {
    console.error("Error generating SEO metadata:", error)
    // Return default metadata if generation fails
    return {
      title: videoTitle,
      description: "Blog post generated from YouTube video content",
      keywords: ["blog", "youtube", "content"],
    }
  }
}

