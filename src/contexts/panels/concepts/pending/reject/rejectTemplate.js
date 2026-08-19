import { ACTION } from '@/lib/constants'
import { matchingTemplateString, parseTemplate } from '@/lib/model/templates'

const rejectTemplate = (concept, pendingItem) => {
  switch (pendingItem.action) {
    case ACTION.ADD: {
      concept.templates = (concept.templates || []).filter(
        template => !matchingTemplateString(template, pendingItem.newValue)
      )
      break
    }

    case ACTION.DELETE: {
      const exists = (concept.templates || []).some(template =>
        matchingTemplateString(template, pendingItem.oldValue)
      )
      if (!exists) {
        const parsed = parseTemplate(pendingItem.oldValue)
        const newTemplate = {
          linkName: parsed.linkName,
          toConcept: parsed.toConcept,
          linkValue: parsed.linkValue,
        }
        concept.templates = [...(concept.templates || []), newTemplate]
      }
      break
    }

    case ACTION.EDIT: {
      const oldParsed = parseTemplate(pendingItem.oldValue)
      const newParsed = parseTemplate(pendingItem.newValue)
      concept.templates = (concept.templates || []).map(template => {
        if (
          template.linkName === newParsed.linkName &&
          template.toConcept === newParsed.toConcept
        ) {
          return {
            ...template,
            linkName: oldParsed.linkName,
            toConcept: oldParsed.toConcept,
            linkValue: oldParsed.linkValue ?? template.linkValue,
          }
        }
        return template
      })
      break
    }

    default:
      break
  }
}

export default rejectTemplate
