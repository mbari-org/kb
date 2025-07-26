import StagedChildDetail from './StagedChildDetail'
import StagedChildHeader from './StagedChildHeader'

import StagedItem from '@/components/kb/panels/concepts/concept/change/staged/StagedItem'
import StagedItemReset from '@/components/kb/panels/concepts/concept/change/staged/reset/StagedItemReset'

import { RESETTING } from '@/lib/constants'

const StagedChild = ({ initialChild, resetting, stagedChild }) => {
  const group = RESETTING.CHILDREN

  const itemDetail = () => (
    <StagedChildDetail initialChild={initialChild} stagedChild={stagedChild} />
  )
  const itemHeader = () => (
    <StagedChildHeader initialChild={initialChild} stagedChild={stagedChild} />
  )
  const itemReset = () => (
    <StagedItemReset group={group} resetting={resetting} stagedChild={stagedChild} />
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
