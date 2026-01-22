import StagedItemReset from '@/components/kb/panels/concepts/concept/change/staged/reset/StagedItemReset'
import StagedItem from '@/components/kb/panels/concepts/concept/change/staged/StagedItem'

import StagedAliasDetail from './StagedAliasDetail'
import StagedAliasHeader from './StagedAliasHeader'

import { CONCEPT } from '@/lib/constants'

const StagedAlias = ({ initialItem, resetting, stagedItem }) => {
  const group = CONCEPT.FIELD.ALIASES

  const itemDetail = () => <StagedAliasDetail initialAlias={initialItem} stagedAlias={stagedItem} />
  const itemHeader = () => <StagedAliasHeader initialAlias={initialItem} stagedAlias={stagedItem} />
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

export default StagedAlias
