import { isStagedAction } from '@/lib/concept/state/staged'

const ARRAY_FIELDS = ['aliases', 'children', 'media', 'realizations']
const VALUE_FIELDS = ['author', 'name', 'parent', 'rank']

const isStagedEdit = item =>
  isStagedAction(item.action) && !item.action.toLowerCase().endsWith(' pending')

const maxStagedSeq = state =>
  Math.max(
    0,
    ...ARRAY_FIELDS.flatMap(field => state[field]).map(item => item.stagedSeq ?? 0),
    ...VALUE_FIELDS.map(field => state[field]?.stagedSeq ?? 0)
  )

const stampStagedEdits = state => {
  let next = maxStagedSeq(state) + 1
  let stamped = false

  const stamp = item => {
    if (isStagedEdit(item) && item.stagedSeq === undefined) {
      stamped = true
      return { ...item, stagedSeq: next++ }
    }
    return item
  }

  const arrayFields = ARRAY_FIELDS.map(field => [field, state[field].map(stamp)])
  const valueFields = VALUE_FIELDS.map(field => [field, stamp(state[field])])

  if (!stamped) return state

  return {
    ...state,
    ...Object.fromEntries([...arrayFields, ...valueFields]),
  }
}

export { isStagedEdit, stampStagedEdits }
