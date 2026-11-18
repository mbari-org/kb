import { ACTION } from '@/lib/constants'
import { createError } from '@/lib/errors'
import { sortConceptChildren } from '@/lib/model/concept'

const approveChild = (concept, item) => {
  switch (item.action) {
    case ACTION.ADD: {
      const next = [...concept.children, item.newValue]
      concept.children = sortConceptChildren(Array.from(new Set(next)))
      break
    }

    case ACTION.DELETE: {
      concept.children = sortConceptChildren(concept.children.filter(child => child !== item.oldValue))
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
