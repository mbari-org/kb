import { Box } from '@mui/material'

import ReferencesHeader from '@/components/kb/panels/references/ReferencesHeader'
import ReferencesTable from '@/components/kb/panels/references/ReferencesTable'

import useReferences from '@/components/kb/panels/references/useReferences'

const References = () => {
  const { references, addReference } = useReferences()

  return (
    <Box>
      <ReferencesHeader onAdd={addReference} />
      <ReferencesTable references={references} />
    </Box>
  )
}

export default References
