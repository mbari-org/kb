import { ACTION, HISTORY_FIELD } from '@/lib/constants'
import { parseRealization, sameRealization } from '@/lib/kb/model/realizations'

const approveRealization = (concept, item) => {
  switch (item.action) {
    case ACTION.ADD: {
      const parsed = parseRealization(item.newValue)
      const newRealization = {
        linkName: parsed.linkName,
        toConcept: parsed.toConcept,
        linkValue: parsed.linkValue,
      }
      const exists = (concept.realizations || []).some(realization =>
        sameRealization(realization, newRealization)
      )
      if (!exists) concept.realizations = [...(concept.realizations || []), newRealization]
      break
    }

    case ACTION.DELETE: {
      const parsed = parseRealization(item.oldValue)
      concept.realizations = (concept.realizations || []).filter(r => !sameRealization(r, parsed))
      break
    }

    case HISTORY_FIELD.REALIZATION: {
      const oldParsed = parseRealization(item.oldValue)
      const newParsed = parseRealization(item.newValue)
      concept.realizations = (concept.realizations || []).map(realization => {
        if (
          realization.linkName === oldParsed.linkName &&
          realization.toConcept === oldParsed.toConcept
        ) {
          return {
            ...realization,
            linkName: newParsed.linkName,
            toConcept: newParsed.toConcept,
            linkValue: newParsed.linkValue ?? realization.linkValue,
          }
        }
        return realization
      })
      break
    }

    default:
      throw new Error(`Invalid approval pending realization action: ${item.action}`)
  }
}

export default approveRealization
