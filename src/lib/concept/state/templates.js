import generalStateUpdates from '@/contexts/panels/concepts/staged/edit/generalStateUpdates'
import { stagedEdits } from '@/lib/concept/state/staged'
import { isStagedEdit } from '@/lib/concept/state/stagedSeq'
import { genStateId } from '@/lib/concept/state/stateId'
import { ACTION } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
import { REALIZATION_VALUE_FIELDS } from '@/lib/model/realization'
import { matchingTemplateString } from '@/lib/model/templates'
import { isJsonEqual, pick } from '@/lib/utils'

const { TEMPLATE } = CONCEPT_STATE

const isMatching = (template, pendingTemplate) => {
  const templateString =
    pendingTemplate.action !== ACTION.DELETE
      ? pendingTemplate.newValue
      : pendingTemplate.oldValue

  return matchingTemplateString(template, templateString)
}

const isPendingTemplate = pendingItem => pendingItem.field === HISTORY_FIELD.TEMPLATE

const templateState = (template, pendingTemplates) => {
  const pendingTemplate = pendingTemplates.find(pendingItem => isMatching(template, pendingItem))
  if (pendingTemplate) {
    return {
      ...template,
      action: pendingTemplate.action + ' Pending',
      historyId: pendingTemplate.id,
    }
  }
  return { ...template, action: CONCEPT_STATE.NO_ACTION }
}

const initialState = (concept, pendingConcept) => {
  const pendingTemplates = pendingConcept.filter(isPendingTemplate)
  const stagedTemplates = (concept.templates || []).map((template, index) =>
    templateState({ ...template, index, stateId: genStateId() }, pendingTemplates)
  )
  return { templates: stagedTemplates }
}

const addTemplate = ({ stagedState, update }) => ({
  ...stagedState,
  templates: [...stagedState.templates, { ...update.templateItem, action: TEMPLATE.ADD, stateId: genStateId() }],
})

const editTemplate = ({ stagedState, update }) => {
  const { templateItem, templateStateId } = update
  const prior = stagedState.templates.find(item => item.stateId === templateStateId)
  const action = prior.action === TEMPLATE.ADD ? TEMPLATE.ADD : TEMPLATE.EDIT
  const updatedItem = { ...prior, ...pick(templateItem, REALIZATION_VALUE_FIELDS), action }
  return {
    ...stagedState,
    templates: stagedState.templates.map(item => (item.stateId === templateStateId ? updatedItem : item)),
  }
}

const deleteTemplate = ({ stagedState, update }) => {
  const { templateStateId } = update
  const target = stagedState.templates.find(item => item.stateId === templateStateId)
  if (target.action === TEMPLATE.ADD) {
    return {
      ...stagedState,
      templates: stagedState.templates.filter(item => item.stateId !== templateStateId),
    }
  }
  return {
    ...stagedState,
    templates: stagedState.templates.map(item =>
      item.stateId === templateStateId ? { ...item, action: TEMPLATE.DELETE } : item
    ),
  }
}

const resetTemplates = ({ stagedState, update }) => {
  const { stateId, templates: initialTemplates } = update
  if (stateId === undefined) {
    return { ...stagedState, templates: initialTemplates }
  }

  const initialItem = initialTemplates.find(item => item.stateId === stateId)
  return {
    ...stagedState,
    templates: initialItem
      ? stagedState.templates.map(item => (item.stateId === stateId ? initialItem : item))
      : stagedState.templates.filter(item => item.stateId !== stateId),
  }
}

const isModified = (initial, staged) => !isJsonEqual(initial?.templates, staged?.templates)

const stagedTemplateEdits = ([_field, templates]) =>
  stagedEdits({
    displayFields: REALIZATION_VALUE_FIELDS,
    initial: templates.initial,
    staged: templates.staged.filter(isStagedEdit),
    stateTypes: TEMPLATE,
  })

const stateUpdates = (initial, staged) => generalStateUpdates('templates', initial, staged)

export {
  addTemplate,
  deleteTemplate,
  editTemplate,
  initialState,
  isModified,
  isPendingTemplate,
  resetTemplates,
  stagedTemplateEdits,
  stateUpdates,
  templateState,
}
