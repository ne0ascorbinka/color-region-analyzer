"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type Phase = "upload" | "processing" | "result"

interface ProcessingStep {
  label: string
  duration: number
}

interface Results {
  redArea: number
  blueArea: number
  redPerimeter: number
  bluePerimeter: number
}

const processingSteps: ProcessingStep[] = [
  { label: "Segmenting image...", duration: 1500 },
  { label: "Detecting red and blue regions...", duration: 2000 },
  { label: "Calculating area and perimeter...", duration: 1500 },
  { label: "Preparing result...", duration: 1000 },
]

export default function ImageProcessor() {
  const [phase, setPhase] = useState<Phase>("upload")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [results, setResults] = useState<Results | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      simulateUpload(file)
    }
  }

  const simulateUpload = async (file: File) => {
    setPhase("upload")
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          startProcessing()
          return 100
        }
        return prev + 10
      })
    }, 100)
  }

  const startProcessing = async () => {
    setPhase("processing")
    setCurrentStep(0)

    // Simulate processing steps
    for (let i = 0; i < processingSteps.length; i++) {
      setCurrentStep(i)
      await new Promise((resolve) => setTimeout(resolve, processingSteps[i].duration))
    }

    // Simulate results (in real app, this would come from backend)
    setResults({
      redArea: 5321,
      blueArea: 4872,
      redPerimeter: 610,
      bluePerimeter: 580,
    })
    setPhase("result")
  }

  const handleReset = () => {
    setPhase("upload")
    setUploadProgress(0)
    setCurrentStep(0)
    setSelectedFile(null)
    setPreviewUrl(null)
    setResults(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      simulateUpload(file)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">AI Image Processing Lab</h1>
          <p className="text-muted-foreground text-pretty">Detect and measure red and blue regions in your images</p>
        </div>

        <Card className="p-8">
          {phase === "upload" && (
            <div className="space-y-6">
              <div
                className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">{selectedFile ? selectedFile.name : "Drop your image here"}</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <p className="text-xs text-muted-foreground">Supports JPG and PNG files</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploading...</span>
                    <span className="font-medium">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>
          )}

          {phase === "processing" && (
            <div className="space-y-6">
              {previewUrl && (
                <div className="flex justify-center mb-6">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Uploaded image"
                    className="max-w-full max-h-64 rounded-lg border border-border object-contain"
                  />
                </div>
              )}
              <div className="flex items-center justify-center mb-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">{processingSteps[currentStep].label}</p>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {processingSteps.length}
                </p>
              </div>
              <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary animate-shimmer" />
              </div>
            </div>
          )}

          {phase === "result" && results && (
            <div className="space-y-6">
              {previewUrl && (
                <div className="flex justify-center mb-6">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Analyzed image"
                    className="max-w-full max-h-64 rounded-lg border border-border object-contain"
                  />
                </div>
              )}
              <div className="flex items-center justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Analysis Complete</h2>
                <p className="text-muted-foreground">Results for your image</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                  <h3 className="text-lg font-semibold mb-4 text-red-700 dark:text-red-400">Red Regions</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Area</p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {results.redArea.toLocaleString()} px²
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Perimeter</p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {results.redPerimeter.toLocaleString()} px
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                  <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-400">Blue Regions</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Area</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {results.blueArea.toLocaleString()} px²
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Perimeter</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {results.bluePerimeter.toLocaleString()} px
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <Button onClick={handleReset} className="w-full" size="lg">
                Try Another Image
              </Button>
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}
