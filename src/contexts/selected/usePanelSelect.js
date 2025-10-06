import panelMods from '@/components/kb/panels/modules'
import useHistorySelect from '@/contexts/selected/useHistorySelect'
import { useMemo } from 'react'

const usePanelSelect = onCurrentChange => {
  const defaultPanel = useMemo(() => panelMods[0].name, [])

  return useHistorySelect(
    defaultPanel,
    onCurrentChange
  )
}

export default usePanelSelect
