import { deleteConcept } from '@/lib/api/concept'

const saveDelete = async (conceptName, apiResult) => apiResult(deleteConcept, conceptName)

export default saveDelete
