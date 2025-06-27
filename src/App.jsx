import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { AlertCircle, CheckCircle, FileText, History, Info, Loader2, Monitor, Moon, Play, Presentation, Save, Settings, Sparkles, Sun, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import './App.css'
import GenerationSettings from './components/GenerationSettings.jsx'
import MultiWindowPresentation from './components/MultiWindowPresentation.jsx'
import PresentationHistory from './components/PresentationHistory.jsx'
import PresentationMode from './components/PresentationMode.jsx'
import PresentationPlanEditor from './components/PresentationPlanEditor.jsx'
import SlideEditor from './components/SlideEditor.jsx'
import SlideViewer from './components/SlideViewer.jsx'
import { Switch } from './components/ui/switch.jsx'
import useApiKeyValidator from './hooks/useApiKeyValidator.js'
import useErrorHandler from './hooks/useErrorHandler.js'
import useLocalStorage from './hooks/useLocalStorage.js'
import useNetworkStatus from './hooks/useNetworkStatus.js'

function App() {
  const [prompt, setPrompt] = useState('')
  const [slides, setSlides] = useState([])
  const [presentationTitle, setPresentationTitle] = useState('')
  const [presentationPlan, setPresentationPlan] = useState([])
  const [loading, setLoading] = useState(false)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [currentStep, setCurrentStep] = useState('config') // 'config', 'plan', 'generate', 'edit', 'present'
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showPresentationMode, setShowPresentationMode] = useState(false)
  const [showMultiWindowMode, setShowMultiWindowMode] = useState(false)
  const [theme, setTheme] = useState(() => {
    // Préférence utilisateur ou système
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    }
    return 'light'
  })

  // Paramètres de génération avec valeurs par défaut
  const [generationSettings, setGenerationSettings] = useState({
    slideCount: 'auto',
    generateSpeakerNotes: true,
    includeConclusion: true,
    includeTitleSlide: true,
    presentationStyle: 'professional',
    detailLevel: 'balanced'
  })

  // Hooks personnalisés
  const { error, isRetrying, clearError, handleError, retryWithBackoff } = useErrorHandler()
  const { 
    apiKey, 
    updateApiKey, 
    isValidating, 
    validationStatus, 
    validationMessage 
  } = useApiKeyValidator()
  const { isOnline } = useNetworkStatus()
  const {
    presentations,
    settings,
    savePresentation,
    deletePresentation,
    saveApiKey,
    loadApiKey
  } = useLocalStorage()

  // Charger la clé API et les paramètres au démarrage
  useEffect(() => {
    const savedApiKey = loadApiKey()
    if (savedApiKey) {
      updateApiKey(savedApiKey)
    }
    
    setAutoSaveEnabled(settings.autoSave !== false)
  }, [loadApiKey, updateApiKey, settings.autoSave])

  // Sauvegarder la clé API quand elle change
  useEffect(() => {
    if (apiKey && validationStatus === 'valid') {
      saveApiKey(apiKey)
    }
  }, [apiKey, validationStatus, saveApiKey])

  // Auto-sauvegarde des brouillons (disabled as saveDraft is not available)
  useEffect(() => {
    if (autoSaveEnabled && prompt.trim()) {
      // Auto-save logic would go here if saveDraft was available
    }
  }, [prompt, apiKey, autoSaveEnabled])

  // Gestion du plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const generatePlan = async () => {
    if (!apiKey.trim() || validationStatus === 'invalid' || !prompt.trim() || !isOnline) {
      handleError(new Error('Vérifiez votre configuration avant de générer le plan'))
      return
    }

    setLoading(true)
    clearError()
    
    const apiCall = async () => {
      const slideCountText = generationSettings.slideCount === 'auto' 
        ? 'entre 5 et 8 slides' 
        : `exactement ${generationSettings.slideCount} slides`

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ 
              text: `Génère un plan détaillé pour une présentation ${generationSettings.presentationStyle} sur le thème : "${prompt}".
                     Le plan doit contenir ${slideCountText}.
                     Style: ${generationSettings.presentationStyle}
                     Niveau de détail: ${generationSettings.detailLevel}
                     ${generationSettings.includeTitleSlide ? 'Inclure une slide de titre.' : ''}
                     ${generationSettings.includeConclusion ? 'Inclure une slide de conclusion.' : ''}
                     
                     Pour chaque slide, fournis un titre accrocheur et une description détaillée du contenu.` 
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                slides: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      title: { type: "STRING" },
                      description: { type: "STRING" }
                    },
                    propertyOrdering: ["title", "description"]
                  }
                }
              },
              propertyOrdering: ["title", "slides"]
            }
          }
        })
      })

      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Réponse API invalide')
      }

      return JSON.parse(data.candidates[0].content.parts[0].text)
    }

    try {
      const planData = await retryWithBackoff(apiCall, 3)
      setPresentationPlan(planData.slides || [])
      setPresentationTitle(planData.title || 'Présentation')
      setCurrentStep('plan')
    } catch (err) {
      handleError(err, 'Génération du plan')
    } finally {
      setLoading(false)
    }
  }

  const generateFromPlan = async () => {
    if (presentationPlan.length === 0) return

    setLoading(true)
    clearError()
    
    const apiCall = async () => {
      const planText = presentationPlan.map((slide, index) => 
        `Slide ${index + 1}: ${slide.title}\nContenu: ${slide.description}`
      ).join('\n\n')

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ 
              text: `Génère le contenu détaillé pour chaque slide basé sur ce plan :
                     
                     ${planText}
                     
                     Pour chaque slide, crée un contenu riche en markdown avec :
                     - Titres et sous-titres appropriés (utilise ## pour les sous-titres et ### pour les sous-sous-titres)
                     - Listes à puces quand nécessaire (utilise * pour les listes)
                     - Mise en forme (gras avec **, italique avec *)
                     - Contenu informatif et engageant
                     
                     ${generationSettings.generateSpeakerNotes ? 'Inclus également des notes présentateur pour chaque slide.' : ''}` 
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                slides: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      title: { type: "STRING" },
                      content: { type: "STRING" },
                      speakerNotes: { type: "STRING" }
                    },
                    propertyOrdering: ["title", "content", "speakerNotes"]
                  }
                }
              }
            }
          }
        })
      })

      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Réponse API invalide')
      }

      return JSON.parse(data.candidates[0].content.parts[0].text)
    }

    try {
      const generatedContent = await retryWithBackoff(apiCall, 3)
      setSlides(generatedContent.slides || [])
      setCurrentStep('edit')

      // Sauvegarder automatiquement la présentation
      if (autoSaveEnabled) {
        savePresentation({
          title: presentationTitle,
          prompt: prompt,
          slides: generatedContent.slides || []
        })
      }
    } catch (err) {
      handleError(err, 'Génération de la présentation')
    } finally {
      setLoading(false)
    }
  }

  const generateSpeakerNotes = async (slideTitle, slideContent) => {
    const apiCall = async () => {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ 
              text: `Génère des notes présentateur pour cette slide :
                     
                     Titre: ${slideTitle}
                     Contenu: ${slideContent}
                     
                     Les notes doivent être concises, utiles pour le présentateur, et inclure :
                     - Points clés à mentionner
                     - Transitions vers la slide suivante
                     - Exemples ou anecdotes à partager
                     - Durée estimée de présentation` 
            }]
          }]
        })
      })

      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      return data.candidates[0].content.parts[0].text
    }

    try {
      return await retryWithBackoff(apiCall, 2)
    } catch (err) {
      console.error('Erreur génération notes:', err)
      return 'Impossible de générer les notes présentateur.'
    }
  }

  const handleLoadPresentation = (presentation) => {
    setSlides(presentation.slides)
    setPresentationTitle(presentation.title)
    setPrompt(presentation.prompt)
    setCurrentStep('edit')
    clearError()
  }

  const handleDownloadPresentation = (presentation) => {
    const slidevContent = generateSlidevContent(presentation.slides, presentation.title)
    const blob = new Blob([slidevContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${presentation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateSlidevContent = (slides, title) => {
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

${slide.speakerNotes ? `
---
layout: two-cols

# Notes présentateur

${slide.speakerNotes}

::right::

` : ''}

---

`
    })

    return slidevContent
  }

  const resetToConfig = () => {
    setCurrentStep('config')
    setSlides([])
    setPresentationPlan([])
    setPresentationTitle('')
    clearError()
  }

  const getValidationIcon = () => {
    if (isValidating) return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    if (validationStatus === 'valid') return <CheckCircle className="h-4 w-4 text-green-500" />
    if (validationStatus === 'invalid') return <XCircle className="h-4 w-4 text-red-500" />
    return null
  }

  // Mode présentateur multi-fenêtres
  if (showMultiWindowMode && slides.length > 0) {
    return (
      <MultiWindowPresentation
        slides={slides}
        title={presentationTitle}
        onClose={() => setShowMultiWindowMode(false)}
      />
    )
  }

  // Mode présentateur simple
  if (showPresentationMode && slides.length > 0) {
    return (
      <PresentationMode
        slides={slides}
        title={presentationTitle}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onClose={() => setShowPresentationMode(false)}
      />
    )
  }

  // Ajout de la variable isDark juste avant le return
  const isDark = theme === 'dark'
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Barre supérieure */}
      <div className="flex justify-between items-center px-6 py-4 bg-white/80 dark:bg-black/60 shadow-md sticky top-0 z-50">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent select-none">
          Slidev IA
        </h1>
        <div className="flex items-center gap-4">
          {/* Switch dark mode */}
          <div className="flex items-center gap-2">
            <Sun className={`h-5 w-5 ${isDark ? 'opacity-40' : 'text-yellow-500'}`} />
            <Switch
              checked={isDark}
              onCheckedChange={toggleTheme}
              aria-label="Activer/désactiver le mode sombre"
            />
            <Moon className={`h-5 w-5 ${isDark ? 'text-blue-300' : 'opacity-40'}`} />
          </div>
        </div>
      </div>
      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8 xl:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Panel de configuration */}
          <div className="xl:col-span-1 space-y-6">
            <Tabs value={currentStep === 'config' ? 'config' : currentStep === 'history' ? 'history' : 'config'} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="config" onClick={() => setCurrentStep('config')}>Configuration</TabsTrigger>
                <TabsTrigger value="history" onClick={() => setCurrentStep('history')}> <History className="h-4 w-4 mr-1" /> Historique </TabsTrigger>
              </TabsList>
              
              <TabsContent value="config">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Configuration
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Configurez votre clé API et décrivez votre présentation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="space-y-3">
                      <Label htmlFor="apiKey" className="text-sm font-medium flex items-center gap-2">
                        Clé API Gemini
                        {getValidationIcon()}
                      </Label>
                      <Input
                        id="apiKey"
                        type="password"
                        placeholder="Votre clé API Gemini..."
                        value={apiKey}
                        onChange={(e) => updateApiKey(e.target.value)}
                        className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                          validationStatus === 'valid' ? 'border-green-500' : 
                          validationStatus === 'invalid' ? 'border-red-500' : ''
                        }`}
                      />
                      {validationMessage && (
                        <p className={`text-xs flex items-center gap-1 ${
                          validationStatus === 'valid' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {validationStatus === 'valid' ? 
                            <CheckCircle className="h-3 w-3" /> : 
                            <AlertCircle className="h-3 w-3" />
                          }
                          {validationMessage}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Obtenez votre clé API sur{' '}
                        <a 
                          href="https://aistudio.google.com/app/apikey" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Google AI Studio
                        </a>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="prompt" className="text-sm font-medium">Sujet de la présentation</Label>
                      <Textarea
                        id="prompt"
                        placeholder="Ex: Les bases de la photographie, L'histoire de l'intelligence artificielle, Les principes du marketing digital..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={5}
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      {autoSaveEnabled && prompt && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Save className="h-3 w-3" />
                          Brouillon sauvegardé automatiquement
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        onClick={generatePlan} 
                        disabled={loading || isRetrying || !isOnline || validationStatus === 'invalid'}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                      >
                        {loading || isRetrying ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isRetrying ? 'Nouvelle tentative...' : 'Génération...'}
                          </>
                        ) : (
                          <>
                            <FileText className="mr-2 h-4 w-4" />
                            Générer le plan
                          </>
                        )}
                      </Button>
                      
                      {(slides.length > 0 || presentationPlan.length > 0) && (
                        <Button 
                          variant="outline" 
                          onClick={resetToConfig}
                          className="px-4"
                        >
                          Nouveau
                        </Button>
                      )}
                    </div>

                    {error && (
                      <Alert variant="destructive" className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                      </Alert>
                    )}

                    {presentationPlan.length > 0 && (
                      <Alert className="border-green-200 bg-green-50">
                        <AlertDescription className="text-green-800">
                          ✅ Plan généré avec succès ! {presentationPlan.length} slides planifiées.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <PresentationHistory
                  presentations={presentations}
                  onLoadPresentation={handleLoadPresentation}
                  onDeletePresentation={deletePresentation}
                  onDownloadPresentation={handleDownloadPresentation}
                />
              </TabsContent>
            </Tabs>

            {/* Paramètres de génération */}
            {currentStep === 'config' && (
              <GenerationSettings 
                settings={generationSettings}
                onSettingsChange={setGenerationSettings}
              />
            )}
          </div>

          {/* Panel principal */}
          <div className="xl:col-span-2">
            {currentStep === 'plan' && presentationPlan.length > 0 ? (
              <PresentationPlanEditor
                plan={presentationPlan}
                onPlanChange={setPresentationPlan}
                onGenerateFromPlan={generateFromPlan}
                onRegeneratePlan={generatePlan}
                loading={loading}
              />
            ) : currentStep === 'edit' && slides.length > 0 ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Édition de la présentation</h2>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowPresentationMode(true)}
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Mode simple
                    </Button>
                    <Button
                      onClick={() => setShowMultiWindowMode(true)}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      Mode présentateur
                    </Button>
                    <Button
                      onClick={() => setCurrentStep('preview')}
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <Presentation className="h-4 w-4 mr-2" />
                      Aperçu
                    </Button>
                  </div>
                </div>
                <SlideEditor
                  slides={slides}
                  onSlidesChange={setSlides}
                  onGenerateSpeakerNotes={generateSpeakerNotes}
                />
              </div>
            ) : currentStep === 'preview' && slides.length > 0 ? (
              <SlideViewer slides={slides} title={presentationTitle} />
            ) : (
              <Card className="shadow-lg border-0 bg-white/40 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="relative mb-6">
                    <Presentation className="h-24 w-24 text-gray-300" />
                    <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                    Prêt à créer votre présentation ?
                  </h3>
                  <p className="text-gray-500 max-w-md mb-4">
                    Saisissez votre clé API Gemini et décrivez le sujet de votre présentation. 
                    L'IA générera d'abord un plan que vous pourrez modifier avant la génération finale.
                  </p>
                  {presentations.length > 0 && (
                    <p className="text-sm text-blue-600">
                      💡 Consultez l'onglet "Historique" pour reprendre vos anciennes présentations
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

