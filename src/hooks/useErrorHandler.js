import { useState, useCallback } from 'react'

export const useErrorHandler = () => {
  const [error, setError] = useState('')
  const [isRetrying, setIsRetrying] = useState(false)

  const clearError = useCallback(() => {
    setError('')
  }, [])

  const handleError = useCallback((err, context = '') => {
    console.error(`Error in ${context}:`, err)
    
    // Catégoriser les erreurs
    if (err.message?.includes('403')) {
      setError('Clé API invalide ou quota dépassé. Vérifiez votre clé API Gemini.')
    } else if (err.message?.includes('429')) {
      setError('Trop de requêtes. Veuillez attendre quelques minutes avant de réessayer.')
    } else if (err.message?.includes('NetworkError') || err.message?.includes('Failed to fetch')) {
      setError('Problème de connexion réseau. Vérifiez votre connexion internet.')
    } else if (err.message?.includes('JSON')) {
      setError('Réponse API malformée. Essayez avec un prompt plus simple.')
    } else {
      setError(`Erreur inattendue: ${err.message}`)
    }
  }, [])

  const retryWithBackoff = useCallback(async (operation, maxRetries = 3) => {
    setIsRetrying(true)
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation()
        setIsRetrying(false)
        clearError()
        return result
      } catch (err) {
        if (attempt === maxRetries) {
          handleError(err, 'Retry operation')
          setIsRetrying(false)
          throw err
        }
        
        // Backoff exponentiel
        const delay = Math.pow(2, attempt) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }, [handleError, clearError])

  return {
    error,
    isRetrying,
    clearError,
    handleError,
    retryWithBackoff
  }
}

export default useErrorHandler

