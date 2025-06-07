import { use, useMemo } from 'react'
import { Box } from '@mui/material'

import ReferencesHeader from '@/components/kb/panels/references/ReferencesHeader'
import ReferencesTable from '@/components/kb/panels/references/ReferencesTable'

import ReferencesContext from '@/contexts/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

const ReferencesContent = () => {
  const { references } = use(ReferencesContext)
  const { getSelected } = use(SelectedContext)

  const selectedConcept = getSelected('concept')
  const selectedByConcept = getSelected('byConcept')

  const filteredReferences = useMemo(() => {
    if (!selectedByConcept || !selectedConcept) {
      return references
    }
    return references.filter(reference => reference.concepts.includes(selectedConcept))
  }, [references, selectedByConcept, selectedConcept])

  return (
    <Box>
      <ReferencesHeader />
      <ReferencesTable references={filteredReferences} />
    </Box>
  )
}

export default ReferencesContent
