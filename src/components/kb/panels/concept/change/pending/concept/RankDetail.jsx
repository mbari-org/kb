import { use, useMemo } from 'react'

import FieldDetail from '@/components/kb/panels/concept/change/pending/concept/FieldDetail'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL

const RankDetail = ({ pendingField }) => {
  const { confirmPending } = use(ConceptContext)

  const pendingRanks = [...(pendingField('RankLevel') || []), ...(pendingField('RankName') || [])]

  const approval = useMemo(() => {
    if (!confirmPending) {
      return null
    }
    if (confirmPending?.pending === 'RankLevel' || confirmPending?.pending === 'RankName') {
      return confirmPending.approval
    }
    return OTHER
  }, [confirmPending])

  if (pendingRanks.length === 0) {
    return null
  }

  return (
    <>
      {pendingRanks.map(pendingRank => (
        <FieldDetail key={pendingRank.id} pendingField={pendingRank} />
      ))}
    </>
  )
}

export default RankDetail
