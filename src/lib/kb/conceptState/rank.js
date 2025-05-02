import { RANK } from '@/lib/constants'

const filterRanks = (ranks, field, otherValue) => {
  if (!field) {
    return ranks
  }
  const otherField = field === RANK.LEVEL ? RANK.NAME : RANK.LEVEL

  const fieldValues = ranks.filter(rank => rank[otherField] === otherValue).map(rank => rank[field])

  const uniqueFieldValues = [...new Set(fieldValues)]
  if (uniqueFieldValues.includes('')) {
    uniqueFieldValues.splice(uniqueFieldValues.indexOf(''), 1)
    uniqueFieldValues.unshift('')
  }

  return uniqueFieldValues
}

export { filterRanks }
