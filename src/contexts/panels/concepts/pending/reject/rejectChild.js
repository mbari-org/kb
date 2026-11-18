import { ACTION } from '@/lib/constants'
import { sortConceptChildren } from '@/lib/model/concept'

const rejectChild = (concept, pendingItem) => {
  switch (pendingItem.action) {
    case ACTION.ADD: {
      concept.children = sortConceptChildren(
        concept.children.filter(child => child !== pendingItem.newValue)
      )
      break
    }

    case ACTION.DELETE: {
      const next = [...concept.children, pendingItem.oldValue]
      concept.children = sortConceptChildren(Array.from(new Set(next)))
      break
    }

    default:
      break
  }
}

export default rejectChild
