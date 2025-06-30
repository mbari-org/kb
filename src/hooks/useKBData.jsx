import { use } from 'react'

import PanelDataContext from '@/contexts/panels/PanelDataContext'

const useKBData = () => {
  return use(PanelDataContext)
}

export default useKBData
