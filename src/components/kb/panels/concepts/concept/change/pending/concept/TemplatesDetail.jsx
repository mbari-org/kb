import { Stack, Typography } from '@mui/material'

import TemplateDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/TemplateDetail'
import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import PendingGroup from '@/components/kb/panels/concepts/concept/change/pending/PendingGroup'

import usePendingGroupApproval from '@/contexts/panels/concepts/pending/usePendingGroupApproval'

import { otherApprovalSx } from '@/components/common/format'

import { isPendingTemplate } from '@/lib/kb/state/templates'

import { PENDING } from '@/lib/kb/constants/pending.js'

const { TEMPLATES } = PENDING.GROUP

const TemplatesDetail = ({ pendingConcept }) => {
  const pendingTemplates = pendingConcept.filter(isPendingTemplate)

  const approval = usePendingGroupApproval(TEMPLATES)
  const templatesSx = otherApprovalSx(approval)

  if (pendingTemplates.length === 0) {
    return null
  }

  const pendingGroupTitle = (
    <>
      <PendingButtons approval={approval} group={TEMPLATES} />
      <Typography sx={templatesSx}>Templates</Typography>
    </>
  )

  const pendingGroupDetail = (
    <Stack direction='column' spacing={1}>
      {pendingTemplates.map(pendingTemplate => (
        <TemplateDetail key={pendingTemplate.id} pendingTemplate={pendingTemplate} />
      ))}
    </Stack>
  )

  return (
    <PendingGroup pendingGroupTitle={pendingGroupTitle} pendingGroupDetail={pendingGroupDetail} />
  )
}

export default TemplatesDetail
