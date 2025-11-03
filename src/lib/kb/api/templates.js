import { oniDelete, oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'
import { paramsQs } from '@/lib/services/params'

const createConceptTemplate = async (config, payload) => oniPost({ config, path: ['linktemplates'], data: payload })

const deleteConceptTemplate = async (config, templateId) =>
  oniDelete({ config, path: ['linktemplates', templateId] })

const getTemplates = async (config, params) => oniGet({ config, path: ['linktemplates'], qs: paramsQs(params) })

const getTemplatesCount = async config => {
  const { error, payload } = await oniGet({ config, path: ['linktemplates', 'count'] })
  return { error, result: payload?.count }
}

const getAvailableTemplates = async (config, conceptName) =>
  oniGet({ config, path: ['linktemplates', 'query', 'for', conceptName] })

const getConceptTemplateCount = async (config, conceptName) => {
  const { error, payload } = await oniGet({ config, path: ['linktemplates', 'concept', 'count', conceptName] })
  return { error, result: payload }
}

const getExplicitTemplates = async (config, conceptName) =>
  oniGet({ config, path: ['linktemplates', 'concept', conceptName] })

const getToConceptTemplateCount = async (config, conceptName) => {
  const { error, payload } = await oniGet({ config, path: ['linktemplates', 'toconcept', 'count', conceptName] })
  return { error, result: payload }
}

const getToConceptTemplates = async (config, conceptName) =>
  oniGet({ config, path: ['linktemplates', 'toconcept', conceptName] })

const renameToConceptTemplates = async (config, payload) =>
  oniPost({ config, path: ['linktemplates', 'toconcept', 'rename'], data: payload })

const updateTemplate = async (config, [templateId, payload]) =>
  oniPut({ config, path: ['linktemplates', templateId], data: payload })

export {
  createConceptTemplate,
  deleteConceptTemplate,
  getAvailableTemplates,
  getConceptTemplateCount,
  getExplicitTemplates,
  getTemplates,
  getTemplatesCount,
  getToConceptTemplateCount,
  getToConceptTemplates,
  renameToConceptTemplates,
  updateTemplate,
}
