import ItemReset from '@/components/kb/panels/concepts/concept/change/staged/reset/ItemReset'
import StagedItem from '@/components/kb/panels/concepts/concept/change/staged/StagedItem'

import StagedAliasDetail from './StagedAliasDetail'
import StagedAliasHeader from './StagedAliasHeader'

import { RESETTING } from '@/lib/constants'

const StagedAlias = ({ disabled, initialAlias, stagedAlias }) => {
  const itemDetail = () => (
    <StagedAliasDetail initialAlias={initialAlias} stagedAlias={stagedAlias} />
  )

  const itemHeader = () => (
    <StagedAliasHeader initialAlias={initialAlias} stagedAlias={stagedAlias} />
  )

  const itemReset = () => (
    <ItemReset
      group={RESETTING.GROUP.ALIASES}
      initialItem={initialAlias}
      stagedItem={stagedAlias}
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

export default StagedAlias
