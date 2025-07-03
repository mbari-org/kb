import { use } from 'react'

import PanelDataContext from '@/contexts/panelData/PanelDataContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import { ReferencesModalProvider } from './modal'

import useModifyReferences from './useModifyReferences'

export const ReferencesProvider = ({ children }) => {
  const { references, refreshData } = use(PanelDataContext)

  const { addReference, editReference, deleteReference } = useModifyReferences({
    setReferences: refreshData,
  })

  const value = {
    addReference,
    deleteReference,
    editReference,
    references,
  }

  return (
    <ReferencesContext value={value}>
      <ReferencesModalProvider>{children}</ReferencesModalProvider>
    </ReferencesContext>
  )
}

export default ReferencesProvider
