import { use } from 'react'
import { Box, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { MdOutlineDeleteForever } from 'react-icons/md'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'

const AliasDelete = ({ aliasIndex }) => {
  const theme = useTheme()

  const { editingState, modifyConcept } = use(ConceptContext)

  const alias = editingState.aliases[aliasIndex]
  const showDelete = alias.action !== CONCEPT_STATE.ALIAS_DELETE

  return (
    <Box sx={{ p: 0, m: 0, ml: -1 }}>
      {showDelete ? (
        <IconButton
          onClick={() =>
            modifyConcept({ type: CONCEPT_STATE.ALIAS_DELETE, update: { aliasIndex } })
          }
          color='cancel'
          sx={{
            '&:hover': {
              ...theme.kb.icon.hover,
            },
            backgroundColor: theme.palette.background.paper,
            padding: 0.5,
          }}
        >
          <MdOutlineDeleteForever />
        </IconButton>
      ) : (
        <Box sx={{ width: '40px', height: '40px' }} />
      )}
    </Box>
  )
}

export default AliasDelete
