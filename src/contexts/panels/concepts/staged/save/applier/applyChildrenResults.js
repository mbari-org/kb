import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { sortConceptChildren } from '@/lib/model/concept'

const applyChildrenResults = ({ concept, result }) => {
  if (result.action === CONCEPT_STATE.CHILD.ADD) {
    const childName = result.response.name
    if (!concept.children.includes(childName)) {
      concept.children = sortConceptChildren([...concept.children, childName])
    }
  }
}

export default applyChildrenResults
