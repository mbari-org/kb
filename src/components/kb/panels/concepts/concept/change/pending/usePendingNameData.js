import { use, useEffect, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import {
  hasRelatedData,
  relatedDataCounts,
} from '@/components/kb/panels/concepts/concept/change/staged/name/relatedDataCounts'

const usePendingNameData = pendingName => {
  const { apiFns } = use(ConfigContext)
  const { getReferences } = use(PanelDataContext)

  const [nameData, setNameData] = useState(null)

  useEffect(() => {
    if (!pendingName) return

    let cancelled = false
    relatedDataCounts({
      apiFns,
      concept: { name: pendingName.newValue },
      getReferences,
      renamedFrom: pendingName.oldValue,
    }).then(counts => {
      if (!cancelled) {
        setNameData({ counts, hasRelatedData: hasRelatedData(counts) })
      }
    })
    return () => {
      cancelled = true
    }
  }, [apiFns, getReferences, pendingName])

  return nameData
}

export default usePendingNameData
