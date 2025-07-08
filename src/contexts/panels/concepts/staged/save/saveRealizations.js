import { createRealization, deleteRealization, updateRealization } from '@/lib/api/linkRealizations'

import { CONCEPT_STATE } from '@/lib/constants'

const { REALIZATION_ITEM: REALIZATION } = CONCEPT_STATE

import { diff, drop, pick } from '@/lib/utils'

const saveRealizations = ([submit, { concept, updateInfo }]) => {
  const { hasUpdated, initialValue, updatedValue } = updateInfo

  if (!hasUpdated('realizations')) {
    return []
  }

  const submitters = updatedValue('realizations').reduce((acc, update, index) => {
    switch (update.action) {
      case REALIZATION.ADD: {
        const realization = pick(update, ['linkName', 'toConcept', 'linkValue'])
        const params = {
          ...realization,
          fromConcept: concept.name,
        }
        acc.push(submit(createRealization, params))
        break
      }

      case REALIZATION.EDIT: {
        const initialRealization = initialValue('realizations')[index]
        const updateDiff = diff(update, initialRealization)
        const realization = drop(updateDiff, ['action'])

        const params = [initialRealization.id, realization]
        acc.push(submit(updateRealization, params))
        break
      }

      case REALIZATION.DELETE: {
        acc.push(submit(deleteRealization, update.id))
        break
      }

      default:
        break
    }
    return acc
  }, [])

  return submitters
}

export default saveRealizations
