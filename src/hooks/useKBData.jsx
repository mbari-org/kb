import { use } from 'react'

import PanelDataContext from '@/contexts/panelData/PanelDataContext'

const useKBData = () => {
  return use(PanelDataContext)
}

export default useKBData
