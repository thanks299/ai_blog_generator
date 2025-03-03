"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { processVideo } from "@/app/actions"
import { VideoPreview } from "@/components/video-preview"
import { toast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  videoUrl: z.string().url("Please enter a valid YouTube URL"),
  tone: z.string().min(1, "Please select a tone"),
  wordCount: z.number().min(300).max(2000),
  audience: z.string().min(1, "Please select a target audience"),
})

export default function VideoToBlogForm() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [videoId, setVideoId] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: "",
      tone: "professional",
      wordCount: 800,
      audience: "general",
    },
  })

  const onUrlChange = (url: string) => {
    const id = extractVideoId(url)
    setVideoId(id)
  }

  function extractVideoId(url: string): string | null {
    if (!url) return null

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsProcessing(true)

      toast({
        title: "Processing video",
        description: "This may take a minute or two depending on the video length",
      })

      const result = await processVideo(values)

      if (!result.success) {
        // Check for specific error messages and provide appropriate user feedback
        const errorMessage = result.error?.toLowerCase() || ""

        if (errorMessage.includes("quota") || errorMessage.includes("unavailable")) {
          toast({
            title: "Service Unavailable",
            description: "Our AI service is temporarily unavailable. Please try again later or contact support.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to process video",
            variant: "destructive",
          })
        }
        return
      }

      toast({
        title: "Success",
        description: "Your blog post has been successfully created",
      })

      router.refresh()
    } catch (error) {
      console.error("Error processing video:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <VideoPreview videoId={videoId} isLoading={isProcessing} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>YouTube URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      onUrlChange(e.target.value)
                    }}
                    className="transition-all duration-200 focus:scale-[1.01]"
                  />
                </FormControl>
                <FormDescription className="text-xs sm:text-sm">
                  Enter the URL of the YouTube video you want to convert
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Writing Tone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="transition-all duration-200 focus:scale-[1.01]">
                        <SelectValue placeholder="Select a tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs sm:text-sm">Choose the writing style</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="transition-all duration-200 focus:scale-[1.01]">
                        <SelectValue placeholder="Select an audience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs sm:text-sm">Select your target readers</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="wordCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Word Count: {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={300}
                    max={2000}
                    step={100}
                    defaultValue={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="py-4"
                  />
                </FormControl>
                <FormDescription className="text-xs sm:text-sm">
                  Set the approximate length of your blog post
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full transition-all duration-200 hover:scale-[1.01]"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Video
              </>
            ) : (
              "Generate Blog Post"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

