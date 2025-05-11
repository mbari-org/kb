import { use } from 'react'
import { Box, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import AliasDelete from '@/components/kb/panels/concept/detail/aliases/delete/AliasDelete'
import AliasEdit from '@/components/kb/panels/concept/detail/aliases/edit/AliasEdit'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

import useConceptDetailStyle from '@/components/kb/panels/concept/detail/useConceptDetailStyle'

import { fieldPendingHistory } from '@/lib/kb/model/history'

import { fieldBorder } from '@/lib/kb/model/field'

const ConceptAlias = ({ alias }) => {
  const theme = useTheme()

  const { editing, pendingHistory, stagedState } = use(ConceptContext)

  const aliasPendingHistory = fieldPendingHistory(pendingHistory, 'ConceptName')

  const detailStyle = useConceptDetailStyle('aliases')
  const infoStyle = {
    ...detailStyle,
    disabled: true,
    variant: 'standard',
  }

  const border = fieldBorder({
    itemPendingHistory: aliasPendingHistory,
    noActionBorderColor: 'none',
    stagedItem: alias,
    theme,
    width: '2px',
  })

  if (!alias) {
    return null
  }

  const showEdit = editing && !alias.historyId && alias.action !== CONCEPT_STATE.ALIAS.DELETE
  const showDelete = editing && !alias.historyId && alias.action !== CONCEPT_STATE.ALIAS.ADD

  return (
    <Stack alignItems='center' direction='row' spacing={1} width='100%' sx={{ border }}>
      <Stack direction='column' spacing={-0.5}>
        {showEdit && <AliasEdit aliasIndex={alias.index} />}
        {showDelete && <AliasDelete aliasIndex={alias.index} />}
      </Stack>
      <Stack direction='row' spacing={1} width='100%'>
        <Box flex={1} sx={{ pl: 1 }}>
          <TextField {...infoStyle} label='Name' value={alias.name} />
        </Box>
        <Box flex={1}>
          <TextField {...infoStyle} label='Author' value={alias.author} />
        </Box>
        <Box flex={0.5}>
          <TextField {...infoStyle} label='Type' value={alias.nameType} />
        </Box>
      </Stack>
    </Stack>
  )
}

export default ConceptAlias
