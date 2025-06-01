import { use, useCallback, useEffect, useState } from 'react'

import {
  createReference,
  deleteReference as removeReference,
  getReference,
  getReferences,
} from '@/lib/kb/api/references'

import ConfigContext from '@/contexts/config/ConfigContext'
import ReferencesContext from '@/contexts/references/ReferencesContext'

import updateReferenceFields from '@/contexts/config/updateReferenceFields'
import updateReferenceConcepts from '@/contexts/config/updateReferenceConcepts'

export const ReferencesProvider = ({ children }) => {
  const { apiFns } = use(ConfigContext)

  const [references, setReferences] = useState([])

  const addReference = useCallback(
    async referenceData => {
      const createdReference = await apiFns.apiPayload(createReference, referenceData)
      const addedReference = await updateReferenceConcepts(createdReference, referenceData, apiFns)
      setReferences(prev => [...prev, addedReference])
    },
    [apiFns]
  )

  const deleteReference = useCallback(
    async reference => {
      const emptyReference = { ...reference, concepts: [] }
      await updateReferenceConcepts(reference, emptyReference, apiFns)
      await apiFns.apiPayload(removeReference, reference.id)
      setReferences(prev => prev.filter(reference => reference.id !== reference.id))
    },
    [apiFns]
  )

  const editReference = useCallback(
    async (oldReference, newReference) => {
      const updatedFieldsReference = await updateReferenceFields(oldReference, newReference, apiFns)
      const updatedReference = await updateReferenceConcepts(
        updatedFieldsReference,
        newReference,
        apiFns
      )
      setReferences(prev =>
        prev.map(reference => (reference.id === oldReference.id ? updatedReference : reference))
      )
    },
    [apiFns]
  )

  useEffect(() => {
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
