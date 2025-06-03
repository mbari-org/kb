import { use, useMemo } from 'react'
import { Box } from '@mui/material'

import ReferencesHeader from '@/components/kb/panels/references/ReferencesHeader'
import ReferencesTable from '@/components/kb/panels/references/ReferencesTable'

import ReferencesProvider from '@/contexts/references/ReferencesProvider'
import ReferencesContext from '@/contexts/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

const ReferencesContent = () => {
  const { references } = use(ReferencesContext)
  const { selected, select } = use(SelectedContext)

  const filteredReferences = useMemo(() => {
    if (!selected.byConcept || !selected.concept) {
      return references
    }
    return references.filter(ref => ref.concepts.includes(selected.concept))
  }, [references, selected.byConcept, selected.concept])

  return (
    <Box>
      <ReferencesHeader />
      <ReferencesTable references={filteredReferences} />
    </Box>
  )
}

const References = () => {
  return (
    <ReferencesProvider>
      <ReferencesContent />
    </ReferencesProvider>
  )
}

export default References
