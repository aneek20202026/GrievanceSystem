import { useState, useEffect } from 'react'

const images = [
  {
    url: "/placeholder.svg?height=400&width=800",
    caption: "We're here to listen and help resolve your concerns.",
  },
  {
    url: "/placeholder.svg?height=400&width=800",
    caption: "Your voice matters. Let us know how we can improve.",
  },
  {
    url: "/placeholder.svg?height=400&width=800",
    caption: "Transparent and fair grievance resolution process.",
  },
]

function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-[400px] overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image.url || "/placeholder.svg"}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
            <p className="text-xl">{image.caption}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Slider

