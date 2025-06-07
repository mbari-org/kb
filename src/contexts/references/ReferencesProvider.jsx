import { use, useCallback, useEffect, useState, useMemo } from 'react'

import {
  createReference as createReferenceApi,
  deleteReference as removeReference,
  getReferences,
} from '@/lib/api/references'

import ConfigContext from '@/contexts/config/ConfigContext'
import ReferencesContext from '@/contexts/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import { createReference } from '@/lib/kb/model/reference'

import updateReferenceFields from '@/contexts/config/updateReferenceFields'
import updateReferenceConcepts from '@/contexts/config/updateReferenceConcepts'

export const ReferencesProvider = ({ children }) => {
  const { apiFns } = use(ConfigContext)
  const { getSelected } = use(SelectedContext)

  const selectedConcept = getSelected('concept')

  const [references, setReferences] = useState([])
  const [byConcept, setByConcept] = useState(false)

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
      const referenceData = await apiFns.apiPaginated(getReferences)
      setReferences(referenceData.map(reference => createReference(reference)))
    }

    loadReferences()
  }, [apiFns])

  const filteredReferences = useMemo(() => {
    if (!byConcept || !selectedConcept) {
      return references
    }
    return references.filter(reference => reference.concepts.includes(selectedConcept))
  }, [references, byConcept, selectedConcept])

  const value = {
    addReference,
    deleteReference,
    editReference,
    references: filteredReferences,
    setByConcept,
  }

  return <ReferencesContext.Provider value={value}>{children}</ReferencesContext.Provider>
}

export default ReferencesProvider
