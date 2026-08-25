import { oniGet, oniUserDelete, oniUserPost, oniUserPut } from '@/lib/services/oni/methods'
import { paramsQs } from '@/lib/services/params'

const createRealization = async (config, realization) =>
  oniUserPost({ config, path: ['linkrealizations'], data: realization })

const deleteRealization = async (config, realizationId) =>
  oniUserDelete({ config, path: ['linkrealizations', realizationId] })

const getConceptLinkRealizations = async (config, conceptName) =>
  oniGet({ config, path: ['linkrealizations', 'concept', conceptName] })

const getRealizations = async (config, params) => oniGet({ config, path: ['linkrealizations'], qs: paramsQs(params) })

const updateRealization = async (config, [realizationId, realization]) =>
  oniUserPut({ config, path: ['linkrealizations', realizationId], data: realization })

export { createRealization, deleteRealization, getConceptLinkRealizations, getRealizations, updateRealization }
