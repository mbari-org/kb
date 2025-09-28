import { ACTION } from '@/lib/constants'
import { createError } from '@/lib/errors'

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
      throw createError(
        'Invalid Pending Action',
        `Cannot approve child with invalid action: ${item.action}`,
        { item }
      )
  }
}

export default approveChild
