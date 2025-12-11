import { use } from 'react'
import { Box, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import AliasActionIcon from '@/components/kb/panels/concepts/concept/change/staged/aliases/AliasActionIcon'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

import useConceptDetailStyle from '@/components/kb/panels/concepts/concept/change/staged/useConceptDetailStyle'

import { stagedBorder } from '@/lib/concept/state/staged'

import CONFIG from '@/config'

const ALIASES = CONFIG.PANELS.CONCEPTS.ALIASES

const ConceptAlias = ({ alias }) => {
  const theme = useTheme()

  const { isEditing } = use(ConceptContext)

  const detailStyle = useConceptDetailStyle('aliases')

  if (!alias) {
    return null
  }

  const infoStyle = {
    ...detailStyle,
    disabled: true,
    variant: 'standard',
  }

  const border = stagedBorder({
    noActionBorderColor: 'none',
    stagedItem: alias,
    theme,
    width: '2px',
  })

  const showEdit = isEditing && !alias.historyId && alias.action !== CONCEPT_STATE.ALIAS.DELETE
  const showDelete = isEditing && !alias.historyId && alias.action !== CONCEPT_STATE.ALIAS.ADD

  const aliasIcon = action => {
    return <AliasActionIcon action={action} aliasIndex={alias.index} size={20} />
  }

  return (
    <Stack alignItems='center' direction='row' spacing={1} width='100%' sx={{ border, ml: -1 }}>
      <Stack direction='column' spacing={-0.5}>
        {showEdit && aliasIcon(CONCEPT_STATE.ALIAS.EDIT)}
        {showDelete && aliasIcon(CONCEPT_STATE.ALIAS.DELETE)}
      </Stack>
      <Stack direction='row' spacing={1} width='100%'>
        <Box sx={{ flex: 1.5, pl: 0 }}>
          <TextField {...infoStyle} label={ALIASES.NAME} value={alias.name || ''} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField {...infoStyle} label={ALIASES.AUTHOR} value={alias.author || ''} />
        </Box>
        <Box sx={{ width: 90, flexShrink: 0 }}>
          <TextField {...infoStyle} label={ALIASES.TYPE} value={alias.nameType || ''} />
        </Box>
      </Stack>
    </Stack>
  )
}

export default ConceptAlias
