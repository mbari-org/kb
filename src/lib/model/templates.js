import { getExplicitTemplates } from '@/lib/api/templates'
import { pick } from '@/lib/utils'

import { REALIZATION_FIELDS, REALIZATION_VALUE_FIELDS } from './realization'

const TEMPLATE_FIELDS = [...REALIZATION_FIELDS, 'templateId']

export const EMPTY_TEMPLATE = Object.fromEntries(TEMPLATE_FIELDS.map(field => [field, '']))

const asTemplateKey = template =>
  `${template.linkName}|${template.toConcept}|${template.linkValue}`.replace(/\s/g, '')

const matchingTemplateString = (template, templateStrOrObj) => {
  const otherKey =
    typeof templateStrOrObj === 'string'
      ? templateStrOrObj.replace(/\s/g, '')
      : asTemplateKey(templateStrOrObj)
  return asTemplateKey(template) === otherKey
}

const parseTemplate = template => {
  if (typeof template !== 'string') {
    return {
      linkName: template.linkName,
      toConcept: template.toConcept,
      linkValue: template.linkValue,
    }
  }
  const [linkName, toConcept, linkValue] = template.split('|').map(part => part.trim())
  return { linkName, toConcept, linkValue }
}

export const loadTemplates = async (apiFns, concept) => {
  if (concept.templates) {
    return concept.templates
  }
  const templates = await apiFns.apiPayload(getExplicitTemplates, concept.name)
  return templates || []
}

export const pickTemplate = object => pick(object, TEMPLATE_FIELDS)

export const isIdentical = (tmplA, tmplB) => REALIZATION_VALUE_FIELDS.every(field => tmplA[field] === tmplB[field])

export { matchingTemplateString, parseTemplate }
