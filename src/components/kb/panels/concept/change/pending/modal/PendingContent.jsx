import { use, useMemo } from 'react'
import { Stack } from '@mui/material'

import AliasesDetail from '@/components/kb/panels/concept/change/pending/concept/AliasesDetail'
import ChildrenDetail from '@/components/kb/panels/concept/change/pending/concept/ChildrenDetail'
import MediaDetail from '@/components/kb/panels/concept/change/pending/concept/MediaDetail'
import NameDetail from '@/components/kb/panels/concept/change/pending/concept/NameDetail'
import FieldDetail from '@/components/kb/panels/concept/change/pending/concept/FieldDetail'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { fieldPendingHistory } from '@/lib/kb/model/history'

const PendingContent = () => {
  const { pendingHistory } = use(ConceptContext)

  const pendingChange = useMemo(
    () => field => {
      const pending = fieldPendingHistory(pendingHistory, field)
      return pending.length > 0 ? pending : null
    },
    [pendingHistory]
  )

  const pendingAliases = pendingChange('ConceptName')
  const pendingChildren = pendingChange('Concept')
  const pendingMedia = pendingChange('Media')
  const pendingNameChange = pendingChange('NameChange')
  const pendingRankChanges = [
    ...(pendingChange('RankLevel') || []),
    ...(pendingChange('RankName') || []),
  ]

  return (
    <Stack direction='column' spacing={1}>
      {pendingAliases && <AliasesDetail pendingAliases={pendingAliases} />}
      {pendingChildren && <ChildrenDetail pendingChildren={pendingChildren} />}
      {pendingMedia && <MediaDetail pendingMedia={pendingMedia} />}
      {pendingNameChange && <NameDetail pendingNameChange={pendingNameChange} />}
      {pendingRankChanges.map(pendingRankChange => (
        <FieldDetail key={pendingRankChange.id} pendingField={pendingRankChange} />
      ))}
    </Stack>
  )
}

export default PendingContent
