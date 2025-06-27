import { useState, useEffect, useCallback } from 'react'

export const useApiKeyValidator = () => {
  const [apiKey, setApiKey] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationStatus, setValidationStatus] = useState(null) // null, 'valid', 'invalid'
  const [validationMessage, setValidationMessage] = useState('')

  const validateApiKey = useCallback(async (key) => {
    if (!key || key.length < 10) {
      setValidationStatus('invalid')
      setValidationMessage('Clé API trop courte')
      return false
    }

    if (!key.startsWith('AIza')) {
      setValidationStatus('invalid')
      setValidationMessage('Format de clé API invalide (doit commencer par "AIza")')
      return false
    }

    setIsValidating(true)
    
    try {
      // Test simple avec un prompt minimal
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: "Test" }]
          }]
        })
      })

      if (response.ok) {
        setValidationStatus('valid')
        setValidationMessage('Clé API valide')
        return true
      } else if (response.status === 403) {
        setValidationStatus('invalid')
        setValidationMessage('Clé API invalide ou permissions insuffisantes')
        return false
      } else {
        setValidationStatus('invalid')
        setValidationMessage(`Erreur de validation (${response.status})`)
        return false
      }
    } catch (error) {
      setValidationStatus('invalid')
      setValidationMessage('Impossible de valider la clé API')
      return false
    } finally {
      setIsValidating(false)
    }
  }, [])

  // Validation automatique avec debounce
  useEffect(() => {
    if (!apiKey) {
      setValidationStatus(null)
      setValidationMessage('')
      return
    }

    const timeoutId = setTimeout(() => {
      validateApiKey(apiKey)
    }, 1000) // Attendre 1 seconde après la dernière frappe

    return () => clearTimeout(timeoutId)
  }, [apiKey, validateApiKey])

  const updateApiKey = useCallback((newKey) => {
    setApiKey(newKey)
    if (validationStatus === 'valid' && newKey !== apiKey) {
      setValidationStatus(null) // Reset validation when key changes
    }
  }, [apiKey, validationStatus])

  return {
    apiKey,
    updateApiKey,
    isValidating,
    validationStatus,
    validationMessage,
    validateApiKey: () => validateApiKey(apiKey)
  }
}

export default useApiKeyValidator

