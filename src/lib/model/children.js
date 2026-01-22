import { CONCEPT } from '@/lib/constants'

const CHILD_FIELDS = [
  CONCEPT.FIELD.AUTHOR,
  CONCEPT.FIELD.NAME,
  CONCEPT.FIELD.RANK_NAME,
  CONCEPT.FIELD.RANK_LEVEL,
]

const EMPTY_CHILD = CHILD_FIELDS.reduce((acc, field) => {
  acc[field] = ''
  return acc
}, {})

export { CHILD_FIELDS, EMPTY_CHILD }
