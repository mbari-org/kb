import { use, useCallback, useEffect, useState } from 'react'

import { createReference, getReferences, updateReference } from '@/lib/kb/api/references'

import ConfigContext from '@/contexts/config/ConfigContext'

import { PAGINATION } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.REFERENCES.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const useReferences = () => {
  const { apiFns } = use(ConfigContext)

  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(DEFAULT_OFFSET)
  const [references, setReferences] = useState([])

  const loadReferences = useCallback(async () => {
    // const { data } = await apiFns.apiPagination(getReferences, { limit, offset })
    const data = await apiFns.apiPayload(getReferences)

    setReferences(data)
  }, [apiFns])

  useEffect(() => {
    loadReferences()
  }, [loadReferences])

  const addReference = async referenceData => {
    try {
      const newReference = await apiFns.apiResult(createReference, referenceData)
      setReferences([...references, newReference])
    } catch (error) {
      console.error('Error creating reference:', error)
      throw error
    }
  }

  const editReference = async referenceData => {
    try {
      await apiFns.apiResult(updateReference, referenceData)
      await loadReferences() // Refresh the list after updating
    } catch (error) {
      console.error('Error updating reference:', error)
      throw error
    }
  }

  return {
    references,
    addReference,
    editReference,
    limit,
    offset,
    setLimit,
    setOffset,
  }
}

export default useReferences
