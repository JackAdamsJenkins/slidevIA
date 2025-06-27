import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Mic,
  Monitor,
  Pause,
  Play,
  RotateCcw,
  X
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

const MultiWindowPresentation = ({ 
  slides, 
  title, 
  onClose 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [spectatorWindow, setSpectatorWindow] = useState(null)
  const spectatorWindowRef = useRef(null)

  // Fonction pour rendre le Markdown - définie en premier pour être utilisée dans les useEffect
  const renderMarkdown = useCallback((content) => {
    if (!content) return ''
    
    let cleanContent = content.trim()
    
    cleanContent = cleanContent
      .replace(/^### (.+)$/gm, '<h3 style="font-size: 2rem; font-weight: bold; color: #93c5fd; margin: 1.5rem 0 1rem 0;">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 style="font-size: 2.5rem; font-weight: bold; color: #c084fc; margin: 2rem 0 1.5rem 0;">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 style="font-size: 3rem; font-weight: bold; color: #ffffff; margin: 2.5rem 0 2rem 0;">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: 600; color: #93c5fd;">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em style="font-style: italic; color: #c084fc;">$1</em>')
      .replace(/`(.+?)`/g, '<code style="background-color: #374151; padding: 0.25rem 0.5rem; border-radius: 0.25rem; color: #86efac; font-family: monospace;">$1</code>')
    
    const lines = cleanContent.split('\n')
    let result = []
    let inList = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (line.startsWith('* ') || line.startsWith('- ')) {
        if (!inList) {
          result.push('<ul style="margin: 1rem 0; padding-left: 2rem; list-style: none;">')
          inList = true
        }
        const content = line.substring(2).trim()
        result.push(`<li style="margin: 0.75rem 0; display: flex; align-items: flex-start; font-size: 1.25rem;"><span style="color: #60a5fa; margin-right: 1rem; font-weight: bold; font-size: 1.5rem;">•</span><span style="color: #f3f4f6;">${content}</span></li>`)
      } else {
        if (inList) {
          result.push('</ul>')
          inList = false
        }
        if (line) {
          result.push(`<p style="margin: 1rem 0; line-height: 1.75; color: #f3f4f6; font-size: 1.25rem; text-align: center;">${line}</p>`)
        }
      }
    }
    
    if (inList) {
      result.push('</ul>')
    }
    
    return result.join('')
  }, [])

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

  // Ouvrir la fenêtre spectateur
  useEffect(() => {
    let newWindow = null
    let checkClosedInterval = null
    
    const openSpectatorWindow = () => {
      // Utiliser une fonction anonyme pour éviter la dépendance
      const currentSlideData = slides[currentSlide] || { title: '', content: '' }
      
      const spectatorHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Présentation - ${title}</title>
    <script>
      // Copie tous les liens <link rel=stylesheet> du parent dans la fenêtre spectateur
      window.onload = function() {
        try {
          const parentLinks = window.opener?.document.querySelectorAll('link[rel="stylesheet"]') || [];
          parentLinks.forEach(link => {
            const newLink = document.createElement('link');
            newLink.rel = 'stylesheet';
            newLink.href = link.href;
            document.head.appendChild(newLink);
          });
        } catch { /* ignore */ }
      }
    </script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
        }
        
        .background-effects {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.1;
            pointer-events: none;
        }
        
        .particle {
            position: absolute;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
        }
        
        .particle:nth-child(1) {
            width: 120px;
            height: 120px;
            top: 10%;
            right: 10%;
            animation-delay: 0s;
        }
        
        .particle:nth-child(2) {
            width: 80px;
            height: 80px;
            bottom: 15%;
            left: 15%;
            animation-delay: 2s;
        }
        
        .particle:nth-child(3) {
            width: 200px;
            height: 200px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation-delay: 4s;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) scale(1); opacity: 0.1; }
            50% { transform: translateY(-20px) scale(1.1); opacity: 0.2; }
        }
        
        .slide-container {
            width: 90%;
            max-width: 1200px;
            text-align: center;
            z-index: 10;
            padding: 2rem;
        }
        
        .slide-title {
            font-size: 4rem;
            font-weight: bold;
            margin-bottom: 3rem;
            background: linear-gradient(45deg, #60a5fa, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: fadeInUp 0.8s ease-out;
        }
        
        .slide-content {
            font-size: 1.5rem;
            line-height: 1.8;
            animation: fadeInUp 0.8s ease-out 0.2s both;
        }
        
        .slide-indicator {
            position: absolute;
            bottom: 2rem;
            right: 2rem;
            background: rgba(0, 0, 0, 0.5);
            padding: 1rem 1.5rem;
            border-radius: 2rem;
            font-size: 1.2rem;
            font-weight: 500;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 768px) {
            .slide-title {
                font-size: 2.5rem;
                margin-bottom: 2rem;
            }
            
            .slide-content {
                font-size: 1.2rem;
            }
        }
    </style>
</head>
<body>
    <div class="background-effects">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
    </div>
    
    <div class="slide-container">
        <h1 class="slide-title" id="slideTitle">${currentSlideData.title}</h1>
        <div class="slide-content" id="slideContent">${renderMarkdown(currentSlideData.content)}</div>
    </div>
    
    <div class="slide-indicator" id="slideIndicator">
        ${currentSlide + 1} / ${slides.length}
    </div>
    
    <script>
        // Écouter les messages de la fenêtre parent
        window.addEventListener('message', function(event) {
            if (event.data.type === 'updateSlide') {
                document.getElementById('slideTitle').innerHTML = event.data.title;
                document.getElementById('slideContent').innerHTML = event.data.content;
                document.getElementById('slideIndicator').innerHTML = event.data.indicator;
                
                // Redéclencher les animations
                const title = document.getElementById('slideTitle');
                const content = document.getElementById('slideContent');
                title.style.animation = 'none';
                content.style.animation = 'none';
                setTimeout(() => {
                    title.style.animation = 'fadeInUp 0.8s ease-out';
                    content.style.animation = 'fadeInUp 0.8s ease-out 0.2s both';
                }, 10);
            }
        });
    </script>
</body>
</html>`
      
      newWindow = window.open('', `spectator_${Date.now()}`, 'width=1920,height=1080,scrollbars=no,resizable=yes')
      
      if (newWindow) {
        newWindow.document.write(spectatorHtml)
        newWindow.document.close()
        setSpectatorWindow(newWindow)
        spectatorWindowRef.current = newWindow
        
        // Écouter la fermeture de la fenêtre
        checkClosedInterval = setInterval(() => {
          try {
            if (!newWindow || newWindow.closed || !newWindow.document) {
              clearInterval(checkClosedInterval)
              setSpectatorWindow(null)
              spectatorWindowRef.current = null
            }
          } catch {
            // La fenêtre est fermée si on ne peut pas accéder à ses propriétés
            clearInterval(checkClosedInterval)
            setSpectatorWindow(null)
            spectatorWindowRef.current = null
          }
        }, 500) // Vérification plus fréquente
      }
    }

    openSpectatorWindow()
    
    return () => {
      if (checkClosedInterval) {
        clearInterval(checkClosedInterval)
      }
      if (spectatorWindowRef.current && !spectatorWindowRef.current.closed) {
        spectatorWindowRef.current.close()
      }
    }
  }, [slides, currentSlide, title, renderMarkdown]) // Inclure toutes les dépendances nécessaires

  // Synchroniser la fenêtre spectateur
  const updateSpectatorWindow = useCallback(() => {
    try {
      if (spectatorWindow && !spectatorWindow.closed && spectatorWindow.document) {
        const currentSlideData = slides[currentSlide] || { title: '', content: '' }
        spectatorWindow.postMessage({
          type: 'updateSlide',
          title: currentSlideData.title,
          content: renderMarkdown(currentSlideData.content),
          indicator: `${currentSlide + 1} / ${slides.length}`
        }, '*')
      } else if (spectatorWindow && spectatorWindow.closed) {
        // La fenêtre est fermée, mettre à jour l'état
        setSpectatorWindow(null)
        spectatorWindowRef.current = null
      }
    } catch {
      // Erreur d'accès à la fenêtre, elle est probablement fermée
      setSpectatorWindow(null)
      spectatorWindowRef.current = null
    }
  }, [spectatorWindow, slides, currentSlide, renderMarkdown])
  
  useEffect(() => {
    updateSpectatorWindow()
  }, [updateSpectatorWindow])

  // Keyboard navigation
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
          onClose()
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
  }, [isTimerRunning, onClose, nextSlide, prevSlide])

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

  const currentSlideData = slides[currentSlide] || { title: '', content: '', speakerNotes: '' }

  return (
    <div className="presentation-overlay multi-window-presentation">
      {/* Header de contrôle */}
      <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-blue-600 text-white">
            <Monitor className="h-4 w-4 mr-2" />
            Mode Présentateur
          </Badge>
          <span className="text-gray-300">Slide {currentSlide + 1} sur {slides.length}</span>
          {spectatorWindow && !spectatorWindow.closed ? (
            <Badge variant="outline" className="text-green-400 border-green-400">
              ✅ Fenêtre spectateur ouverte
            </Badge>
          ) : (
            <Badge variant="outline" className="text-red-400 border-red-400">
              ❌ Fenêtre spectateur fermée
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-700 rounded px-3 py-1">
            <Clock className="h-4 w-4" />
            <span className="font-mono text-lg">{formatTime(timer)}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="h-6 w-6 p-0 text-white hover:bg-gray-600"
            >
              {isTimerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={resetTimer}
              className="h-6 w-6 p-0 text-white hover:bg-gray-600"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            <X className="h-4 w-4 mr-2" />
            Fermer
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Panel de contrôle (gauche) */}
        <div className="w-1/2 bg-gray-800 p-6 flex flex-col border-r border-gray-700">
          {/* Slide actuelle (miniature) */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-200">Slide actuelle</h3>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 aspect-video border border-gray-600">
              <h1 className="text-xl font-bold mb-3 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {currentSlideData.title}
              </h1>
              <div 
                className="text-xs text-gray-100 overflow-hidden"
                style={{ maxHeight: '120px' }}
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(currentSlideData.content)
                }}
              />
            </div>
          </div>

          {/* Notes présentateur */}
          <div className="flex-1 mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-200">
              <Mic className="h-5 w-5" />
              Notes présentateur
            </h3>
            <div className="bg-gray-700 rounded-lg p-4 text-gray-100 leading-relaxed h-full overflow-y-auto notes-container">
              {currentSlideData.speakerNotes || 'Aucune note disponible pour cette slide.'}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <Button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700"
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
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Aperçu de la fenêtre spectateur (droite) */}
        <div className="w-1/2 bg-gray-900 p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-3 text-gray-200 flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Aperçu fenêtre spectateur
          </h3>
          
          <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-8 flex flex-col justify-center relative border border-gray-600 spectator-preview">
            <div className="absolute inset-0 opacity-10 rounded-lg">
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/5 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-blue-500/10 rounded-full blur-lg animate-pulse delay-1000"></div>
            </div>
            
            <div className="relative z-10 text-center content">
              <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {currentSlideData.title}
              </h1>
              <div 
                className="text-sm text-gray-100 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(currentSlideData.content)
                }}
              />
            </div>
            
            <div className="absolute bottom-4 right-4 bg-black/50 rounded-full px-3 py-1 text-xs">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              {spectatorWindow && !spectatorWindow.closed 
                ? '✅ La fenêtre spectateur est synchronisée' 
                : '❌ La fenêtre spectateur est fermée'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Raccourcis clavier */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-400 bg-black/50 rounded px-2 py-1">
        Raccourcis: ← → Espace (navigation) | T (timer) | R (reset) | Échap (quitter)
      </div>
    </div>
  )
}

export default MultiWindowPresentation

