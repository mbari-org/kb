import { EMPTY_TEMPLATE } from '@/lib/kb/model/template'

import { pick } from '@/lib/utils'

const REALIZATION_DISPLAY_FIELDS = ['linkName', 'toConcept', 'linkValue']

const EMPTY_REALIZATION = {
  ...EMPTY_TEMPLATE,
  templateId: null,
}

const hasDuplicate = (realizations, realization, excludeIndex = null) => {
  if (!realization.linkName || !realization.toConcept || !realization.linkValue) {
    return false
  }

  const realizationsToCheck =
    excludeIndex !== null ? realizations.filter((_, index) => index !== excludeIndex) : realizations

  return realizationsToCheck.some(existing => isSame(realization, existing))
}

const isSame = (a, b) =>
  a.linkName === b.linkName && a.toConcept === b.toConcept && a.linkValue === b.linkValue

const realizationFields = realization => pick(realization, REALIZATION_DISPLAY_FIELDS)

const parseRealization = str => {
  const [linkName, toConcept, linkValue] = (str || '').split(' | ')
  return { linkName, toConcept, linkValue }
}

const sameRealization = (realization, str) => {
  const parsedRealization = parseRealization(str)
  return isSame(realization, parsedRealization)
}

const sortRealizations = realizations =>
  realizations.sort(
    (a, b) =>
      a.linkName.localeCompare(b.linkName) ||
      a.toConcept.localeCompare(b.toConcept) ||
      a.linkValue.localeCompare(b.linkValue)
  )

export {
  EMPTY_REALIZATION,
  hasDuplicate,
  isSame,
  parseRealization,
  REALIZATION_DISPLAY_FIELDS,
  realizationFields,
  sameRealization,
  sortRealizations,
}
