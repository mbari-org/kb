import { oniDelete, oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'

const getConceptLinkRealizations = async (config, conceptName) =>
  oniGet(config, ['linkrealizations', 'concept', conceptName])

const createRealization = async (config, realization) =>
  oniPost(config, ['linkrealizations'], realization)

const deleteRealization = async (config, realizationId) =>
  oniDelete(config, ['linkrealizations', realizationId])

const updateRealization = async (config, [realizationId, realization]) =>
  oniPut(config, ['linkrealizations', realizationId], realization)

export { createRealization, deleteRealization, getConceptLinkRealizations, updateRealization }
