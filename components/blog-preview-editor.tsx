"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Copy, FileText, ImageIcon, Link } from "lucide-react"

export function BlogPreviewEditor({ blogContent }) {
  const [content, setContent] = useState(blogContent || "")

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    // Show toast notification
  }

  const handleDownload = (format) => {
    // Logic to download in different formats
    console.log(`Downloading in ${format} format`)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Blog Post</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDownload("markdown")}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <Tabs defaultValue="preview">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="min-h-[500px]">
          <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <div className="text-center p-12 text-muted-foreground">Your blog post preview will appear here</div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="edit" className="min-h-[500px]">
          <textarea
            className="w-full h-[500px] p-4 border rounded-md bg-background"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-between mt-4">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Format
              </Button>
              <Button variant="outline" size="sm">
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Image
              </Button>
              <Button variant="outline" size="sm">
                <Link className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>
            <Button>Save Changes</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

