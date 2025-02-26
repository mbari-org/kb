import { use } from 'react'

import { IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { MdOutlinePlaylistAdd } from 'react-icons/md'

import ConceptContext from '@/contexts/concept/ConceptContext'
import useAddAlias from './useAddAlias'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'

const AliasAdd = () => {
  const theme = useTheme()

  const { modifyConcept } = use(ConceptContext)

  const addAlias = useAddAlias()

  return (
    <IconButton
      color='main'
      onClick={addAlias}
      sx={{
        '&:hover': {
          ...theme.kb.icon.hover,
        },
        backgroundColor: theme.palette.background.paper,
        mb: 1,
      }}
    >
      <MdOutlinePlaylistAdd />
    </IconButton>
  )
}

export default AliasAdd
