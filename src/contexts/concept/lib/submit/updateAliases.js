import { createAlias, deleteAlias, updateAlias } from '@/lib/services/oni/api/aliases'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const { ALIAS, NO_ACTION } = CONCEPT_STATE

import { pick } from '@/lib/util'

const updateAliases = ([submit, { concept, updateInfo }]) => {
  const { hasUpdated, initialValue, updateValue } = updateInfo

  if (!hasUpdated('aliases')) {
    return []
  }

  const aliasUpdates = updateValue('aliases').reduce((acc, aliasUpdate, index) => {
    if (aliasUpdate.action !== NO_ACTION) {
      acc.push({ ...aliasUpdate, index })
    }
    return acc
  }, [])

  const submitters = aliasUpdates.map(update => {
    const alias = pick(update, ['author', 'nameType', 'name'])

    switch (update.action) {
      case ALIAS.ADD: {
        const params = {
          ...alias,
          name: concept.name,
          newName: update.name,
        }
        return submit(createAlias, params)
      }

      case ALIAS.EDIT: {
        if (alias.name) {
          alias.newName = alias.name
          delete alias.name
        }

        const name = initialValue('aliases')[update.index].name
        const params = [name, alias]
        return submit(updateAlias, params)
      }

      case ALIAS.DELETE: {
        return submit(deleteAlias, alias.name)
      }

      default:
        return null
    }
  }, [])

  return submitters
}

export default updateAliases
