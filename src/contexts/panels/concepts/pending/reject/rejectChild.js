import { ACTION } from '@/lib/constants/constants'

const rejectChild = (concept, pendingItem) => {
  switch (pendingItem.action) {
    case ACTION.ADD: {
      concept.children = concept.children.filter(child => child !== pendingItem.newValue)
      break
    }

    case ACTION.DELETE: {
      const next = [...concept.children, pendingItem.oldValue]
      concept.children = Array.from(new Set(next)).sort()
      break
    }

    default:
      break
  }
}

export default rejectChild
