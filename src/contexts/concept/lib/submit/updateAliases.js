import { createAlias, deleteAlias, updateAlias } from '@/lib/services/oni/api/aliases'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

import { stateChange } from '@/contexts/concept/lib/edit/stateChange'
import { pick, prunePick, updatedFields } from '@/lib/util'

const pruned = stagedAlias => {
  const apiAlias = {
    newName: stagedAlias.name,
    nameType: stagedAlias.nameType,
    author: stagedAlias.author,
  }

  return prunePick(apiAlias, ['author', 'nameType', 'newName'])
}

const updateAliases = (concept, updates, submit) => {
  const aliasesUpdates = updatedFields(updates, ['aliases'])

  if (!aliasesUpdates) {
    return []
  }

  const submitters = aliasesUpdates.aliases.staged.reduce((acc, stagedAlias, index) => {
    const initialAlias = pick(aliasesUpdates.aliases.initial[index], ['author', 'name', 'nameType'])
    const alias = stateChange(initialAlias, prunePick(stagedAlias, ['author', 'name', 'nameType']))
    const prunedAlias = pruned(alias)

    switch (stagedAlias.action) {
      case CONCEPT_STATE.ALIAS.ADD: {
        const params = {
          name: concept.name,
          ...prunedAlias,
        }
        acc.push(() => submit(createAlias, params))
        return acc
      }

      case CONCEPT_STATE.ALIAS.EDIT: {
        const aliasName = aliasesUpdates.aliases.initial[index].name
        const params = [aliasName, prunedAlias]
        acc.push(() => submit(updateAlias, params))
        return acc
      }

      case CONCEPT_STATE.ALIAS.DELETE: {
        const aliasName = aliasesUpdates.aliases.initial[index].name
        acc.push(() => submit(deleteAlias, aliasName))
        return acc
      }

      default:
        return acc
    }
  }, [])

  return submitters
}

export default updateAliases
