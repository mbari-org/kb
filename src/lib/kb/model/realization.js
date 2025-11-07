import { pick } from '@/lib/utils'

const REALIZATION_DISPLAY_FIELDS = ['linkName', 'toConcept', 'linkValue']

export const REALIZATION_FIELDS = ['concept', ...REALIZATION_DISPLAY_FIELDS]

export const EMPTY_REALIZATION = Object.fromEntries(REALIZATION_FIELDS.map(field => [field, '']))

const asText = realization => `${realization.linkName} | ${realization.toConcept} | ${realization.linkValue}`

const isSame = (a, b) =>
  a.linkName === b.linkName && a.toConcept === b.toConcept && a.linkValue === b.linkValue

const hasDuplicate = (realizations, realization, excludeIndex = null) => {
  if (!realization.linkName || !realization.toConcept || !realization.linkValue) {
    return false
  }

  const realizationsToCheck =
    excludeIndex !== null ? realizations.filter((_, index) => index !== excludeIndex) : realizations

  return realizationsToCheck.some(existing => isSame(realization, existing))
}

const matchingRealizationString = (realization, realizationStr) => {
  const parsedRealization = parseRealization(realizationStr)
  return isSame(realization, parsedRealization)
}

const parseRealization = realization => {
  const [linkName, toConcept, linkValue] = realization.split(' | ')
  return { linkName, toConcept, linkValue }
}

const pickRealization = object => pick(object, REALIZATION_FIELDS)

const sortRealizations = realizations =>
  realizations.sort(
    (a, b) =>
      a.linkName.localeCompare(b.linkName) ||
      a.toConcept.localeCompare(b.toConcept) ||
      a.linkValue.localeCompare(b.linkValue)
  )

export {
  asText,
  hasDuplicate,
  isSame,
  matchingRealizationString,
  parseRealization,
  pickRealization,
  REALIZATION_DISPLAY_FIELDS,
  sortRealizations,
}
