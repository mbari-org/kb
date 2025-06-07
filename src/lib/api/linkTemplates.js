import { oniDelete, oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'

const createConceptLinkTemplate = async (config, payload) =>
  oniPost(config, ['linktemplates'], payload)

const deleteConceptLinkTemplate = async (config, templateId) =>
  oniDelete(config, ['linktemplates', templateId])

const getLinkTemplateCount = async config => oniGet(config, ['linktemplates', 'count'])

const getLinkTemplates = async config => oniGet(config, ['linktemplates'])

const getConceptLinkTemplates = async (config, conceptName) =>
  oniGet(config, ['linktemplates', 'concept', conceptName])

const getToConceptLinkTemplateCount = async (config, conceptName) =>
  oniGet(config, ['linktemplates', 'toconcept', 'count', conceptName])

const getToConceptLinkTemplates = async (config, conceptName) =>
  oniGet(config, ['linktemplates', 'toconcept', conceptName])

const renameToConceptLinkTemplates = async (config, payload) =>
  oniPost(config, ['linktemplates', 'toconcept', 'rename'], payload)

const updateConceptLinkTemplate = async (config, [templateId, payload]) =>
  oniPut(config, ['linktemplates', templateId], payload)

export {
  createConceptLinkTemplate,
  deleteConceptLinkTemplate,
  getConceptLinkTemplates,
  getLinkTemplateCount,
  getLinkTemplates,
  getToConceptLinkTemplateCount,
  getToConceptLinkTemplates,
  renameToConceptLinkTemplates,
  updateConceptLinkTemplate,
}
