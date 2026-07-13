import Box from '@mui/material/Box'
import ConceptSelectAuxiliary from '@/components/common/concept/ConceptSelectAuxiliary'
import NavHistoryLinks from '@/components/common/NavHistoryLinks'

import CONFIG from '@/text'

const ConceptNavAuxiliary = ({ concepts, disabled = false }) => {
  return (
    <ConceptSelectAuxiliary
      disabled={disabled}
      label={CONFIG.CONCEPT.SELECT.CONCEPT}
      components={[
        null,
        <Box key='nav-history-links' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <NavHistoryLinks history={concepts} />
        </Box>,
      ]}
    />
  )
}

export default ConceptNavAuxiliary
