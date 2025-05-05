import { use, useMemo } from 'react'
import { Box, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import AliasDelete from '@/components/kb/panels/concepts/detail/aliases/delete/AliasDelete'
import AliasEdit from '@/components/kb/panels/concepts/detail/aliases/edit/AliasEdit'

import ConceptContext from '@/contexts/concept/ConceptContext'

import useConceptDetailStyle from '@/components/kb/panels/concepts/detail/useConceptDetailStyle'

import { fieldPendingHistory } from '@/lib/kb/model/history'

import { fieldBorder } from '@/lib/kb/model/field'
import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'

const ConceptAlias = ({ aliasIndex }) => {
  const theme = useTheme()

  const { editing, pendingHistory, stagedState } = use(ConceptContext)

  const aliasPendingHistory = fieldPendingHistory(pendingHistory, 'ConceptName')

  const stagedAlias = useMemo(
    () => ({ ...stagedState.aliases[aliasIndex] }),
    [stagedState.aliases, aliasIndex]
  )

  const detailStyle = useConceptDetailStyle('aliases')
  const infoStyle = {
    ...detailStyle,
    disabled: true,
    variant: 'standard',
  }

  const border = fieldBorder({
    itemPendingHistory: aliasPendingHistory,
    noActionBorderColor: 'none',
    stagedItem: stagedAlias,
    theme,
    width: '2px',
  })

  const showEdit = editing && stagedAlias.action !== CONCEPT_STATE.ALIAS.DELETE

  if (!stagedAlias) {
    return null
  }

  return (
    <Stack alignItems='center' direction='row' spacing={1} width='100%' sx={{ border }}>
      {showEdit && (
        <Stack direction='column' spacing={-0.5}>
          <AliasEdit aliasIndex={aliasIndex} />
          <AliasDelete aliasIndex={aliasIndex} />
        </Stack>
      )}
      <Stack direction='row' spacing={1} width='100%'>
        <Box flex={1}>
          <TextField {...infoStyle} label='Name' value={stagedAlias.name} />
        </Box>
        <Box flex={1}>
          <TextField {...infoStyle} label='Author' value={stagedAlias.author} />
        </Box>
        <Box flex={0.5}>
          <TextField {...infoStyle} label='Type' value={stagedAlias.nameType} />
        </Box>
      </Stack>
    </Stack>
  )
}

export default ConceptAlias
