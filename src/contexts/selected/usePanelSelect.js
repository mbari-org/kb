import panelMods from '@/components/kb/panels/modules'
import useHistorySelect from '@/contexts/selected/useHistorySelect'
import { STORE } from '@/lib/constants'
import { useMemo } from 'react'

const usePanelSelect = onCurrentChange => {
  const defaultPanel = useMemo(() => panelMods[0].name, [])

  return useHistorySelect(
    STORE.PANEL.MAX_SIZE,
    defaultPanel,
    onCurrentChange
  )
}

export default usePanelSelect
