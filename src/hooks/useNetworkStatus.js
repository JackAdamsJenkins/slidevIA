import { useState, useEffect } from 'react'

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [connectionType, setConnectionType] = useState('unknown')

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    const handleConnectionChange = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
        if (connection) {
          setConnectionType(connection.effectiveType || 'unknown')
        }
      }
    }

    // Événements de connexion
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Détection du type de connexion (si supporté)
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      if (connection) {
        connection.addEventListener('change', handleConnectionChange)
        handleConnectionChange() // Initial check
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      
      if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
        if (connection) {
          connection.removeEventListener('change', handleConnectionChange)
        }
      }
    }
  }, [])

  const getConnectionQuality = () => {
    if (!isOnline) return 'offline'
    
    switch (connectionType) {
      case 'slow-2g':
      case '2g':
        return 'poor'
      case '3g':
        return 'good'
      case '4g':
        return 'excellent'
      default:
        return 'unknown'
    }
  }

  return {
    isOnline,
    connectionType,
    connectionQuality: getConnectionQuality()
  }
}

export default useNetworkStatus

