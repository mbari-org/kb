import { use } from 'react'

import KBDataContext from '@/contexts/kbData/KBDataContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'

import useModifyReferences from './useModifyReferences'

export const ReferencesProvider = ({ children }) => {
  const { references, refreshData } = use(KBDataContext)

  const { addReference, editReference, deleteReference } = useModifyReferences({
    setReferences: refreshData,
  })

  const value = {
    addReference,
    deleteReference,
    editReference,
    references,
  }

  return <ReferencesContext value={value}>{children}</ReferencesContext>
}

export default ReferencesProvider
