import { use, useCallback } from 'react'

import KBDataContext from '@/contexts/KBDataContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'

import useModifyReferences from './useModifyReferences'

export const ReferencesProvider = ({ children }) => {
  const { references, getConceptReferences, isDoiUnique, refreshData } = use(KBDataContext)

  const { addReference, editReference, deleteReference } = useModifyReferences({
    setReferences: refreshData,
  })

  const value = {
    addReference,
    deleteReference,
    editReference,
    getConceptReferences,
    isDoiUnique,
    references,
  }

  return <ReferencesContext.Provider value={value}>{children}</ReferencesContext.Provider>
}

export default ReferencesProvider
