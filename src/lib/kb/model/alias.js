import { fieldEdits } from '@/lib/kb/model/field'

import { fieldPending } from './history'

import { isJsonEqual, pick } from '@/lib/util'

import { CONCEPT_NAME_TYPES, CONCEPT_STATE } from '@/lib/constants'

const ALIAS_FIELDS = ['id', 'author', 'name', 'nameType']

// Prescribed order of types
const ALIAS_TYPES = [
  CONCEPT_NAME_TYPES.COMMON,
  CONCEPT_NAME_TYPES.SYNONYM,
  CONCEPT_NAME_TYPES.FORMER,
]

const EMPTY_ALIAS = {
  author: '',
  name: '',
  nameType: ALIAS_TYPES[0],
}

const ALIAS_DISPLAY_FIELDS = ['name', 'author', 'nameType']

const aliasEdits = ({ initial, staged }) =>
  fieldEdits({
    stateType: CONCEPT_STATE.ALIAS,
    displayFields: ALIAS_DISPLAY_FIELDS,
    initial,
    staged,
  })

const aliasesEqual = (a, b) => isJsonEqual(aliasFields(a), aliasFields(b))

const aliasFields = alias => pick(alias, ALIAS_FIELDS)

const stagedAlias = (alias, conceptPending) => {
  const pendingAliasActions = fieldPending(conceptPending, 'ConceptName')

  const pendingAdd = pendingAliasActions.find(
    history => history.action === 'ADD' && history.newValue === alias.name
  )
  if (pendingAdd) {
    return {
      ...alias,
      action: 'Pending Add',
      historyId: pendingAdd.id,
    }
  }

  const pendingDelete = pendingAliasActions.find(
    history => history.action === 'DELETE' && history.oldValue === alias.name
  )
  if (pendingDelete) {
    return {
      ...alias,
      action: 'Pending Delete',
      historyId: pendingDelete.id,
    }
  }

  const pendingEdit = pendingAliasActions.find(
    history => history.action === 'REPLACE' && history.newValue === alias.name
  )
  if (pendingEdit) {
    return {
      ...alias,
      action: 'Pending Edit',
      historyId: pendingEdit.id,
    }
  }

  return alias
}

export { ALIAS_TYPES, aliasEdits, aliasesEqual, aliasFields, EMPTY_ALIAS, stagedAlias }
