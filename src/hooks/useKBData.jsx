import { use } from 'react'

import KBDataContext from '@/contexts/kbData/KBDataContext'

const useKBData = () => {
  return use(KBDataContext)
}

export default useKBData
