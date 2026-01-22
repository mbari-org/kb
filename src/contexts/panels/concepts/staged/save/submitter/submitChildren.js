import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { createError } from '@/lib/errors'
import { createConcept } from '@/lib/api/concept'

const { CHILD } = CONCEPT_STATE

const submitChildren = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  if (!hasUpdated(CONCEPT.FIELD.CHILDREN)) {
    return []
  }

  const submitChild = (apiFn, trackerInfo) =>
    submit(apiFn, trackerInfo.params)
      .then(response => ({
        field: CONCEPT.FIELD.CHILDREN,
        response,
        ...trackerInfo,
      }))
      .catch(error => ({
        field: CONCEPT.FIELD.CHILDREN,
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

  const submitters = updatedValue(CONCEPT.FIELD.CHILDREN).reduce((acc, update, index) => {
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
