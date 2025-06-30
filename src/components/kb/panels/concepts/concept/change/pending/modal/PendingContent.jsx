import { use, useMemo } from 'react'
import { Stack } from '@mui/material'

import AliasesDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/AliasesDetail'
import ChildDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/ChildDetail'
import ChildrenDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/ChildrenDetail'
import MediaDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/MediaDetail'
import NameDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/NameDetail'
import ParentDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/ParentDetail'
import RankDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/RankDetail'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/modal/ConceptModalContext'

import useConceptPending from '@/contexts/panels/concepts/pending/useConceptPending'

import { fieldPending, pendingChild as getPendingChild } from '@/lib/kb/model/history'

import { isEmpty } from '@/lib/utils'

const PendingContent = () => {
  const { concept } = use(ConceptContext)
  const { setModal } = use(ConceptModalContext)

  const conceptPending = useConceptPending(concept.name)
  const parentPending = useConceptPending(concept.parent)

  const pendingField = useMemo(() => field => fieldPending(conceptPending, field), [conceptPending])

  const pendingChild = getPendingChild(parentPending, concept.name)

  if (isEmpty(conceptPending) && !pendingChild) {
    setModal(null)
    return null
  }

  return (
    <Stack direction='column' spacing={1}>
      {pendingChild && (
        <ChildDetail pendingChild={pendingChild} leftMargin={{ title: 0, detail: 8 }} />
      )}
      <AliasesDetail pendingField={pendingField} />
      <ChildrenDetail pendingField={pendingField} leftMargin={{ title: 3.5, detail: 11.5 }} />
      <MediaDetail pendingField={pendingField} />
      <NameDetail pendingField={pendingField} />
      <ParentDetail pendingField={pendingField} />
      <RankDetail pendingField={pendingField} />
    </Stack>
  )
}

export default PendingContent
