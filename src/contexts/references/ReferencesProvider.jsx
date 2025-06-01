import { use, useCallback, useEffect, useState } from 'react'

import {
  createReference,
  deleteReference as removeReference,
  getReferences,
  updateReference,
} from '@/lib/kb/api/references'

import ConfigContext from '@/contexts/config/ConfigContext'
import ReferencesContext from '@/contexts/references/ReferencesContext'

export const ReferencesProvider = ({ children }) => {
  const { apiFns } = use(ConfigContext)

  const [references, setReferences] = useState([])

  const addReference = useCallback(
    async referenceData => {
      const createdReference = await apiFns.apiPayload(createReference, referenceData)
      setReferences(prev => [...prev, createdReference])
    },
    [apiFns]
  )

  const deleteReference = useCallback(
    async referenceId => {
      await apiFns.apiPayload(removeReference, referenceId)
      setReferences(prev => prev.filter(reference => reference.id !== referenceId))
    },
    [apiFns]
  )

  const editReference = useCallback(
    async (referenceId, updatedData) => {
      const updatedReference = await apiFns.apiResult(updateReference, [referenceId, updatedData])
      setReferences(prev =>
        prev.map(reference => (reference.id === updatedReference.id ? updatedReference : reference))
      )
    },
    [apiFns]
  )

  useEffect(() => {
    // if (!user) return

    const loadReferences = async () => {
      const data = await apiFns.apiPayload(getReferences)
      setReferences(data)
    }

    loadReferences()
  }, [apiFns])

  const value = {
    addReference,
    deleteReference,
    editReference,
    references,
  }

  return <ReferencesContext.Provider value={value}>{children}</ReferencesContext.Provider>
}

export default ReferencesProvider
