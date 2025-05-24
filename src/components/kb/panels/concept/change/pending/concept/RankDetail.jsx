import FieldDetail from '@/components/kb/panels/concept/change/pending/concept/FieldDetail'

const RankDetail = ({ pendingField }) => {
  const pendingRanks = [...(pendingField('RankLevel') || []), ...(pendingField('RankName') || [])]

  const pendingFieldApproval = pending =>
    pendingRanks.some(pendingRank => pendingRank.id === pending)

  if (pendingRanks.length === 0) {
    return null
  }

  return (
    <>
      {pendingRanks.map(pendingRank => (
        <FieldDetail
          key={pendingRank.id}
          pendingField={pendingRank}
          pendingFieldApproval={pendingFieldApproval}
        />
      ))}
    </>
  )
}

export default RankDetail
