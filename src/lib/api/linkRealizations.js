import { oniDelete, oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'

const getConceptLinkRealizations = async (config, conceptName) =>
  oniGet({ config, path: ['linkrealizations', 'concept', conceptName] })

const createRealization = async (config, realization) =>
  oniPost({ config, path: ['linkrealizations'], data: realization })

const deleteRealization = async (config, realizationId) =>
  oniDelete({ config, path: ['linkrealizations', realizationId] })

const updateRealization = async (config, [realizationId, realization]) =>
  oniPut({ config, path: ['linkrealizations', realizationId], data: realization })

export { createRealization, deleteRealization, getConceptLinkRealizations, updateRealization }
