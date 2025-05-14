import { CONCEPT_STATE, RESETTING } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const aliasResetting = (confirmReset, index) => {
  if (!confirmReset) return RESETTING.NONE
  if (confirmReset.type === RESET.TO_INITIAL) return RESETTING.ME

  if (confirmReset.type === RESET.ALIASES) return RESETTING.ME
  if (confirmReset.type === RESET.ALIAS && confirmReset.update?.index === index) return RESETTING.ME

  return RESETTING.OTHER
}

const childResetting = (confirmReset, index) => {
  if (!confirmReset) return RESETTING.NONE
  if (confirmReset.type === RESET.TO_INITIAL) return RESETTING.ME

  if (confirmReset.type === RESET.ADD_CHILDREN) return RESETTING.ME
  if (confirmReset.type === RESET.ADD_CHILD && confirmReset.index === index) return RESETTING.ME

  return RESETTING.OTHER
}

const fieldResetting = (confirmReset, field) => {
  if (!confirmReset) return RESETTING.NONE
  if (confirmReset.type === RESET.TO_INITIAL) return RESETTING.ME

  if (confirmReset.type !== RESET.FIELD) return RESETTING.OTHER
  if (confirmReset.update?.field === field) return RESETTING.ME

  if (field === 'name' && confirmReset.update?.field === 'nameChange') return RESETTING.ME
  if (field === 'nameChange' && confirmReset.update?.field === 'name') return RESETTING.ME

  if (field === 'rankLevel' && confirmReset.update?.field === 'rankName') return RESETTING.ME
  if (field === 'rankName' && confirmReset.update?.field === 'rankLevel') return RESETTING.ME

  return RESETTING.OTHER
}

const mediaResetting = (confirmReset, index) => {
  if (!confirmReset) return RESETTING.NONE
  if (confirmReset.type === RESET.TO_INITIAL) return RESETTING.ME

  if (confirmReset.type === RESET.MEDIA) return RESETTING.ME
  if (confirmReset.type === RESET.MEDIA_ITEM && confirmReset.update?.index === index)
    return RESETTING.ME

  return RESETTING.OTHER
}

const isStagedAction = action =>
  action !== CONCEPT_STATE.NO_ACTION && !action.toLowerCase().startsWith('pending')

export { aliasResetting, childResetting, fieldResetting, isStagedAction, mediaResetting }
