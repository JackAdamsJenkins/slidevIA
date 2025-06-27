import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { ChevronLeft, ChevronRight, Copy, Download, Eye, Maximize } from 'lucide-react'
import { useState } from 'react'
import SlideDisplay from './SlideDisplay.jsx'

const SlideViewer = ({ slides, title }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  if (!slides || slides.length === 0) {
    return null
  }

  const nextSlide = () => {
    if (currentSlide < slides.length - 1 && !isAnimating) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1)
        setIsAnimating(false)
      }, 150)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0 && !isAnimating) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentSlide(currentSlide - 1)
        setIsAnimating(false)
      }, 150)
    }
  }

  const goToSlide = (index) => {
    if (index !== currentSlide && !isAnimating) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentSlide(index)
        setIsAnimating(false)
      }, 150)
    }
  }

  const generateSlidevCode = () => {
    let slidevContent = `---
theme: default
background: https://source.unsplash.com/1920x1080/?technology
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## ${title || 'Présentation générée avec Gemini'}
  
  Présentation créée automatiquement avec l'IA Gemini
drawings:
  persist: false
transition: slide-left
title: ${title || 'Présentation'}
---

# ${title || 'Présentation'}

Créé avec l'IA Gemini

---

`

    slides.forEach((slide) => {
      slidevContent += `# ${slide.title}

${slide.content}

---

`
    })

    return slidevContent
  }

  const copyToClipboard = () => {
    const slidevCode = generateSlidevCode()
    navigator.clipboard.writeText(slidevCode)
  }

  const downloadSlidev = () => {
    const slidevCode = generateSlidevCode()
    const blob = new Blob([slidevCode], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'presentation.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }



  return (
    <Card className="w-full shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Eye className="h-6 w-6" />
              Aperçu de la présentation
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Slide {currentSlide + 1} sur {slides.length} • Format 1920x1080
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <Copy className="h-4 w-4" />
              Copier Slidev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadSlidev}
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <Download className="h-4 w-4" />
              Télécharger
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <Maximize className="h-4 w-4" />
              Plein écran
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Slide Display - Format 1920x1080 */}
        <div className="relative w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden shadow-2xl">
          {/* Aspect ratio 16:9 (1920x1080) */}
          <div className="aspect-video relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
              <div className="absolute top-8 right-8 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-8 left-8 w-24 h-24 bg-blue-500/10 rounded-full blur-lg animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
            </div>
            
            {/* Slide content */}
            <div className={`relative z-10 h-full flex flex-col justify-center px-16 py-12 transition-all duration-300`}>
              <SlideDisplay title={slides[currentSlide]?.title} content={slides[currentSlide]?.content || ''} />
            </div>
            
            {/* Navigation arrows */}
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all duration-200 ${
                currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100 hover:scale-110'
              }`}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all duration-200 ${
                currentSlide === slides.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100 hover:scale-110'
              }`}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Slide number indicator */}
            <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white font-medium">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>
        </div>
        
        {/* Navigation controls */}
        <div className="flex justify-between items-center p-6 bg-gray-50/80 backdrop-blur-sm">
          <Button 
            variant="outline" 
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>
          
          {/* Slide indicators */}
          <div className="flex space-x-2 max-w-md overflow-x-auto">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-blue-600 scale-125 shadow-lg' 
                    : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                }`}
                aria-label={`Aller à la slide ${index + 1}`}
              />
            ))}
          </div>
          
          <Button 
            variant="outline" 
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2 hover:bg-gray-100 disabled:opacity-50"
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default SlideViewer

