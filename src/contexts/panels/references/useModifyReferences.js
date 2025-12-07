import { use, useCallback } from 'react'

import updateReferenceConcepts from '@/contexts/config/updateReferenceConcepts'
import updateReferenceFields from '@/contexts/config/updateReferenceFields'
import {
  createReference as createReferenceApi,
  getReferences as getReferencesApi,
  deleteReference as removeReference,
} from '@/lib/kb/api/references'

import ConfigContext from '@/contexts/config/ConfigContext'

import { createReference } from '@/lib/kb/model/reference'

import { PAGINATION } from '@/lib/kb/constants/pagination.js'

const { EXPORT_PAGE_SIZE } = PAGINATION.REFERENCES

const useModifyReferences = ({ setReferences }) => {
  const { apiFns } = use(ConfigContext)

  const addReference = useCallback(
    async referenceData => {
      const createdReference = await apiFns.apiPayload(createReferenceApi, referenceData)
      const addedReference = await updateReferenceConcepts(createdReference, referenceData, apiFns)
      setReferences(prev => [...prev, createReference(addedReference)])
    },
    [apiFns, setReferences]
  )

  const deleteReference = useCallback(
    async reference => {
      await apiFns.apiPayload(removeReference, reference.id)
      setReferences(prev => prev.filter(prevReference => prevReference.id !== reference.id))
    },
    [apiFns, setReferences]
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
        prev.map(prevReference =>
          prevReference.id === oldReference.id ? createReference(updatedReference) : prevReference
        )
      )
    },
    [apiFns, setReferences]
  )

  const refreshData = useCallback(async () => {
    let allReferences = []
    let hasMoreData = true
    let pageIndex = 0

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
  }, [apiFns, setReferences])

  return { addReference, editReference, deleteReference, refreshData }
}

export default useModifyReferences
