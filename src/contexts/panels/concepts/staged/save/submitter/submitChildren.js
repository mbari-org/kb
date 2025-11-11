import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { createError } from '@/lib/errors'
import { createConcept } from '@/lib/kb/api/concept'

const { CHILD } = CONCEPT_STATE

const submitChildren = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  if (!hasUpdated('children')) {
    return []
  }

  const submitChild = (apiFn, trackerInfo) =>
    submit(apiFn, trackerInfo.params)
      .then(response => ({
        field: 'children',
        response,
        ...trackerInfo,
      }))
      .catch(error => ({
        field: 'children',
        error: createError(
          'Child Creation Failed',
          `Failed to add child concept ${trackerInfo.params.name} to ${concept.name}`,
          {
            childName: trackerInfo.params.name,
            parentName: concept.name,
            action: trackerInfo.action,
            index: trackerInfo.index,
          },
          error
        ),
        ...trackerInfo,
      }))

  const submitters = updatedValue('children').reduce((acc, update, index) => {
    if (update.action === CHILD.ADD) {
      const params = { ...update, parentName: concept.name }
      const trackerInfo = { action: CHILD.ADD, index, params, update }
      acc.push(submitChild(createConcept, trackerInfo))
    }
    return acc
  }, [])

  return submitters
}

export default submitChildren
