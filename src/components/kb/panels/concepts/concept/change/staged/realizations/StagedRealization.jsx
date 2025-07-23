import StagedItem from '@/components/kb/panels/concepts/concept/change/staged/StagedItem'
import ItemReset from '@/components/kb/panels/concepts/concept/change/staged/reset/ItemReset'

import StagedRealizationDetail from '@/components/kb/panels/concepts/concept/change/staged/realizations/StagedRealizationDetail'
import StagedRealizationHeader from '@/components/kb/panels/concepts/concept/change/staged/realizations/StagedRealizationHeader'

import { RESETTING } from '@/lib/constants'

const StagedRealization = ({ disabled, initialRealization, stagedRealization }) => {
  const itemDetail = () => (
    <StagedRealizationDetail
      initialRealization={initialRealization}
      stagedRealization={stagedRealization}
    />
  )

  const itemHeader = () => (
    <StagedRealizationHeader
      initialRealization={initialRealization}
      stagedRealization={stagedRealization}
    />
  )

  const itemReset = () => (
    <ItemReset
      group={RESETTING.GROUP.REALIZATIONS}
      initialItem={initialRealization}
      stagedItem={stagedRealization}
    />
  )

  return (
    <StagedItem
      disabled={disabled}
      ItemDetail={itemDetail}
      ItemHeader={itemHeader}
      ItemReset={itemReset}
    />
  )
}

export default StagedRealization
