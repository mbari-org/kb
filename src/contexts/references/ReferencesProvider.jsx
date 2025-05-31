import { use, useCallback, useState } from 'react'

import { createReference, getReferences, updateReference } from '@/lib/kb/api/references'

import ConfigContext from '@/contexts/config/ConfigContext'
import ReferencesContext from '@/contexts/references/ReferencesContext'

export const ReferencesProvider = ({ children }) => {
  const [references, setReferences] = useState([])
  const { apiFns } = use(ConfigContext)

  const loadReferences = useCallback(async () => {
    const data = await apiFns.apiPayload(getReferences)
    setReferences(data)
  }, [apiFns])

  const addReference = useCallback(
    async referenceData => {
      try {
        const newReference = await apiFns.apiResult(createReference, referenceData)
        setReferences(prev => [...prev, newReference])
      } catch (error) {
        console.error('Error creating reference:', error)
        throw error
      }
    },
    [apiFns]
  )

  const editReference = useCallback(
    async referenceData => {
      try {
        await apiFns.apiResult(updateReference, referenceData)
        await loadReferences() // Refresh the list after updating
      } catch (error) {
        console.error('Error updating reference:', error)
        throw error
      }
    },
    [apiFns, loadReferences]
  )

  const value = {
    references,
    addReference,
    editReference,
    loadReferences,
  }

  return <ReferencesContext.Provider value={value}>{children}</ReferencesContext.Provider>
}

export default ReferencesProvider
