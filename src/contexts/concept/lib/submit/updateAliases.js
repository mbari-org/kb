import { createAlias, deleteAlias, updateAlias } from '@/lib/services/oni/api/aliases'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

import { aliasEdits } from '@/lib/kb/concept/aliases'

import { prunePick } from '@/lib/util'

const updateAliases = (concept, updates, submit) => {
  const { aliases } = prunePick(updates, ['aliases'])
  if (!aliases) {
    return []
  }

  const submitters = aliasEdits(aliases).map(edit => {
    const { action, index, updates } = edit

    switch (action) {
      case CONCEPT_STATE.ALIAS.ADD: {
        const params = {
          ...updates,
          name: concept.name,
          newName: updates.name,
        }
        return () => submit(createAlias, params)
      }

      case CONCEPT_STATE.ALIAS.EDIT: {
        if (updates.name) {
          updates.newName = updates.name
          delete updates.name
        }

        const aliasName = aliases.initial[index].name
        const params = [aliasName, updates]
        return () => submit(updateAlias, params)
      }

      case CONCEPT_STATE.ALIAS.DELETE: {
        const aliasName = aliases.initial[index].name
        return () => submit(deleteAlias, aliasName)
      }

      default:
        return null
    }
  }, [])

  return submitters
}

export default updateAliases
