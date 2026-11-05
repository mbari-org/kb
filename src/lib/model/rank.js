import { CONCEPT } from '@/lib/constants'

const RANK = {
  LEVEL: CONCEPT.FIELD.RANK_LEVEL,
  NAME: CONCEPT.FIELD.RANK_NAME,
}

const filterRanks = (ranks, field, otherValue) => {
  if (!field) {
    return ranks
  }
  const otherField = field === RANK.LEVEL ? RANK.NAME : RANK.LEVEL

  const fieldValues =
    otherValue === undefined
      ? ranks.map(rank => rank[field])
      : ranks.filter(rank => rank[otherField] === otherValue).map(rank => rank[field])

  return [...new Set(fieldValues)].filter(value => value !== '')
}

const rankValues = value => {
  const parts = String(value ?? '')
    .trim()
    .split(' ')
    .filter(Boolean)
  const level = parts.length === 1 ? '' : parts[0] || ''
  const name = parts.length === 1 ? parts[0] || '' : parts.slice(1).join(' ')
  return { level, name }
}

export { filterRanks, rankValues }
