import { oniDelete, oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'

const addConcept = async (config, [referenceId, conceptName]) =>
  oniPut(config, ['references', 'add', referenceId, 'to', conceptName])

const createReference = async (config, payload) => oniPost(config, ['references'], payload)

const deleteReference = async (config, referenceId) =>
  oniDelete(config, ['references', referenceId])

const getReference = async (config, referenceId) => oniGet(config, ['references', referenceId])

const getReferences = async (config, params) => {
  const { error, payload } = await oniGet(config, ['references'], params)
  return { error, data: payload?.content }
}
const removeConcept = async (config, [referenceId, conceptName]) =>
  oniPut(config, ['references', 'remove', referenceId, 'from', conceptName])

const updateReference = async (config, [referenceId, payload]) =>
  oniPut(config, ['references', referenceId], payload)

export {
  addConcept,
  createReference,
  deleteReference,
  getReference,
  getReferences,
  removeConcept,
  updateReference,
}
