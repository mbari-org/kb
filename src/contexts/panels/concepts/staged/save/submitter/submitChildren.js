import { createConcept } from '@/lib/api/concept'
import { CONCEPT_STATE } from '@/lib/constants'

const { CHILD } = CONCEPT_STATE

const submitChildren = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  if (!hasUpdated('children')) {
    return []
  }

  const submitChild = (apiFn, trackerInfo) =>
    submit(apiFn, trackerInfo.params).then(response => ({
      field: 'children',
      response,
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
