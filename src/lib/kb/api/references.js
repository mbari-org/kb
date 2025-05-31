import { oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'

const createReference = async (config, payload) => oniPost(config, ['reference'], payload)

const getReferences = async (config, params) => oniGet(config, ['reference'], params)

const updateReference = async (config, payload) => oniPut(config, ['reference'], payload)

export { createReference, getReferences, updateReference }
