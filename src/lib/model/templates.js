import { getExplicitTemplates } from '@/lib/api/templates'
import { pick } from '@/lib/utils'

import { REALIZATION_FIELDS } from './realization'

const TEMPLATE_FIELDS = [...REALIZATION_FIELDS, 'templateId']

export const EMPTY_TEMPLATE = Object.fromEntries(TEMPLATE_FIELDS.map(field => [field, '']))

export const loadTemplates = async (apiFns, concept) => {
  if (concept.templates) {
    return concept.templates
  }
  const templates = await apiFns.apiPayload(getExplicitTemplates, concept.name)
  return templates || []
}

export const pickTemplate = object => pick(object, TEMPLATE_FIELDS)
