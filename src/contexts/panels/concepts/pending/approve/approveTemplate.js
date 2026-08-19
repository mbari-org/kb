import { ACTION } from '@/lib/constants'
import { matchingTemplateString, parseTemplate } from '@/lib/model/templates'

const approveTemplate = (concept, item) => {
  switch (item.action) {
    case ACTION.ADD: {
      const parsed = parseTemplate(item.newValue)
      const newTemplate = {
        linkName: parsed.linkName,
        toConcept: parsed.toConcept,
        linkValue: parsed.linkValue,
      }
      const exists = (concept.templates || []).some(template =>
        matchingTemplateString(template, newTemplate)
      )
      if (!exists) concept.templates = [...(concept.templates || []), newTemplate]
      break
    }

    case ACTION.DELETE: {
      const parsed = parseTemplate(item.oldValue)
      concept.templates = (concept.templates || []).filter(
        template => !matchingTemplateString(template, parsed)
      )
      break
    }

    case ACTION.EDIT: {
      const oldParsed = parseTemplate(item.oldValue)
      const newParsed = parseTemplate(item.newValue)
      concept.templates = (concept.templates || []).map(template => {
        if (
          template.linkName === oldParsed.linkName &&
          template.toConcept === oldParsed.toConcept
        ) {
          return {
            ...template,
            linkName: newParsed.linkName,
            toConcept: newParsed.toConcept,
            linkValue: newParsed.linkValue ?? template.linkValue,
          }
        }
        return template
      })
      break
    }

    default:
      throw new Error(`Invalid approval pending template action: ${item.action}`)
  }
}

export default approveTemplate
