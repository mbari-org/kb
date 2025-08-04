import { use, useMemo } from 'react'
import { Stack } from '@mui/material'

import ModalActionText from '@/components/common/ModalActionText'

import AliasesDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/AliasesDetail'
import ChildDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/ChildDetail'
import ChildrenDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/ChildrenDetail'
import MediaDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/MediaDetail'
import NameDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/NameDetail'
import ParentDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/ParentDetail'
import RankDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/RankDetail'
import RealizationsDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/RealizationsDetail'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { fieldPending, pendingChild as getPendingChild } from '@/lib/kb/model/history'

import { PENDING } from '@/lib/constants'

import { isEmpty } from '@/lib/utils'

const PendingContent = () => {
  const { concept, pending } = use(ConceptContext)
  const { setModal } = use(ConceptModalContext)

  const pendingConcept = pending(PENDING.DATA.CONCEPT)
  const pendingParent = pending(PENDING.DATA.PARENT)

  const pendingField = useMemo(() => field => fieldPending(pendingConcept, field), [pendingConcept])

  const pendingChild = getPendingChild(pendingParent, concept.name)
  if (pendingChild) {
    pendingChild.parent = concept.parent
  }

  if (isEmpty(pendingConcept) && !pendingChild) {
    setModal(null)
    return null
  }

  return (
    <Stack direction='column' spacing={1}>
      <ModalActionText text='Pending History' />
      {pendingChild && <ChildDetail pendingChild={pendingChild} />}
      <AliasesDetail pendingField={pendingField} />
      {!pendingChild && <ChildrenDetail pendingField={pendingField} />}
      <MediaDetail pendingField={pendingField} />
      <NameDetail pendingField={pendingField} />
      <ParentDetail pendingField={pendingField} />
      <RankDetail pendingConcept={pendingConcept} />
      <RealizationsDetail pendingField={pendingField} />
    </Stack>
  )
}

export default PendingContent
