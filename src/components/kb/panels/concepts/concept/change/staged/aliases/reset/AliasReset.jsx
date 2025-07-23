import StagedReset from '@/components/kb/panels/concepts/concept/change/staged/StagedReset'

import { resettingAlias } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT_STATE } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const AliasReset = ({ index }) => {
  return (
    <StagedReset
      group='aliases'
      index={index}
      resetGroupType={RESET.GROUP.ALIASES}
      resetItemType={RESET.ALIAS}
      resettingFunction={resettingAlias}
    />
  )
}

export default AliasReset
