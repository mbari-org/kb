import { use, useCallback, useEffect, useState } from 'react'

import {
  createReference as createReferenceApi,
  deleteReference as removeReference,
  getReferences,
} from '@/lib/kb/api/references'

import ConfigContext from '@/contexts/config/ConfigContext'
import ReferencesContext from '@/contexts/references/ReferencesContext'
import { createReference } from '@/lib/kb/model/reference'

import updateReferenceFields from '@/contexts/config/updateReferenceFields'
import updateReferenceConcepts from '@/contexts/config/updateReferenceConcepts'

export const ReferencesProvider = ({ children }) => {
  const { apiFns } = use(ConfigContext)

  const [references, setReferences] = useState([])

  const addReference = useCallback(
    async referenceData => {
      const createdReference = await apiFns.apiPayload(createReferenceApi, referenceData)
      const addedReference = await updateReferenceConcepts(createdReference, referenceData, apiFns)
      setReferences(prev => [...prev, createReference(addedReference)])
    },
    [apiFns]
  )

  const deleteReference = useCallback(
    async reference => {
      const emptyReference = { ...reference, concepts: [] }
      await updateReferenceConcepts(reference, emptyReference, apiFns)
      await apiFns.apiPayload(removeReference, reference.id)
      setReferences(prev => prev.filter(r => r.id !== reference.id))
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
        prev.map(r => (r.id === oldReference.id ? createReference(updatedReference) : r))
      )
    },
    [apiFns]
  )

  useEffect(() => {
    const loadReferences = async () => {
      const data = await apiFns.apiPagination(getReferences)
      setReferences(data.map(ref => createReference(ref)))
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
