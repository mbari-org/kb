import { deleteConcept } from '@/lib/services/api/oni/concept'

const submitDelete = async (conceptName, apiResult) => {
  return apiResult(deleteConcept, conceptName)
}

export default submitDelete
