import { use, useState, useMemo } from 'react'
import { Box } from '@mui/material'

import ReferencesHeader from '@/components/kb/panels/references/ReferencesHeader'
import ReferencesTable from '@/components/kb/panels/references/ReferencesTable'

import ReferencesProvider from '@/contexts/references/ReferencesProvider'
import ReferencesContext from '@/contexts/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

const ReferencesContent = () => {
  const { references } = use(ReferencesContext)
  const { selected } = use(SelectedContext)
  const [byConcept, setByConcept] = useState(false)

  const filteredReferences = useMemo(() => {
    if (!byConcept || !selected.concept) {
      return references
    }
    return references.filter(ref => ref.concepts.includes(selected.concept))
  }, [references, byConcept, selected.concept])

  return (
    <Box>
      <ReferencesHeader byConcept={byConcept} setByConcept={setByConcept} />
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
