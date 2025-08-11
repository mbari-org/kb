import { CONCEPT_STATE } from '@/lib/constants'

const applyChildren = (concept, tracker) => {
  if (!Array.isArray(concept.children)) concept.children = []
  if (tracker.action === CONCEPT_STATE.CHILD.ADD) {
    const payload = tracker.response?.payload
    const childName = payload?.name || tracker.update.name
    if (!concept.children.includes(childName)) {
      concept.children = [...concept.children, childName].sort()
    }
  }
}

export default applyChildren
