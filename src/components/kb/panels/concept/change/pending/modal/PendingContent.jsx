import { use, useMemo } from 'react'
import { Stack } from '@mui/material'

import AliasesDetail from '@/components/kb/panels/concept/change/pending/concept/AliasesDetail'
import ChildrenDetail from '@/components/kb/panels/concept/change/pending/concept/ChildrenDetail'
import MediaDetail from '@/components/kb/panels/concept/change/pending/concept/MediaDetail'
import NameDetail from '@/components/kb/panels/concept/change/pending/concept/NameDetail'
import RankDetail from '@/components/kb/panels/concept/change/pending/concept/RankDetail'

import ConceptContext from '@/contexts/concept/ConceptContext'

import useConceptPending from '@/contexts/concept/pending/useConceptPending'

import { fieldPending } from '@/lib/kb/model/history'

const PendingContent = () => {
  const { concept } = use(ConceptContext)

  const conceptPending = useConceptPending(concept)

  const pending = useMemo(() => fieldPending(conceptPending, 'ConceptName'), [conceptPending])

  return (
    <Stack direction='column' spacing={1}>
      <AliasesDetail pending={pending} />
      <ChildrenDetail pending={pending} />
      <MediaDetail pending={pending} />
      <NameDetail pending={pending} />
      <RankDetail pending={pending} />
    </Stack>
  )
}

export default PendingContent
