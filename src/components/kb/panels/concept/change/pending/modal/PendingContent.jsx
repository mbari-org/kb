import { use, useMemo } from 'react'
import { Stack } from '@mui/material'

import AliasesDetail from '@/components/kb/panels/concept/change/pending/concept/AliasesDetail'
import ChildDetail from '@/components/kb/panels/concept/change/pending/concept/ChildDetail'
import ChildrenDetail from '@/components/kb/panels/concept/change/pending/concept/ChildrenDetail'
import MediaDetail from '@/components/kb/panels/concept/change/pending/concept/MediaDetail'
import NameDetail from '@/components/kb/panels/concept/change/pending/concept/NameDetail'
import ParentDetail from '@/components/kb/panels/concept/change/pending/concept/ParentDetail'
import RankDetail from '@/components/kb/panels/concept/change/pending/concept/RankDetail'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import useConceptPending from '@/contexts/concept/pending/useConceptPending'

import { fieldPending, pendingChild as getPendingChild } from '@/lib/kb/model/history'

import { isEmpty } from '@/lib/util'

const PendingContent = () => {
  const { concept } = use(ConceptContext)
  const { setModal } = use(ModalContext)

  const conceptPending = useConceptPending(concept.name)
  const parentPending = useConceptPending(concept.parent)

  const pendingField = useMemo(() => field => fieldPending(conceptPending, field), [conceptPending])

  const pendingChild = useMemo(
    () => (conceptPending.length === 0 ? getPendingChild(parentPending, concept.name) : null),
    [concept.name, conceptPending, parentPending]
  )

  if (isEmpty(conceptPending) && !pendingChild) {
    setModal(null)
    return null
  }

  return pendingChild ? (
    <ChildDetail pendingChild={pendingChild} />
  ) : (
    <Stack direction='column' spacing={1}>
      <AliasesDetail pendingField={pendingField} />
      <ChildrenDetail pendingField={pendingField} />
      <MediaDetail pendingField={pendingField} />
      <NameDetail pendingField={pendingField} />
      <ParentDetail pendingField={pendingField} />
      <RankDetail pendingField={pendingField} />
    </Stack>
  )
}

export default PendingContent
