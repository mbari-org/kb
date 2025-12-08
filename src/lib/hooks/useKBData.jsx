import { use } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

const useKBData = () => {
  return use(PanelDataContext)
}

export default useKBData
