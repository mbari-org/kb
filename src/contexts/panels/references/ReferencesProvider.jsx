import { use, useCallback, useState } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { ReferencesModalProvider } from './modal'

import useModifyReferences from './useModifyReferences'
import { SELECTED } from '@/lib/constants/selected.js'

export const ReferencesProvider = ({ children }) => {
  const { setReferences } = use(PanelDataContext)
  const { getSelected } = use(SelectedContext)
  const [citationFilter, setCitationFilter] = useState({ concept: null, value: '' })
  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const citationGlob = citationFilter.concept === selectedConcept ? citationFilter.value : ''

  const setCitationGlob = useCallback(
    value => {
      setCitationFilter({ concept: selectedConcept, value })
    },
    [selectedConcept]
  )

  const { addReference, editReference, deleteReference } = useModifyReferences({
    setReferences,
  })

  const value = {
    addReference,
    citationGlob,
    deleteReference,
    editReference,
    setCitationGlob,
  }

  return (
    <ReferencesContext value={value}>
      <ReferencesModalProvider>{children}</ReferencesModalProvider>
    </ReferencesContext>
  )
}

export default ReferencesProvider
