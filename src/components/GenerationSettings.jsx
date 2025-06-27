import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Settings, Sliders, FileText, Mic } from 'lucide-react'

const GenerationSettings = ({ 
  settings, 
  onSettingsChange 
}) => {
  const [customSlideCount, setCustomSlideCount] = useState(settings.slideCount === 'auto' ? 8 : settings.slideCount)

  const handleSlideCountModeChange = (value) => {
    if (value === 'auto') {
      onSettingsChange({
        ...settings,
        slideCount: 'auto'
      })
    } else {
      onSettingsChange({
        ...settings,
        slideCount: customSlideCount
      })
    }
  }

  const handleCustomSlideCountChange = (e) => {
    const value = parseInt(e.target.value)
    if (value >= 1 && value <= 50) {
      setCustomSlideCount(value)
      if (settings.slideCount !== 'auto') {
        onSettingsChange({
          ...settings,
          slideCount: value
        })
      }
    }
  }

  const handleToggleChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    })
  }

  const isCustomMode = settings.slideCount !== 'auto'

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Paramètres de génération
        </CardTitle>
        <CardDescription>
          Personnalisez la génération de votre présentation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nombre de slides */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            Nombre de slides
          </Label>
          <Select 
            value={isCustomMode ? 'custom' : 'auto'} 
            onValueChange={handleSlideCountModeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir le nombre de slides" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Automatique (5-8 slides)</SelectItem>
              <SelectItem value="custom">Nombre personnalisé</SelectItem>
            </SelectContent>
          </Select>
          
          {isCustomMode && (
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="1"
                max="50"
                value={customSlideCount}
                onChange={handleCustomSlideCountChange}
                className="w-20"
              />
              <span className="text-sm text-gray-600">slides (entre 1 et 50)</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Options de contenu */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Options de contenu
          </Label>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm">Générer les notes présentateur</Label>
                <p className="text-xs text-gray-500">
                  Ajouter des notes pour chaque slide
                </p>
              </div>
              <Switch
                checked={settings.generateSpeakerNotes || false}
                onCheckedChange={(checked) => handleToggleChange('generateSpeakerNotes', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm">Inclure une slide de conclusion</Label>
                <p className="text-xs text-gray-500">
                  Ajouter automatiquement une conclusion
                </p>
              </div>
              <Switch
                checked={settings.includeConclusion || false}
                onCheckedChange={(checked) => handleToggleChange('includeConclusion', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm">Slide de titre</Label>
                <p className="text-xs text-gray-500">
                  Inclure une slide de titre au début
                </p>
              </div>
              <Switch
                checked={settings.includeTitleSlide || false}
                onCheckedChange={(checked) => handleToggleChange('includeTitleSlide', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Style et format */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Style de présentation</Label>
          
          <Select 
            value={settings.presentationStyle || 'professional'} 
            onValueChange={(value) => handleToggleChange('presentationStyle', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir un style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professionnel</SelectItem>
              <SelectItem value="educational">Éducatif</SelectItem>
              <SelectItem value="creative">Créatif</SelectItem>
              <SelectItem value="technical">Technique</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium">Niveau de détail</Label>
          
          <Select 
            value={settings.detailLevel || 'balanced'} 
            onValueChange={(value) => handleToggleChange('detailLevel', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir le niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="concise">Concis</SelectItem>
              <SelectItem value="balanced">Équilibré</SelectItem>
              <SelectItem value="detailed">Détaillé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Résumé des paramètres */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-sm text-gray-900">Résumé des paramètres</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <p>• Slides: {settings.slideCount === 'auto' ? 'Automatique (5-8)' : `${settings.slideCount} slides`}</p>
            <p>• Style: {settings.presentationStyle || 'Professionnel'}</p>
            <p>• Détail: {settings.detailLevel || 'Équilibré'}</p>
            <p>• Notes présentateur: {settings.generateSpeakerNotes ? 'Oui' : 'Non'}</p>
            <p>• Conclusion: {settings.includeConclusion ? 'Oui' : 'Non'}</p>
            <p>• Slide de titre: {settings.includeTitleSlide ? 'Oui' : 'Non'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default GenerationSettings

