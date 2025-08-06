import { Stack, Typography } from '@mui/material'

import AliasDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/AliasDetail'
import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import PendingGroup from '@/components/kb/panels/concepts/concept/change/pending/PendingGroup'

import usePendingGroupApproval from '@/contexts/panels/concepts/pending/usePendingGroupApproval'

import { otherApprovalSx } from '@/components/common/format'

import { isPendingAlias } from '@/lib/kb/state/aliases'

import { PENDING } from '@/lib/constants'

const { ALIASES } = PENDING.GROUP

const AliasesDetail = ({ pendingConcept }) => {
  const pendingAliases = pendingConcept.filter(isPendingAlias)

  const approval = usePendingGroupApproval(ALIASES)
  const aliasesSx = otherApprovalSx(approval)

  if (pendingAliases.length === 0) {
    return null
  }

  const pendingGroupTitle = (
    <>
      <PendingButtons approval={approval} group={ALIASES} />
      <Typography sx={aliasesSx}>Aliases</Typography>
    </>
  )

  const pendingGroupDetail = (
    <Stack direction='column' spacing={1}>
      {pendingAliases.map(pendingAlias => (
        <AliasDetail key={pendingAlias.id} pendingAlias={pendingAlias} />
      ))}
    </Stack>
  )

  return (
    <PendingGroup pendingGroupTitle={pendingGroupTitle} pendingGroupDetail={pendingGroupDetail} />
  )
}

export default AliasesDetail
