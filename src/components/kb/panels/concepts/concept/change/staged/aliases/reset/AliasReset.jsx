import StagedReset from '@/components/kb/panels/concepts/concept/change/staged/StagedReset'

import { aliasResetting } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT_STATE } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const AliasReset = ({ index }) => {
  return (
    <StagedReset
      index={index}
      resettingFunction={aliasResetting}
      collectionKey='aliases'
      resetAllType={RESET.ALIASES}
      resetItemType={RESET.ALIAS_ITEM}
    />
  )
}

export default AliasReset
