import StagedReset from '@/components/kb/panels/concepts/concept/change/staged/StagedReset'

import { resettingAlias } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT_STATE } from '@/lib/constants'

const { GROUP, RESET } = CONCEPT_STATE

const AliasesReset = () => {
  return (
    <StagedReset
      group={GROUP.ALIASES}
      resetGroupType={RESET.GROUP.ALIASES}
      resetItemType={RESET.ALIAS}
      resettingFunction={resettingAlias}
    />
  )
}

export default AliasesReset
