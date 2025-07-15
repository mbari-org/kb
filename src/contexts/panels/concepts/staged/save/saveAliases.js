import { createAlias, deleteAlias, updateAlias } from '@/lib/api/aliases'

import { CONCEPT_STATE } from '@/lib/constants'

const { ALIAS_ITEM: ALIAS } = CONCEPT_STATE

import { diff, drop, pick } from '@/lib/utils'

const saveAliases = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, initialValue, updatedValue } = updatesInfo

  if (!hasUpdated('aliases')) {
    return []
  }

  const submitters = updatedValue('aliases').reduce((acc, update, index) => {
    switch (update.action) {
      case ALIAS.ADD: {
        const aliasUpdate = pick(update, ['author', 'nameType'])
        const params = {
          ...aliasUpdate,
          name: concept.name,
          newName: update.name,
        }
        acc.push(submit(createAlias, params))
        break
      }

      case ALIAS.EDIT: {
        const initialAlias = initialValue('aliases')[index]
        const updateDiff = diff(update, initialAlias)
        const aliasUpdate = drop(updateDiff, ['action'])

        if (aliasUpdate.name) {
          aliasUpdate.newName = update.name
          delete aliasUpdate.name
        }
        const params = [initialAlias.name, aliasUpdate]
        acc.push(submit(updateAlias, params))
        break
      }

      case ALIAS.DELETE: {
        acc.push(submit(deleteAlias, update.name))
        break
      }

      default:
        break
    }
    return acc
  }, [])

  return submitters
}

export default saveAliases
