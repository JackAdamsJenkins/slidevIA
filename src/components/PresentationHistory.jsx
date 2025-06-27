import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { History, Trash2, Download, Eye, Calendar, FileText, Play } from 'lucide-react'

const PresentationHistory = ({ 
  presentations, 
  onLoadPresentation, 
  onDeletePresentation,
  onDownloadPresentation 
}) => {
  const [selectedPresentation, setSelectedPresentation] = useState(null)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const handleLoadPresentation = (presentation) => {
    onLoadPresentation(presentation)
    // Fermer le dialog si ouvert
    setSelectedPresentation(null)
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5" />
          Historique des présentations
        </CardTitle>
        <CardDescription>
          {presentations.length} présentation{presentations.length > 1 ? 's' : ''} sauvegardée{presentations.length > 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {presentations.length === 0 ? (
          <div className="text-center py-12 px-6 text-gray-500">
            <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Aucune présentation sauvegardée</h3>
            <p className="text-sm">Vos présentations générées apparaîtront ici</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] px-6">
            <div className="space-y-4 pb-4">
              {presentations.map((presentation, index) => (
                <div key={presentation.id}>
                  <div className="border rounded-lg p-4 hover:bg-gray-50/80 transition-all duration-200 hover:shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="font-semibold text-gray-900 truncate text-base mb-1">
                          {presentation.title}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {presentation.slides?.length || 0} slides
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {formatDate(presentation.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {truncateText(presentation.prompt, 120)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        onClick={() => handleLoadPresentation(presentation)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Reprendre
                      </Button>
                      
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPresentation(presentation)}
                              className="hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                            <DialogHeader>
                              <DialogTitle className="text-xl">{selectedPresentation?.title}</DialogTitle>
                              <DialogDescription className="text-base">
                                Créée le {selectedPresentation && formatDate(selectedPresentation.createdAt)} • {selectedPresentation?.slides?.length || 0} slides
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
                              <div>
                                <h4 className="font-semibold mb-3 text-gray-900">Prompt original :</h4>
                                <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border">
                                  {selectedPresentation?.prompt}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-3 text-gray-900">Aperçu des slides :</h4>
                                <div className="space-y-4">
                                  {selectedPresentation?.slides?.map((slide, index) => (
                                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-white rounded-r-lg">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                          Slide {index + 1}
                                        </span>
                                        <h5 className="font-medium text-gray-900">{slide.title}</h5>
                                      </div>
                                      <p className="text-sm text-gray-600 leading-relaxed">
                                        {truncateText(slide.content, 200)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t">
                              <Button
                                onClick={() => handleLoadPresentation(selectedPresentation)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Reprendre cette présentation
                              </Button>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => onDownloadPresentation(selectedPresentation)}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Télécharger
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDownloadPresentation(presentation)}
                          className="hover:bg-gray-100"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeletePresentation(presentation.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {index < presentations.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

export default PresentationHistory

