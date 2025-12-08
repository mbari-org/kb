import { RESETTING } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const { RESET } = CONCEPT_STATE

const resettingAll = confirmReset => {
  if (!confirmReset) return RESETTING.EXTENT.NONE
  if (confirmReset.type === RESET.TO_INITIAL) return RESETTING.EXTENT.ME

  return null
}

const resettingGroup = (confirmReset, group) => {
  const resetAll = resettingAll(confirmReset)
  if (resetAll) return resetAll

  if (confirmReset.type === RESET[group.toUpperCase()]) return RESETTING.EXTENT.ME

  return RESETTING.EXTENT.OTHER
}

const resettingItem = (confirmReset, group, index) => {
  const resetGroup = resettingGroup(confirmReset, group)
  if (resetGroup === RESETTING.EXTENT.ME) {
    return confirmReset.update?.index === index ? RESETTING.EXTENT.ME : RESETTING.EXTENT.OTHER
  }

  return resetGroup
}

const resettingChild = (confirmReset, index) => {
  if (!confirmReset) return RESETTING.EXTENT.NONE
  if (confirmReset.type === RESET.TO_INITIAL) return RESETTING.EXTENT.ME

  if (confirmReset.type === RESET.CHILDREN) return RESETTING.EXTENT.ME
  if (confirmReset.type === RESET.CHILD && confirmReset.index === index) return RESETTING.EXTENT.ME

  return RESETTING.EXTENT.OTHER
}

const resettingField = (confirmReset, field) => {
  if (!confirmReset) return RESETTING.EXTENT.NONE
  if (confirmReset.type === RESET.TO_INITIAL) return RESETTING.EXTENT.ME

  if (confirmReset.type !== RESET.FIELD) return RESETTING.EXTENT.OTHER
  if (confirmReset.update?.field === field) return RESETTING.EXTENT.ME

  // nameChange legacy handled removed

  if (field === 'rankLevel' && confirmReset.update?.field === 'rankName') return RESETTING.EXTENT.ME
  if (field === 'rankName' && confirmReset.update?.field === 'rankLevel') return RESETTING.EXTENT.ME

  return RESETTING.EXTENT.OTHER
}

const resettingMedia = (confirmReset, index) => {
  if (!confirmReset) return RESETTING.EXTENT.NONE
  if (confirmReset.type === RESET.TO_INITIAL) return RESETTING.EXTENT.ME

  if (confirmReset.type === RESET.MEDIA) return RESETTING.EXTENT.ME
  if (confirmReset.type === RESET.MEDIA && confirmReset.update?.groupIndex === index)
    return RESETTING.EXTENT.ME

  return RESETTING.EXTENT.OTHER
}

const resettingRealization = (confirmReset, index) => {
  if (!confirmReset) return RESETTING.EXTENT.NONE
  if (confirmReset.type === RESET.TO_INITIAL) return RESETTING.EXTENT.ME

  if (confirmReset.type === RESET.REALIZATIONS) return RESETTING.EXTENT.ME
  if (confirmReset.type === RESET.REALIZATION && confirmReset.update?.groupIndex === index)
    return RESETTING.EXTENT.ME

  return RESETTING.EXTENT.OTHER
}

const isStagedAction = action =>
  action !== CONCEPT_STATE.NO_ACTION && !action.toLowerCase().startsWith('pending')

export {
  isStagedAction,
  resettingChild,
  resettingField,
  resettingGroup,
  resettingItem,
  resettingMedia,
  resettingRealization,
}
