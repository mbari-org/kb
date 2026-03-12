import panelMods from '@/components/kb/panels/modules'
import useHistorySelection from '@/contexts/selected/useHistorySelection'
import { useMemo } from 'react'

const usePanelSelection = onCurrentChange => {
  const defaultPanel = useMemo(() => panelMods[0].name, [])

  return useHistorySelection(defaultPanel, onCurrentChange)
}

export default usePanelSelection
