import { oniDelete, oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'
import { paramsQs } from '@/lib/services/params'

const addConcept = async (config, [referenceId, conceptName]) =>
  oniPut({ config, path: ['references', 'add', referenceId, 'to', conceptName] })

const changeConcept = async (config, [referenceId, fromName, toName]) =>
  Promise.all([
    removeConcept(config, [referenceId, fromName]),
    addConcept(config, [referenceId, toName]),
  ])

const createReference = async (config, payload) => oniPost({ config, path: ['references'], data: payload })

const deleteReference = async (config, referenceId) =>
  oniDelete({ config, path: ['references', referenceId] })

const getReference = async (config, referenceId) => oniGet({ config, path: ['references', referenceId] })

const getReferences = async (config, params) => oniGet({ config, path: ['references'], qs: paramsQs(params) })

const removeConcept = async (config, [referenceId, conceptName]) =>
  oniPut({ config, path: ['references', 'remove', referenceId, 'from', conceptName] })

const updateReference = async (config, [referenceId, payload]) =>
  oniPut({ config, path: ['references', referenceId], data: payload })

export {
  addConcept,
  changeConcept,
  createReference,
  deleteReference,
  getReference,
  getReferences,
  removeConcept,
  updateReference,
}
