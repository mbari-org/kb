import { use } from 'react'

import HistoryContext from './HistoryContext'

import SelectedContext from '@/contexts/selected/SelectedContext'

const HistoryProvider = ({ children }) => {
  const { getSelected } = use(SelectedContext)

  const selectedType = getSelected('history').type

  const value = {
    selectedType,
  }

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
}

export default HistoryProvider
