import { use, useCallback, useEffect, useState } from 'react'

import { getReferences as getReferencesApi } from '@/lib/api/references'

import ConfigContext from '@/contexts/config/ConfigContext'
import ModalContext from '@/contexts/modal/ModalContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import { createReference } from '@/lib/kb/model/reference'

import useModifyReferences from './useModifyReferences'

import { PAGINATION } from '@/lib/constants'

export const ReferencesProvider = ({ children }) => {
  const { apiFns } = use(ConfigContext)
  const { setProcessing } = use(ModalContext)

  const [references, setReferences] = useState([])

  const { addReference, editReference, deleteReference } = useModifyReferences({
    setReferences,
  })

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
