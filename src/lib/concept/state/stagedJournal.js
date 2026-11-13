import { isStagedEdit } from '@/lib/concept/state/stagedSeq'

import { CONCEPT } from '@/lib/constants'

const FIELD_ORDER = [
  CONCEPT.FIELD.ALIASES,
  CONCEPT.FIELD.AUTHOR,
  CONCEPT.FIELD.CHILDREN,
  CONCEPT.FIELD.MEDIA,
  CONCEPT.FIELD.PARENT,
  CONCEPT.FIELD.RANK,
  CONCEPT.FIELD.REALIZATIONS,
  CONCEPT.FIELD.NAME,
]

const fieldOrderIndex = field => {
  const index = FIELD_ORDER.indexOf(field)
  if (index === -1) {
    throw new Error(`Unknown staged journal field: ${field}`)
  }
  return index
}

const arrayFieldOps = (field, stagedItems) =>
  stagedItems.reduce((ops, item, index) => {
    if (!isStagedEdit(item)) return ops
    ops.push({
      action: item.action,
      field,
      index,
      item,
      seq: item.stagedSeq,
    })
    return ops
  }, [])

const valueFieldOp = (field, stagedValue, action) => {
  if (!isStagedEdit(stagedValue)) return []
  return [
    {
      action,
      field,
      index: 0,
      item: stagedValue,
      seq: stagedValue.stagedSeq,
    },
  ]
}

const compareOps = (a, b) => {
  const aHasSeq = a.seq !== undefined
  const bHasSeq = b.seq !== undefined
  if (aHasSeq && bHasSeq && a.seq !== b.seq) return a.seq - b.seq
  if (aHasSeq !== bHasSeq) return aHasSeq ? -1 : 1

  const fieldDiff = fieldOrderIndex(a.field) - fieldOrderIndex(b.field)
  if (fieldDiff !== 0) return fieldDiff
  return a.index - b.index
}

const buildStagedJournal = (_initialState, stagedState) => {
  const ops = [
    ...arrayFieldOps(CONCEPT.FIELD.ALIASES, stagedState.aliases),
    ...arrayFieldOps(CONCEPT.FIELD.CHILDREN, stagedState.children),
    ...arrayFieldOps(CONCEPT.FIELD.MEDIA, stagedState.media),
    ...arrayFieldOps(CONCEPT.FIELD.REALIZATIONS, stagedState.realizations),
    ...valueFieldOp(CONCEPT.FIELD.AUTHOR, stagedState.author, stagedState.author.action),
    ...valueFieldOp(CONCEPT.FIELD.NAME, stagedState.name, stagedState.name.action),
    ...valueFieldOp(CONCEPT.FIELD.PARENT, stagedState.parent, stagedState.parent.action),
    ...valueFieldOp(CONCEPT.FIELD.RANK, stagedState.rank, stagedState.rank.action),
  ]

  return ops.sort(compareOps)
}

export { FIELD_ORDER, buildStagedJournal }
