import { ACTION, CONCEPT_STATE, HISTORY_FIELD } from '@/lib/constants/constants'

const isMatching = (template, pendingTemplate) => {
  const templateString =
    pendingTemplate.action !== ACTION.DELETE
      ? pendingTemplate.newValue
      : pendingTemplate.oldValue

  const str = `${template.linkName}|${template.toConcept}|${template.linkValue}`.replace(/\s/g, '')
  return str === templateString.replace(/\s/g, '')
}

const isPendingTemplate = pendingItem => pendingItem.field === HISTORY_FIELD.TEMPLATE

const templateState = (template, pendingTemplates) => {
  const pendingTemplate = pendingTemplates.find(pendingItem =>
    isMatching(template, pendingItem)
  )
  if (pendingTemplate) {
    return {
      ...template,
      action: pendingTemplate.action + ' Pending',
      historyId: pendingTemplate.id,
    }
  }
  return { ...template, action: CONCEPT_STATE.NO_ACTION }
}

const templatesState = (concept, pendingConcept) => {
  const pendingTemplates = pendingConcept.filter(isPendingTemplate)
  const stagedTemplates = (concept.templates || []).map((template, index) =>
    templateState({ ...template, index }, pendingTemplates)
  )
  return { templates: stagedTemplates }
}

export { isPendingTemplate, templatesState, templateState }
