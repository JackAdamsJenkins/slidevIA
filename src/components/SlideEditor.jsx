import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { 
  Edit3, 
  Eye, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  FileText,
  Mic,
  Sparkles
} from 'lucide-react'

const SlideEditor = ({ 
  slides, 
  onSlidesChange, 
  onGenerateSpeakerNotes 
}) => {
  const [editingSlide, setEditingSlide] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editNotes, setEditNotes] = useState('')

  const startEditing = (index) => {
    const slide = slides[index]
    setEditingSlide(index)
    setEditTitle(slide.title)
    setEditContent(slide.content)
    setEditNotes(slide.speakerNotes || '')
  }

  const saveSlide = () => {
    const newSlides = [...slides]
    newSlides[editingSlide] = {
      ...newSlides[editingSlide],
      title: editTitle,
      content: editContent,
      speakerNotes: editNotes
    }
    onSlidesChange(newSlides)
    setEditingSlide(null)
  }

  const cancelEdit = () => {
    setEditingSlide(null)
    setEditTitle('')
    setEditContent('')
    setEditNotes('')
  }

  const addSlide = () => {
    const newSlide = {
      title: 'Nouveau slide',
      content: 'Contenu du slide...',
      speakerNotes: ''
    }
    onSlidesChange([...slides, newSlide])
  }

  const removeSlide = (index) => {
    const newSlides = slides.filter((_, i) => i !== index)
    onSlidesChange(newSlides)
  }

  const moveSlide = (index, direction) => {
    const newSlides = [...slides]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex >= 0 && targetIndex < slides.length) {
      [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]]
      onSlidesChange(newSlides)
    }
  }

  const generateSpeakerNotesForSlide = async (index) => {
    if (onGenerateSpeakerNotes) {
      const slide = slides[index]
      const notes = await onGenerateSpeakerNotes(slide.title, slide.content)
      
      const newSlides = [...slides]
      newSlides[index] = {
        ...newSlides[index],
        speakerNotes: notes
      }
      onSlidesChange(newSlides)
    }
  }

  const renderMarkdown = (content) => {
    if (!content) return ''
    
    // Nettoyer le contenu d'abord
    let cleanContent = content.trim()
    
    // Traiter les titres
    cleanContent = cleanContent
      .replace(/^### (.+)$/gm, '<h3 style="font-size: 1.25rem; font-weight: bold; color: #2563eb; margin: 1rem 0 0.5rem 0;">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 style="font-size: 1.5rem; font-weight: bold; color: #7c3aed; margin: 1.5rem 0 0.75rem 0;">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 style="font-size: 1.875rem; font-weight: bold; color: #1f2937; margin: 2rem 0 1rem 0;">$1</h1>')
    
    // Traiter le formatage inline
    cleanContent = cleanContent
      .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: 600; color: #2563eb;">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em style="font-style: italic; color: #7c3aed;">$1</em>')
      .replace(/`(.+?)`/g, '<code style="background-color: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; color: #dc2626; font-family: monospace; font-size: 0.875rem;">$1</code>')
    
    // Traiter les listes
    const lines = cleanContent.split('\n')
    let result = []
    let inList = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (line.startsWith('* ') || line.startsWith('- ')) {
        if (!inList) {
          result.push('<ul style="margin: 0.5rem 0; padding-left: 1rem;">')
          inList = true
        }
        const content = line.substring(2).trim()
        result.push(`<li style="margin: 0.25rem 0; display: flex; align-items: flex-start;"><span style="color: #2563eb; margin-right: 0.5rem; font-weight: bold;">•</span><span>${content}</span></li>`)
      } else if (line.match(/^\d+\. /)) {
        if (!inList) {
          result.push('<ol style="margin: 0.5rem 0; padding-left: 1rem;">')
          inList = true
        }
        const content = line.replace(/^\d+\. /, '').trim()
        result.push(`<li style="margin: 0.25rem 0; display: flex; align-items: flex-start;"><span style="color: #7c3aed; margin-right: 0.5rem; font-weight: bold;">•</span><span>${content}</span></li>`)
      } else {
        if (inList) {
          result.push('</ul>')
          inList = false
        }
        if (line) {
          result.push(`<p style="margin: 0.5rem 0; line-height: 1.5; color: #374151;">${line}</p>`)
        }
      }
    }
    
    if (inList) {
      result.push('</ul>')
    }
    
    return result.join('')
  }

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Edit3 className="h-6 w-6" />
              Éditeur de slides
            </CardTitle>
            <CardDescription className="text-base mt-1">
              {slides.length} slide{slides.length > 1 ? 's' : ''} • Cliquez pour modifier
            </CardDescription>
          </div>
          <Button
            onClick={addSlide}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un slide
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="max-h-[700px]">
          <div className="p-6 space-y-4">
            {slides.map((slide, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white/70 hover:bg-white/90 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <Badge variant="secondary" className="text-sm font-medium shrink-0">
                      Slide {index + 1}
                    </Badge>
                    <h4 className="font-semibold text-gray-900 text-base truncate">
                      {slide.title}
                    </h4>
                  </div>
                  
                  <div className="flex gap-1 shrink-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-blue-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>Aperçu - {slide.title}</DialogTitle>
                          <DialogDescription>
                            Slide {index + 1} sur {slides.length}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
                          <div 
                            className="border rounded-lg p-6 bg-gray-50"
                            dangerouslySetInnerHTML={{
                              __html: renderMarkdown(slide.content)
                            }}
                          />
                          {slide.speakerNotes && (
                            <div className="border-t pt-4">
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Mic className="h-4 w-4" />
                                Notes présentateur
                              </h4>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                {slide.speakerNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditing(index)}
                      className="h-8 w-8 p-0 hover:bg-blue-100"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveSlide(index, 'up')}
                      disabled={index === 0}
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveSlide(index, 'down')}
                      disabled={index === slides.length - 1}
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeSlide(index)}
                      className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div 
                    className="text-sm text-gray-600 line-clamp-3 border rounded p-3 bg-gray-50"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(slide.content.substring(0, 200) + (slide.content.length > 200 ? '...' : ''))
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {slide.speakerNotes ? (
                      <Badge variant="outline" className="text-xs">
                        <Mic className="h-3 w-3 mr-1" />
                        Notes incluses
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateSpeakerNotesForSlide(index)}
                        className="text-xs h-6"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Générer notes
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Dialog d'édition */}
        {editingSlide !== null && (
          <Dialog open={true} onOpenChange={() => cancelEdit()}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Modifier le slide {editingSlide + 1}</DialogTitle>
                <DialogDescription>
                  Éditez le contenu et les notes de présentation
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Contenu</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="preview">Aperçu</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Titre</label>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Titre du slide"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Contenu (Markdown)</label>
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Contenu du slide en Markdown..."
                      rows={12}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Utilisez Markdown: **gras**, *italique*, ### Titre, * Liste
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <Mic className="h-4 w-4" />
                      Notes présentateur
                    </label>
                    <Textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Notes pour le présentateur..."
                      rows={10}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="preview" className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                    <h3 className="text-xl font-bold mb-4">{editTitle}</h3>
                    <div 
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(editContent)
                      }}
                    />
                    {editNotes && (
                      <div className="border-t mt-4 pt-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Mic className="h-4 w-4" />
                          Notes présentateur
                        </h4>
                        <p className="text-sm text-gray-600 bg-white p-3 rounded">
                          {editNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button onClick={saveSlide} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}

export default SlideEditor

