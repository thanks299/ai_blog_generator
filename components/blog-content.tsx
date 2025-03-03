"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlogExport } from "@/components/blog-export"
import { Button } from "@/components/ui/button"
import { ImageIcon, Link, Heading, ListOrdered, Bold, Italic } from "lucide-react"
import ReactMarkdown from "react-markdown"

// Mock data - in a real app, this would come from your backend
const mockBlogPost = {
  title: "How to Build a Next.js Application with AI Integration",
  content: `# How to Build a Next.js Application with AI Integration...`, // Your existing content
  seoMetadata: {
    title: "Integrating AI with Next.js: A Complete Guide",
    description:
      "Learn how to build Next.js applications with AI capabilities using the Vercel AI SDK. Step-by-step tutorial with code examples.",
    keywords: ["Next.js", "AI", "Vercel AI SDK", "React", "Web Development"],
  },
}

export default function BlogContent() {
  const [content, setContent] = useState(mockBlogPost.content)
  const [activeTab, setActiveTab] = useState("preview")

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-xl font-bold">Your Blog Post</h2>
        <BlogExport blogContent={content} title={mockBlogPost.title} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview" className="transition-all duration-200">
            Preview
          </TabsTrigger>
          <TabsTrigger value="edit" className="transition-all duration-200">
            Edit
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="min-h-[600px] rounded-lg border bg-card p-4 sm:p-6 animate-fade-in">
          <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <div className="text-center p-12 text-muted-foreground">Your blog post preview will appear here</div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="edit" className="min-h-[600px] rounded-lg border bg-card p-4 sm:p-6 animate-fade-in">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <Heading className="h-4 w-4 mr-2" />
              Heading
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <Bold className="h-4 w-4 mr-2" />
              Bold
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <Italic className="h-4 w-4 mr-2" />
              Italic
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <ListOrdered className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <ImageIcon className="h-4 w-4 mr-2" />
              Image
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <Link className="h-4 w-4 mr-2" />
              Link
            </Button>
          </div>
          <textarea
            className="w-full h-[500px] p-4 border rounded-md bg-background resize-none font-mono text-sm transition-all duration-200 focus:scale-[1.01]"
            value={content}
            onChange={handleEditorChange}
          />
        </TabsContent>
      </Tabs>

      <div className="rounded-lg border bg-card p-4 animate-fade-in [animation-delay:200ms]">
        <h3 className="text-sm font-medium mb-2">SEO Metadata</h3>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Title</p>
            <p className="text-sm">{mockBlogPost.seoMetadata.title}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Description</p>
            <p className="text-sm">{mockBlogPost.seoMetadata.description}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Keywords</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {mockBlogPost.seoMetadata.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="text-xs bg-muted px-2 py-1 rounded-full transition-all duration-200 hover:bg-muted/80"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

