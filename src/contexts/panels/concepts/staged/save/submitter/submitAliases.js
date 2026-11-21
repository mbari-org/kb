import { createAlias } from '@/lib/api/aliases'
import { deleteConceptNameById, updateConceptNameById } from '@/lib/api/concept'

import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { FIELDS } from '@/lib/config/fields.js'

import { diff, drop, pick } from '@/lib/utils'

const { ALIAS } = CONCEPT_STATE

const buildAliasSubmit = (op, effective) => {
  const { action, index, item } = op

  switch (action) {
    case ALIAS.ADD: {
      const aliasUpdate = pick(item, [FIELDS.ALIAS.AUTHOR, FIELDS.ALIAS.NAME_TYPE])
      const params = {
        ...aliasUpdate,
        name: effective.state.name,
        newName: item.name,
      }
      return {
        apiFn: createAlias,
        params,
        tracker: { action, field: CONCEPT.FIELD.ALIASES, index, update: item },
      }
    }

    case ALIAS.EDIT: {
      const prior = effective.findAlias(item)
      const updateDiff = diff(item, prior)
      const aliasUpdate = drop(updateDiff, [FIELDS.STAGED.ACTION, FIELDS.STAGED.INDEX, FIELDS.STAGED.STAGED_SEQ])
      if (aliasUpdate.name) {
        aliasUpdate.newName = item.name
        delete aliasUpdate.name
      }
      const params = [prior.id, aliasUpdate]
      return {
        apiFn: updateConceptNameById,
        params,
        tracker: { action, field: CONCEPT.FIELD.ALIASES, index, update: item },
      }
    }

    case ALIAS.DELETE: {
      const prior = effective.findAlias(item)
      const params = prior.id
      return {
        apiFn: deleteConceptNameById,
        params,
        tracker: { action, field: CONCEPT.FIELD.ALIASES, index, update: item },
      }
    }

    default:
      throw new Error(`Unknown alias action: ${action}`)
  }
}

export default buildAliasSubmit
