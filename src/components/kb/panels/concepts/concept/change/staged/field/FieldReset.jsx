import StagedReset from '@/components/kb/panels/concepts/concept/change/staged/StagedReset'

import { resettingField } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT_STATE } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const FieldReset = ({ field }) => {
  return (
    <StagedReset field={field} resettingFunction={resettingField} resetFieldType={RESET.FIELD} />
  )
}

export default FieldReset
