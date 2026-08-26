import { oniGet, oniUserDelete, oniUserPost, oniUserPut } from '@/lib/services/oni/methods'
import { paramsQs } from '@/lib/services/params'

const createRealization = async (config, realization) =>
  oniUserPost({ config, path: ['linkrealizations'], data: realization })

const deleteRealization = async (config, realizationId) =>
  oniUserDelete({ config, path: ['linkrealizations', realizationId] })

const getConceptLinkRealizations = async (config, conceptName) =>
  oniGet({ config, path: ['linkrealizations', 'concept', conceptName] })

const getRealizations = async (config, params) => oniGet({ config, path: ['linkrealizations'], qs: paramsQs(params) })

const getToConceptRealizations = async (config, conceptName) =>
  oniGet({ config, path: ['linkrealizations', 'toconcept', conceptName] })

const getToConceptRealizationsCount = async (config, conceptName) => {
  const { error, payload } = await oniGet({ config, path: ['linkrealizations', 'toconcept', 'count', conceptName] })
  return { error, result: payload }
}

const renameToConceptRealizations = async (config, payload) =>
  oniUserPut({ config, path: ['linkrealizations', 'toconcept', 'rename'], data: payload })

const updateRealization = async (config, [realizationId, realization]) =>
  oniUserPut({ config, path: ['linkrealizations', realizationId], data: realization })

export {
  createRealization,
  deleteRealization,
  getConceptLinkRealizations,
  getRealizations,
  getToConceptRealizations,
  getToConceptRealizationsCount,
  renameToConceptRealizations,
  updateRealization,
}
