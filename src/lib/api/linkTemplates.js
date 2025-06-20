import { oniDelete, oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'

const createConceptTemplate = async (config, payload) => oniPost(config, ['linktemplates'], payload)

const deleteConceptTemplate = async (config, templateId) =>
  oniDelete(config, ['linktemplates', templateId])

const getTemplatesCount = async config => {
  const { error, payload } = await oniGet(config, ['linktemplates', 'count'])
  return { error, result: payload?.count }
}

const getTemplates = async (config, params) => oniGet(config, ['linktemplates'], params)

const getAvailableTemplates = async (config, conceptName) =>
  oniGet(config, ['linktemplates', 'query', 'for', conceptName])

const getExplicitTemplates = async (config, conceptName) =>
  oniGet(config, ['linktemplates', 'concept', conceptName])

const getToConceptTemplateCount = async (config, conceptName) =>
  oniGet(config, ['linktemplates', 'toconcept', 'count', conceptName])

const getToConceptTemplates = async (config, conceptName) =>
  oniGet(config, ['linktemplates', 'toconcept', conceptName])

const renameToConceptTemplates = async (config, payload) =>
  oniPost(config, ['linktemplates', 'toconcept', 'rename'], payload)

const updateTemplate = async (config, [templateId, payload]) =>
  oniPut(config, ['linktemplates', templateId], payload)

export {
  createConceptTemplate,
  deleteConceptTemplate,
  getAvailableTemplates,
  getExplicitTemplates,
  getTemplates,
  getTemplatesCount,
  getToConceptTemplateCount,
  getToConceptTemplates,
  renameToConceptTemplates,
  updateTemplate,
}
