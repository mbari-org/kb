import StagedItem from '@/components/kb/panels/concepts/concept/change/staged/StagedItem'
import StagedItemReset from '@/components/kb/panels/concepts/concept/change/staged/reset/StagedItemReset'

import StagedRealizationDetail from './StagedRealizationDetail'
import StagedRealizationHeader from './StagedRealizationHeader'

import { RESETTING } from '@/lib/constants'

const StagedRealization = ({ initialItem, resetting, stagedItem }) => {
  const group = RESETTING.REALIZATIONS

  const itemDetail = () => (
    <StagedRealizationDetail initialRealization={initialItem} stagedRealization={stagedItem} />
  )

  const itemHeader = () => (
    <StagedRealizationHeader initialRealization={initialItem} stagedRealization={stagedItem} />
  )

  const itemReset = () => (
    <StagedItemReset group={group} resetting={resetting} stagedItem={stagedItem} />
  )

  return (
    <StagedItem
      ItemDetail={itemDetail}
      ItemHeader={itemHeader}
      ItemReset={itemReset}
      resetting={resetting}
    />
  )
}

export default StagedRealization
