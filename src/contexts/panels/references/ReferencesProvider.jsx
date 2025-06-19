import { use, useCallback, useEffect, useState } from 'react'

import {
  createReference as createReferenceApi,
  deleteReference as removeReference,
  getReferences as getReferencesApi,
} from '@/lib/api/references'

import ConfigContext from '@/contexts/config/ConfigContext'
import ModalContext from '@/contexts/modal/ModalContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import { createReference } from '@/lib/kb/model/reference'

import updateReferenceFields from '@/contexts/config/updateReferenceFields'
import updateReferenceConcepts from '@/contexts/config/updateReferenceConcepts'

import { PAGINATION } from '@/lib/constants'

export const ReferencesProvider = ({ children }) => {
  const { apiFns } = use(ConfigContext)
  const { setProcessing } = use(ModalContext)

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

  const getConceptReferences = useCallback(
    concept => {
      return references.filter(reference => reference.concepts.includes(concept))
    },
    [references]
  )

  const isDoiUnique = useCallback(
    (doi, currentId) => {
      if (!doi) return true
      return !references.some(
        reference =>
          reference.id !== currentId && reference.doi?.toLowerCase() === doi.toLowerCase()
      )
    },
    [references]
  )

  useEffect(() => {
    const loadReferences = async () => {
      setProcessing(true)

      const EXPORT_PAGE_SIZE = PAGINATION.REFERENCES.EXPORT_PAGE_SIZE
      let allReferences = []
      let pageIndex = 0
      let hasMoreData = true

      while (hasMoreData) {
        const referenceData = await apiFns.apiPaginated(getReferencesApi, {
          limit: EXPORT_PAGE_SIZE,
          offset: pageIndex * EXPORT_PAGE_SIZE,
        })

        if (!referenceData || referenceData.length === 0) {
          hasMoreData = false
          continue
        }

        allReferences.push(...referenceData)
        pageIndex++
      }

      setReferences(allReferences.map(reference => createReference(reference)))
      setProcessing(false)
    }

    loadReferences()
  }, [apiFns, setProcessing])

  const value = {
    addReference,
    deleteReference,
    editReference,
    getConceptReferences,
    isDoiUnique,
    references,
  }

  return <ReferencesContext.Provider value={value}>{children}</ReferencesContext.Provider>
}

export default ReferencesProvider
