import { oniDelete, oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'

const addConcept = async (config, [referenceId, conceptName]) =>
  oniPut(config, ['reference', 'add', referenceId, 'to', conceptName])

const createReference = async (config, payload) => oniPost(config, ['reference'], payload)

const deleteReference = async (config, referenceId) => oniDelete(config, ['reference', referenceId])

const getReference = async (config, referenceId) => oniGet(config, ['reference', referenceId])

const getReferences = async (config, params) => oniGet(config, ['reference'], params)

const removeConcept = async (config, [referenceId, conceptName]) =>
  oniPut(config, ['reference', 'remove', referenceId, 'from', conceptName])

const updateReference = async (config, [referenceId, payload]) =>
  oniPut(config, ['reference', referenceId], payload)

export {
  addConcept,
  createReference,
  deleteReference,
  getReference,
  getReferences,
  removeConcept,
  updateReference,
}
