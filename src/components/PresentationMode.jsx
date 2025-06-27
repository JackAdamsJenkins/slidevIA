import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    EyeOff,
    Maximize,
    Mic,
    Minimize,
    Pause,
    Play,
    RotateCcw
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import SlideDisplay from './SlideDisplay.jsx'

const PresentationMode = ({ 
  slides, 
  title, 
  isFullscreen, 
  onToggleFullscreen,
  onClose 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showNotes, setShowNotes] = useState(true)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isPresenterMode, setIsPresenterMode] = useState(false)

  // Timer
  useEffect(() => {
    let interval = null
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1)
      }, 1000)
    } else if (!isTimerRunning && timer !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timer])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault()
          nextSlide()
          break
        case 'ArrowLeft':
          event.preventDefault()
          prevSlide()
          break
        case 'Escape':
          if (isFullscreen) {
            onToggleFullscreen()
          } else {
            onClose()
          }
          break
        case 'f':
        case 'F':
          event.preventDefault()
          onToggleFullscreen()
          break
        case 'n':
        case 'N':
          event.preventDefault()
          setShowNotes(!showNotes)
          break
        case 'p':
        case 'P':
          event.preventDefault()
          setIsPresenterMode(!isPresenterMode)
          break
        case 't':
        case 'T':
          event.preventDefault()
          setIsTimerRunning(!isTimerRunning)
          break
        case 'r':
        case 'R':
          event.preventDefault()
          resetTimer()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFullscreen, showNotes, isPresenterMode, isTimerRunning, onToggleFullscreen, onClose])

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }, [currentSlide, slides.length])

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }, [currentSlide])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const resetTimer = () => {
    setTimer(0)
    setIsTimerRunning(false)
  }

  const renderMarkdown = (content) => {
    return content
      .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-bold text-blue-300 mb-4 mt-6">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold text-purple-300 mb-6 mt-8">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold text-white mb-8 mt-10">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-300 font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-purple-300">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-2 py-1 rounded text-green-300 font-mono text-sm">$1</code>')
      .replace(/^\* (.*$)/gm, '<li class="ml-4 mb-2 flex items-start"><span class="text-blue-400 mr-2">•</span><span>$1</span></li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 mb-2 flex items-start"><span class="text-purple-400 mr-2 font-semibold">•</span><span>$1</span></li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:underline" target="_blank">$1</a>')
      .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
      .replace(/\n/g, '<br>')
      .replace(/(<li.*<\/li>)/s, '<ul class="space-y-2 mb-6">$1</ul>')
      .replace(/^(.*)$/, '<p class="mb-4 leading-relaxed">$1</p>')
  }

  const currentSlideData = slides[currentSlide]

  if (isPresenterMode) {
    // Mode présentateur avec deux écrans
    return (
      <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'relative'} bg-gray-900 text-white`}>
        <div className="grid grid-cols-2 h-full">
          {/* Écran de contrôle (gauche) */}
          <div className="bg-gray-800 p-6 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">Mode Présentateur</h2>
                <p className="text-gray-400">Slide {currentSlide + 1} sur {slides.length}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono text-lg">{formatTime(timer)}</span>
                  <Button
                    size="sm"
                    variant={isTimerRunning ? "destructive" : "default"}
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                  >
                    {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetTimer}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsPresenterMode(false)}
                >
                  Quitter
                </Button>
              </div>
            </div>

            {/* Slide actuelle (miniature) */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Slide actuelle</h3>
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 aspect-video border border-gray-600">
                <SlideDisplay title={currentSlideData?.title} content={currentSlideData?.content || ''} />
              </div>
            </div>

            {/* Notes présentateur */}
            {currentSlideData?.speakerNotes && (
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Notes présentateur
                </h3>
                <div className="bg-gray-700 rounded-lg p-4 text-gray-100 leading-relaxed">
                  {currentSlideData.speakerNotes}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
              <Button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>
              
              <div className="flex space-x-1">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide 
                        ? 'bg-blue-500 scale-125' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                variant="outline"
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Écran de présentation (droite) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col justify-center px-16 py-12 relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
              <div className="absolute top-8 right-8 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-8 left-8 w-24 h-24 bg-blue-500/10 rounded-full blur-lg animate-pulse delay-1000"></div>
            </div>
            
            <div className="relative z-10">
              <SlideDisplay title={currentSlideData?.title} content={currentSlideData?.content || ''} className="mx-auto" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mode présentation normale
  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'relative'} bg-gray-900 text-white`}>
      {/* Controls bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-black/50 text-white">
            {currentSlide + 1} / {slides.length}
          </Badge>
          <div className="flex items-center gap-2 bg-black/50 rounded px-3 py-1">
            <Clock className="h-4 w-4" />
            <span className="font-mono">{formatTime(timer)}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              {isTimerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowNotes(!showNotes)}
            className="text-white hover:bg-white/20"
          >
            {showNotes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsPresenterMode(true)}
            className="text-white hover:bg-white/20"
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleFullscreen}
            className="text-white hover:bg-white/20"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Main slide */}
      <div className="h-full flex flex-col justify-center px-16 py-12 relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
          <div className="absolute top-8 right-8 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 bg-blue-500/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-fade-in">
            {currentSlideData?.title}
          </h1>
          <div 
            className="prose prose-lg prose-invert max-w-none text-gray-100 leading-relaxed text-center animate-slide-up"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(currentSlideData?.content || '')
            }}
          />
        </div>
      </div>

      {/* Speaker notes */}
      {showNotes && currentSlideData?.speakerNotes && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 max-h-32 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <Mic className="h-4 w-4" />
            <span className="text-sm font-medium">Notes présentateur</span>
          </div>
          <p className="text-sm text-gray-300">{currentSlideData.speakerNotes}</p>
        </div>
      )}

      {/* Navigation */}
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

      {/* Keyboard shortcuts help */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-black/50 rounded px-2 py-1">
        Raccourcis: ← → Espace (navigation) | F (plein écran) | N (notes) | P (présentateur) | T (timer) | Échap (quitter)
      </div>
    </div>
  )
}

export default PresentationMode

