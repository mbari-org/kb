import { ACTION } from '@/lib/constants'

const approveChild = (concept, item) => {
  switch (item.action) {
    case ACTION.ADD: {
      const next = [...concept.children, item.newValue]
      concept.children = Array.from(new Set(next)).sort()
      break
    }

    case ACTION.DELETE: {
      concept.children = concept.children.filter(child => child !== item.oldValue)
      break
    }

    default:
      throw new Error(`Invalid approval pending child action: ${item.action}`)
  }
}

export default approveChild
