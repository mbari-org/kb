import { deleteConcept } from '@/lib/kb/api/concept'

const saveDelete = async (conceptName, apiResult) => {
  return apiResult(deleteConcept, conceptName)
}

export default saveDelete
