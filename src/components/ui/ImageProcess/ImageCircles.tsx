import type React from "react"
import { useRef, useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

const ImageCircles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isProcessed, setIsProcessed] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const processImage = () => {
    if (!image) return
    setIsProcessing(true)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width
      canvas.height = img.height

      // Draw original image to canvas
      ctx.drawImage(img, 0, 0)

      // Get image data for processing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // Process the image data to create circle effect
      processImageData(imageData, ctx)

      setIsProcessing(false)
      setIsProcessed(true)
    }
    img.src = image
  }

  const processImageData = (imageData: ImageData, ctx: CanvasRenderingContext2D) => {
    const { width, height, data } = imageData
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, width, height)

    const circleSize = 4 // Reduced from 10 to 4
    const spacing = 5 // Reduced from 12 to 5

    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        const i = (y * width + x) * 4
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
        const radius = (brightness / 255) * (circleSize / 2)

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = "white"
        ctx.fill()
      }
    }
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create a temporary link element
    const link = document.createElement("a")
    link.download = "circle-art.png"
    link.href = canvas.toDataURL("image/png")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 max-w-4xl w-full">
      <h1 className="text-2xl font-bold text-white">Image to Circles Converter</h1>

      <div className="flex flex-col items-center gap-4 w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-300" />
            <p className="text-sm text-gray-300">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>

        {image && (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="relative w-full max-h-[300px] overflow-hidden rounded-lg">
              <img src={image || "/placeholder.svg"} alt="Uploaded image" className="w-full object-contain" />
            </div>

            <Button onClick={processImage} disabled={isProcessing} className="px-4 py-2">
              {isProcessing ? "Processing..." : "Convert to Circles"}
            </Button>
          </div>
        )}
      </div>

      <div className="w-full mt-4">
        <canvas ref={canvasRef} className="w-full border border-gray-700 rounded-lg bg-black" />

        {isProcessed && (
          <div className="flex justify-center mt-4">
            <Button onClick={downloadImage} className="px-4 py-2 bg-green-600 hover:bg-green-700">
              Download Image
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageCircles

