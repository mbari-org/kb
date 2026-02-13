import { generalStateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { CONCEPT } from '@/lib/constants'

import { isJsonEqual } from '@/lib/utils'

const VALUE_MODIFICATION_CHECKS = [
  (initial, staged) =>
    !isJsonEqual(initial?.[CONCEPT.FIELD.DELETE], staged?.[CONCEPT.FIELD.DELETE]),
]

const anyValueModified = (initial, staged) =>
  VALUE_MODIFICATION_CHECKS.some(check => check(initial, staged))

const initialState = (concept, field, fieldValue) => {
  const { [field]: conceptValue } = concept
  const value = fieldValue ?? conceptValue
  return {
    [field]: value,
  }
}

const editValue = ({ stagedState, update }) => {
  const { field, value } = update
  return { ...stagedState, [field]: value }
}

const isModified = (initial, staged) => anyValueModified(initial, staged)

const stateUpdates = (initial, staged) =>
  generalStateUpdates(CONCEPT.FIELD.DELETE, initial, staged)

export { anyValueModified, editValue, initialState, isModified, stateUpdates }
