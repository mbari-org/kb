import { createAlias, deleteAlias, updateAlias } from '@/lib/api/aliases'

import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

import { diff, drop, pick } from '@/lib/utils'

const { ALIAS } = CONCEPT_STATE

const buildAliasSubmit = (op, effective) => {
  const { action, index, item } = op

  switch (action) {
    case ALIAS.ADD: {
      const aliasUpdate = pick(item, ['author', 'nameType'])
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
      const aliasUpdate = drop(updateDiff, ['action', 'index', 'stagedSeq'])
      if (aliasUpdate.name) {
        aliasUpdate.newName = item.name
        delete aliasUpdate.name
      }
      const params = [prior.name, aliasUpdate]
      return {
        apiFn: updateAlias,
        params,
        tracker: { action, field: CONCEPT.FIELD.ALIASES, index, update: item },
      }
    }

    case ALIAS.DELETE: {
      const prior = effective.findAlias(item)
      const params = prior.name
      return {
        apiFn: deleteAlias,
        params,
        tracker: { action, field: CONCEPT.FIELD.ALIASES, index, update: item },
      }
    }

    default:
      throw new Error(`Unknown alias action: ${action}`)
  }
}

export default buildAliasSubmit
