import { createAlias, deleteAlias, updateAlias } from '@/lib/services/oni/api/aliases'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const { ALIAS } = CONCEPT_STATE

import { diff, drop, pick } from '@/lib/util'

const updateAliases = ([submit, { concept, updateInfo }]) => {
  const { hasUpdated, initialValue, updatedValue } = updateInfo

  if (!hasUpdated('aliases')) {
    return []
  }

  // const aliasUpdates = updatedValue('aliases').reduce((acc, aliasUpdate, index) => {
  //   console.log('initial aliases', initialValue('aliases'))
  //   if (aliasUpdate.action !== NO_ACTION) {
  //     acc.push({ ...aliasUpdate, index })
  //   }
  //   return acc
  // }, [])

  const submitters = updatedValue('aliases').reduce((acc, update, index) => {
    switch (update.action) {
      case ALIAS.ADD: {
        const alias = pick(update, ['author', 'nameType'])
        const params = {
          ...alias,
          name: concept.name,
          newName: update.name,
        }
        acc.push(submit(createAlias, params))
        break
      }

      case ALIAS.EDIT: {
        const initialAlias = initialValue('aliases')[index]
        const updateDiff = diff(update, initialAlias)
        const alias = drop(updateDiff, ['action'])

        if (alias.name) {
          alias.newName = update.name
          delete alias.name
        }
        const params = [initialAlias.name, alias]
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

export default updateAliases
