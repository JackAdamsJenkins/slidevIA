import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEYS = {
  API_KEY: 'slidev_generator_api_key',
  PRESENTATIONS: 'slidev_generator_presentations',
  DRAFTS: 'slidev_generator_drafts',
  SETTINGS: 'slidev_generator_settings'
}

export const useLocalStorage = () => {
  const [presentations, setPresentations] = useState([])
  const [drafts, setDrafts] = useState([])
  const [settings, setSettings] = useState({
    theme: 'default',
    autoSave: true,
    maxHistory: 10
  })

  // Charger les données au démarrage
  useEffect(() => {
    try {
      const savedPresentations = localStorage.getItem(STORAGE_KEYS.PRESENTATIONS)
      if (savedPresentations) {
        setPresentations(JSON.parse(savedPresentations))
      }

      const savedDrafts = localStorage.getItem(STORAGE_KEYS.DRAFTS)
      if (savedDrafts) {
        setDrafts(JSON.parse(savedDrafts))
      }

      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      if (savedSettings) {
        setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }))
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données locales:', error)
    }
  }, [])

  // Sauvegarder une présentation
  const savePresentation = useCallback((presentationData) => {
    try {
      const newPresentation = {
        id: Date.now().toString(),
        title: presentationData.title,
        prompt: presentationData.prompt,
        slides: presentationData.slides,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setPresentations(prev => {
        const updated = [newPresentation, ...prev]
        // Limiter l'historique
        const limited = updated.slice(0, settings.maxHistory)
        localStorage.setItem(STORAGE_KEYS.PRESENTATIONS, JSON.stringify(limited))
        return limited
      })

      return newPresentation.id
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      return null
    }
  }, [settings.maxHistory])

  // Sauvegarder un brouillon
  const saveDraft = useCallback((draftData) => {
    try {
      const draft = {
        id: draftData.id || Date.now().toString(),
        prompt: draftData.prompt,
        apiKey: draftData.apiKey ? '***masked***' : '', // Masquer la clé API
        createdAt: draftData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setDrafts(prev => {
        const filtered = prev.filter(d => d.id !== draft.id)
        const updated = [draft, ...filtered].slice(0, 5) // Max 5 brouillons
        localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(updated))
        return updated
      })

      return draft.id
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du brouillon:', error)
      return null
    }
  }, [])

  // Charger une présentation
  const loadPresentation = useCallback((id) => {
    return presentations.find(p => p.id === id) || null
  }, [presentations])

  // Supprimer une présentation
  const deletePresentation = useCallback((id) => {
    setPresentations(prev => {
      const updated = prev.filter(p => p.id !== id)
      localStorage.setItem(STORAGE_KEYS.PRESENTATIONS, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Supprimer un brouillon
  const deleteDraft = useCallback((id) => {
    setDrafts(prev => {
      const updated = prev.filter(d => d.id !== id)
      localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Sauvegarder les paramètres
  const saveSettings = useCallback((newSettings) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated))
  }, [settings])

  // Sauvegarder/récupérer la clé API (avec chiffrement basique)
  const saveApiKey = useCallback((apiKey) => {
    try {
      // Chiffrement simple (base64) - pas sécurisé mais mieux que rien
      const encoded = btoa(apiKey)
      localStorage.setItem(STORAGE_KEYS.API_KEY, encoded)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la clé API:', error)
    }
  }, [])

  const loadApiKey = useCallback(() => {
    try {
      const encoded = localStorage.getItem(STORAGE_KEYS.API_KEY)
      return encoded ? atob(encoded) : ''
    } catch (error) {
      console.error('Erreur lors du chargement de la clé API:', error)
      return ''
    }
  }, [])

  // Vider toutes les données
  const clearAllData = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    setPresentations([])
    setDrafts([])
    setSettings({
      theme: 'default',
      autoSave: true,
      maxHistory: 10
    })
  }, [])

  // Exporter les données
  const exportData = useCallback(() => {
    return {
      presentations,
      drafts: drafts.map(d => ({ ...d, apiKey: undefined })), // Exclure les clés API
      settings,
      exportedAt: new Date().toISOString()
    }
  }, [presentations, drafts, settings])

  // Importer les données
  const importData = useCallback((data) => {
    try {
      if (data.presentations) {
        setPresentations(data.presentations)
        localStorage.setItem(STORAGE_KEYS.PRESENTATIONS, JSON.stringify(data.presentations))
      }
      
      if (data.drafts) {
        setDrafts(data.drafts)
        localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(data.drafts))
      }
      
      if (data.settings) {
        setSettings(data.settings)
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings))
      }
      
      return true
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error)
      return false
    }
  }, [])

  return {
    presentations,
    drafts,
    settings,
    savePresentation,
    saveDraft,
    loadPresentation,
    deletePresentation,
    deleteDraft,
    saveSettings,
    saveApiKey,
    loadApiKey,
    clearAllData,
    exportData,
    importData
  }
}

export default useLocalStorage

