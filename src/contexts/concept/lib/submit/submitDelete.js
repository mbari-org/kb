import { deleteConcept } from '@/lib/services/oni/api/concept'

const submitDelete = async (config, conceptName) => {
  return deleteConcept(config, conceptName)
}

export default submitDelete
