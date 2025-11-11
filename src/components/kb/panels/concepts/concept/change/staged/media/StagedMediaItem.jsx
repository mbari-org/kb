import StagedItemReset from '@/components/kb/panels/concepts/concept/change/staged/reset/StagedItemReset'
import StagedItem from '@/components/kb/panels/concepts/concept/change/staged/StagedItem'

import StagedMediaItemDetail from './StagedMediaItemDetail'
import StagedMediaItemHeader from './StagedMediaItemHeader'

import { RESETTING } from '@/lib/constants/constants'

const StagedMediaItem = ({ initialItem, resetting, stagedItem }) => {
  const group = RESETTING.MEDIA

  const itemDetail = () => <StagedMediaItemDetail initialMediaItem={initialItem} stagedMediaItem={stagedItem} />
  const itemHeader = () => <StagedMediaItemHeader initialMediaItem={initialItem} stagedMediaItem={stagedItem} />
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

export default StagedMediaItem
