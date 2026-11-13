import { use } from 'react'
import { Box, Stack } from '@mui/material'

import ModalActionText from '@/components/common/ModalActionText'

import PendingConceptItem from '@/components/kb/panels/concepts/concept/change/pending/concept/PendingConceptItem'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { pendingChild as getPendingChild } from '@/lib/model/history'

import { PENDING } from '@/lib/constants/pending.js'
import CONFIG from '@/lib/config'

import { isEmpty } from '@/lib/utils'

const { MODALS } = CONFIG.PANELS.CONCEPTS

const PendingContent = () => {
  const { concept, pending } = use(ConceptContext)
  const { setModal } = use(ConceptModalContext)

  const pendingConcept = pending(PENDING.DATA.CONCEPT)
  const pendingParent = pending(PENDING.DATA.PARENT)

  const pendingChild = getPendingChild(pendingParent, concept.name)
  if (pendingChild) {
    pendingChild.parent = concept.parent
  }

  if (isEmpty(pendingConcept) && !pendingChild) {
    setModal(null)
    return null
  }

  const pendingItems = [...pendingConcept, ...(pendingChild ? [pendingChild] : [])].sort(
    (a, b) => new Date(a.creationTimestamp) - new Date(b.creationTimestamp)
  )

  return (
    <Stack direction='column' spacing={1}>
      <ModalActionText text={MODALS.PENDING.DESCRIPTION} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: '60vh', overflowY: 'auto', pr: 1 }}>
        {pendingItems.map(item => (
          <PendingConceptItem key={item.id} item={item} />
        ))}
      </Box>
    </Stack>
  )
}

export default PendingContent
