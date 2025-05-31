import { oniGet, oniPost } from '@/lib/services/oni/methods'

const createReference = async (config, payload) => oniPost(config, ['reference'], payload)

const getReferences = async (config, params) => oniGet(config, ['reference'], params)

export { createReference, getReferences }
