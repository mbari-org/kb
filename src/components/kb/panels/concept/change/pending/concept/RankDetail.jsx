import FieldDetail from '@/components/kb/panels/concept/change/pending/concept/FieldDetail'

import usePendingApproval from '@/components/kb/panels/concept/change/pending/usePendingApproval'

const RankDetail = ({ pendingField }) => {
  const pendingRanks = [...(pendingField('RankLevel') || []), ...(pendingField('RankName') || [])]

  const approval = usePendingApproval(pending => pending === 'RankLevel' || pending === 'RankName')

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
