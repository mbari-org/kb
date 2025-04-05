import { deleteConcept } from '@/lib/kb/api/concept'

const submitDelete = async (conceptName, apiResult) => {
  return apiResult(deleteConcept, conceptName)
}

export default submitDelete
