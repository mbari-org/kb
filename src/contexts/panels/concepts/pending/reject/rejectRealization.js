import { ACTION } from '@/lib/constants'
import { parseRealization, sameRealization } from '@/lib/kb/model/realizations'

const rejectRealization = (concept, pendingItem) => {
  switch (pendingItem.action) {
    case ACTION.ADD: {
      concept.realizations = (concept.realizations || []).filter(
        realization => !sameRealization(realization, pendingItem.newValue)
      )
      break
    }

    case ACTION.DELETE: {
      const exists = (concept.realizations || []).some(realization =>
        sameRealization(realization, pendingItem.oldValue)
      )
      if (!exists) {
        const parsed = parseRealization(pendingItem.oldValue)
        const newRealization = {
          linkName: parsed.linkName,
          toConcept: parsed.toConcept,
          linkValue: parsed.linkValue,
        }
        concept.realizations = [...(concept.realizations || []), newRealization]
      }
      break
    }

    case ACTION.EDIT: {
      const oldParsed = parseRealization(pendingItem.oldValue)
      const newParsed = parseRealization(pendingItem.newValue)
      concept.realizations = (concept.realizations || []).map(realization => {
        if (
          realization.linkName === newParsed.linkName &&
          realization.toConcept === newParsed.toConcept
        ) {
          return {
            ...realization,
            linkName: oldParsed.linkName,
            toConcept: oldParsed.toConcept,
            linkValue: oldParsed.linkValue ?? realization.linkValue,
          }
        }
        return realization
      })
      break
    }

    default:
      break
  }
}

export default rejectRealization
