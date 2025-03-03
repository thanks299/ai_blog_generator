import { Suspense } from "react"
import VideoToBlogForm from "@/components/video-to-blog-form"
import BlogContent from "@/components/blog-content"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased animate-fade-in">
      <div className="container mx-auto py-6 px-4 sm:py-10 lg:py-16">
        <div className="flex flex-col items-center space-y-4 text-center mb-8 sm:mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl animate-slide-in">
            Video to Blog Converter
          </h1>
          <p className="text-muted-foreground max-w-[700px] text-sm sm:text-base animate-slide-in [animation-delay:100ms]">
            Transform YouTube videos into well-structured, SEO-optimized blog posts with AI. Just paste a YouTube URL,
            customize your preferences, and get a ready-to-publish blog post.
          </p>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-4 animate-slide-in [animation-delay:200ms]">
            <div className="rounded-lg border bg-card p-4 sm:p-6">
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <VideoToBlogForm />
              </Suspense>
            </div>
          </div>

          <div className="space-y-4 animate-slide-in [animation-delay:300ms]">
            <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
              <BlogContent />
            </Suspense>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  )
}

