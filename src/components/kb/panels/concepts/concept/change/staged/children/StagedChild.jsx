import StagedChildDetail from './StagedChildDetail'
import StagedChildHeader from './StagedChildHeader'

import StagedItem from '@/components/kb/panels/concepts/concept/change/staged/StagedItem'
import StagedItemReset from '@/components/kb/panels/concepts/concept/change/staged/reset/StagedItemReset'

import { RESETTING } from '@/lib/constants'

const StagedChild = ({ initialItem, resetting, stagedItem }) => {
  const group = RESETTING.CHILDREN

  const itemDetail = () => <StagedChildDetail initialChild={initialItem} stagedChild={stagedItem} />
  const itemHeader = () => <StagedChildHeader initialChild={initialItem} stagedChild={stagedItem} />
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

export default StagedChild
