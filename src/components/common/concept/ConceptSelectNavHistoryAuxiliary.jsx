import { Stack } from '@mui/material'

import ConceptSelectAuxiliary from '@/components/common/concept/ConceptSelectAuxiliary'
import NavHistoryLinks from '@/components/common/NavHistoryLinks'

import CONFIG from '@/text'

const ConceptSelectNavHistoryAuxiliary = ({ concepts, disabled = false, left, rightPrefix }) => {
  return (
    <ConceptSelectAuxiliary
      disabled={disabled}
      label={CONFIG.CONCEPT.SELECT.CONCEPT}
      left={left}
      right={
        <Stack direction='row' alignItems='center'>
          {rightPrefix}
          <NavHistoryLinks history={concepts} />
        </Stack>
      }
    />
  )
}

export default ConceptSelectNavHistoryAuxiliary