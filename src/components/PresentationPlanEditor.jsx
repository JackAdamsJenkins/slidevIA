import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Sparkles,
  RefreshCw
} from 'lucide-react'

const PresentationPlanEditor = ({ 
  plan, 
  onPlanChange, 
  onGenerateFromPlan, 
  onRegeneratePlan,
  loading 
}) => {
  const [editingIndex, setEditingIndex] = useState(-1)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingDescription, setEditingDescription] = useState('')

  const addSlide = () => {
    const newSlide = {
      title: 'Nouveau slide',
      description: 'Description du contenu de ce slide'
    }
    onPlanChange([...plan, newSlide])
  }

  const removeSlide = (index) => {
    const newPlan = plan.filter((_, i) => i !== index)
    onPlanChange(newPlan)
  }

  const moveSlide = (index, direction) => {
    const newPlan = [...plan]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex >= 0 && targetIndex < plan.length) {
      [newPlan[index], newPlan[targetIndex]] = [newPlan[targetIndex], newPlan[index]]
      onPlanChange(newPlan)
    }
  }

  const startEditing = (index) => {
    setEditingIndex(index)
    setEditingTitle(plan[index].title)
    setEditingDescription(plan[index].description)
  }

  const saveEdit = () => {
    const newPlan = [...plan]
    newPlan[editingIndex] = {
      title: editingTitle,
      description: editingDescription
    }
    onPlanChange(newPlan)
    setEditingIndex(-1)
  }

  const cancelEdit = () => {
    setEditingIndex(-1)
    setEditingTitle('')
    setEditingDescription('')
  }

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-6 w-6" />
              Plan de la présentation
            </CardTitle>
            <CardDescription className="text-base mt-1">
              {plan.length} slide{plan.length > 1 ? 's' : ''} planifié{plan.length > 1 ? 's' : ''}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRegeneratePlan}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Régénérer le plan
            </Button>
            <Button
              onClick={onGenerateFromPlan}
              disabled={loading || plan.length === 0}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Générer la présentation
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="max-h-[600px]">
          <div className="p-6 space-y-4">
            {plan.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Aucun plan généré</h3>
                <p className="text-sm mb-4">Générez d'abord un plan à partir de votre prompt</p>
                <Button onClick={addSlide} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un slide manuellement
                </Button>
              </div>
            ) : (
              <>
                {plan.map((slide, index) => (
                  <div key={index}>
                    <div className="border rounded-lg p-4 bg-white/50 hover:bg-white/70 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-sm font-medium">
                            Slide {index + 1}
                          </Badge>
                          {editingIndex === index ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={saveEdit}
                                className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEdit}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditing(index)}
                              className="h-8 w-8 p-0 hover:bg-blue-100"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
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
                            disabled={index === plan.length - 1}
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
                      
                      {editingIndex === index ? (
                        <div className="space-y-3">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            placeholder="Titre du slide"
                            className="font-medium"
                          />
                          <Textarea
                            value={editingDescription}
                            onChange={(e) => setEditingDescription(e.target.value)}
                            placeholder="Description du contenu"
                            rows={3}
                            className="resize-none"
                          />
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 text-base">
                            {slide.title}
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {slide.description}
                          </p>
                        </div>
                      )}
                    </div>
                    {index < plan.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
                
                <div className="pt-4 border-t border-dashed">
                  <Button
                    onClick={addSlide}
                    variant="outline"
                    className="w-full flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter un slide
                  </Button>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default PresentationPlanEditor

