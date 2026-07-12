import { use, useCallback, useState } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { ReferencesModalProvider } from './modal'

import useModifyReferences from './useModifyReferences'
import { CONCEPT } from '@/lib/constants'
import { SELECTED } from '@/lib/constants/selected.js'

export const ReferencesProvider = ({ children }) => {
  const { setReferences } = use(PanelDataContext)
  const { getSelected } = use(SelectedContext)
  const [citationFilter, setCitationFilter] = useState({ concept: null, value: '' })
  const [extentFilter, setExtentFilter] = useState({ concept: null, value: CONCEPT.EXTENT.SOLO })
  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const citationGlob = citationFilter.concept === selectedConcept ? citationFilter.value : ''
  const conceptExtent = extentFilter.concept === selectedConcept ? extentFilter.value : CONCEPT.EXTENT.SOLO

  const setCitationGlob = useCallback(
    value => {
      setCitationFilter({ concept: selectedConcept, value })
    },
    [selectedConcept]
  )
  const setConceptExtent = useCallback(
    value => {
      setExtentFilter({ concept: selectedConcept, value })
    },
    [selectedConcept]
  )

  const { addReference, editReference, deleteReference } = useModifyReferences({
    setReferences,
  })

  const value = {
    addReference,
    citationGlob,
    conceptExtent,
    deleteReference,
    editReference,
    setConceptExtent,
    setCitationGlob,
  }

  return (
    <ReferencesContext value={value}>
      <ReferencesModalProvider>{children}</ReferencesModalProvider>
    </ReferencesContext>
  )
}

export default ReferencesProvider
