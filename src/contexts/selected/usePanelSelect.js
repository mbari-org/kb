import panelMods from '@/components/kb/panels/modules'
import useHistorySelect from '@/contexts/selected/useHistorySelect'
import { createPanelStore } from '@/lib/store/panelStore'

const usePanelSelect = () => {
  const defaultPanel = panelMods[0].name
  return useHistorySelect(createPanelStore, defaultPanel)
}

export default usePanelSelect
