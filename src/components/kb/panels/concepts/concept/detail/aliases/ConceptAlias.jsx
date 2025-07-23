import { use } from 'react'
import { Box, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import AliasModifyIcon from '@/components/kb/panels/concepts/concept/change/staged/aliases/AliasModifyIcon'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

import useConceptDetailStyle from '@/components/kb/panels/concepts/concept/change/staged/useConceptDetailStyle'

import { stagedBorder } from '@/lib/kb/state/staged'

const ALIAS = CONCEPT_STATE.ALIAS

const ConceptAlias = ({ alias }) => {
  const theme = useTheme()

  const { editing } = use(ConceptContext)

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

  const showEdit = editing && !alias.historyId && alias.action !== ALIAS.DELETE
  const showDelete = editing && !alias.historyId && alias.action !== ALIAS.ADD

  const aliasIcon = action => {
    return <AliasModifyIcon action={action} aliasIndex={alias.index} size={20} />
  }

  return (
    <Stack alignItems='center' direction='row' spacing={1} width='100%' sx={{ border, ml: -1 }}>
      <Stack direction='column' spacing={-0.5}>
        {showEdit && aliasIcon(ALIAS.EDIT)}
        {showDelete && aliasIcon(ALIAS.DELETE)}
      </Stack>
      <Stack direction='row' spacing={1} width='100%'>
        <Box sx={{ flex: 1.5, pl: 0 }}>
          <TextField {...infoStyle} label='Name' value={alias.name || ''} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField {...infoStyle} label='Author' value={alias.author || ''} />
        </Box>
        <Box sx={{ width: 90, flexShrink: 0 }}>
          <TextField {...infoStyle} label='Type' value={alias.nameType || ''} />
        </Box>
      </Stack>
    </Stack>
  )
}

export default ConceptAlias
