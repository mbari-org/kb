import { createConceptTemplate, deleteConceptTemplate, updateTemplate } from '@/lib/api/templates'

import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { REALIZATION_VALUE_FIELDS } from '@/lib/model/realization'

import { diff, pick } from '@/lib/utils'

const { TEMPLATE } = CONCEPT_STATE

const buildTemplateSubmit = (op, effective) => {
  const { action, index, item } = op
  const tracker = { action, field: CONCEPT.FIELD.TEMPLATES, index, update: item }

  switch (action) {
    case TEMPLATE.ADD:
      return {
        apiFn: createConceptTemplate,
        params: { ...pick(item, REALIZATION_VALUE_FIELDS), concept: effective.state.name },
        tracker,
      }

    case TEMPLATE.EDIT: {
      const prior = effective.findTemplate(item)
      const updateDiff = diff(pick(item, REALIZATION_VALUE_FIELDS), pick(prior, REALIZATION_VALUE_FIELDS))
      return { apiFn: updateTemplate, params: [prior.id, updateDiff], tracker }
    }

    case TEMPLATE.DELETE: {
      const prior = effective.findTemplate(item)
      return { apiFn: deleteConceptTemplate, params: prior.id, tracker }
    }

    default:
      throw new Error(`Unknown template action: ${action}`)
  }
}

export default buildTemplateSubmit
