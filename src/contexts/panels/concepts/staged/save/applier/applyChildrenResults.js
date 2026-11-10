import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const applyChildrenResults = ({ concept, result }) => {
  if (result.action === CONCEPT_STATE.CHILD.ADD) {
    const childName = result.response?.name || result.update.name
    if (!concept.children.includes(childName)) {
      concept.children = [...concept.children, childName].sort()
    }
  }
}

export default applyChildrenResults
