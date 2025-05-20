import { use, useMemo } from 'react'
import { Stack } from '@mui/material'

import AliasesDetail from '@/components/kb/panels/concept/change/pending/concept/AliasesDetail'
import ChildDetail from '@/components/kb/panels/concept/change/pending/concept/ChildDetail'
import ChildrenDetail from '@/components/kb/panels/concept/change/pending/concept/ChildrenDetail'
import MediaDetail from '@/components/kb/panels/concept/change/pending/concept/MediaDetail'
import NameDetail from '@/components/kb/panels/concept/change/pending/concept/NameDetail'
import RankDetail from '@/components/kb/panels/concept/change/pending/concept/RankDetail'

import ConceptContext from '@/contexts/concept/ConceptContext'

import useConceptPending from '@/contexts/concept/pending/useConceptPending'

import { fieldPending, isPendingChild } from '@/lib/kb/model/history'

const PendingContent = () => {
  const { concept } = use(ConceptContext)

  const conceptPending = useConceptPending(concept.name)
  const parentPending = useConceptPending(concept.parent)

  const pendingField = useMemo(() => field => fieldPending(conceptPending, field), [conceptPending])

  const pendingChild =
    conceptPending.length === 0 && isPendingChild(parentPending, concept.name)
      ? parentPending[0]
      : null

  return pendingChild ? (
    <ChildDetail pendingChild={pendingChild} />
  ) : (
    <Stack direction='column' spacing={1}>
      <AliasesDetail pendingField={pendingField} />
      <ChildrenDetail pendingField={pendingField} />
      <MediaDetail pendingField={pendingField} />
      <NameDetail pendingField={pendingField} />
      <RankDetail pendingField={pendingField} />
    </Stack>
  )
}

export default PendingContent
