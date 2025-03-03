"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Share, Copy } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface BlogExportProps {
  blogContent: string
  title: string
}

export function BlogExport({ blogContent, title }: BlogExportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(blogContent)
      toast({
        title: "Copied to clipboard",
        description: "Blog content has been copied to your clipboard",
      })
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy content to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleDownload = (format: string) => {
    setIsExporting(true)

    try {
      let content = blogContent
      let mimeType = "text/plain"
      let fileExtension = "txt"

      if (format === "html") {
        content = convertMarkdownToHtml(content)
        mimeType = "text/html"
        fileExtension = "html"
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${sanitizeFileName(title)}.${fileExtension}`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: `Exported as ${format.toUpperCase()}`,
        description: `Blog post has been downloaded as ${fileExtension} file`,
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export blog post",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const sanitizeFileName = (name: string): string => {
    return name
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase()
  }

  const convertMarkdownToHtml = (markdown: string): string => {
    let html = markdown
    html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>")
    html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>")
    html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>")
    html = html.replace(/^(?!<h[1-6]>)(.*$)/gm, "<p>$1</p>")
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")

    return `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: system-ui, sans-serif; 
      line-height: 1.6; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 20px;
    }
    h1, h2, h3 { margin-top: 1.5em; }
    p { margin-bottom: 1em; }
    @media (prefers-color-scheme: dark) {
      body {
        background: #1a1a1a;
        color: #fff;
      }
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={handleCopy} className="transition-all duration-200 hover:scale-105">
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isExporting}
            className="transition-all duration-200 hover:scale-105"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="animate-fade-in">
          <DropdownMenuItem onClick={() => handleDownload("markdown")}>Markdown (.md)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownload("html")}>HTML (.html)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownload("txt")}>Plain Text (.txt)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105">
        <Share className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  )
}

