import { use, useEffect, useRef, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import {
  hasRelatedData,
  relatedDataCounts,
} from '@/components/kb/panels/concepts/concept/change/staged/name/relatedDataCounts'

const useHasRelatedData = conceptName => {
  const { apiFns } = use(ConfigContext)
  const { getReferences } = use(PanelDataContext)

  const [hasData, setHasData] = useState(false)

  const getReferencesRef = useRef(getReferences)
  useEffect(() => {
    getReferencesRef.current = getReferences
  }, [getReferences])

  useEffect(() => {
    if (!conceptName) return

    let cancelled = false
    relatedDataCounts({ apiFns, concept: { name: conceptName }, getReferences: getReferencesRef.current }).then(counts => {
      if (!cancelled) {
        setHasData(hasRelatedData(counts))
      }
    })
    return () => {
      cancelled = true
    }
  }, [apiFns, conceptName])

  return hasData
}

export default useHasRelatedData
