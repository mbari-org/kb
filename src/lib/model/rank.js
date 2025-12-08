const RANK = {
  LEVEL: 'rankLevel',
  NAME: 'rankName',
}

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
