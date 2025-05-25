import { deleteConcept } from '@/lib/kb/api/concept'

const saveDelete = async (conceptName, apiResult) => apiResult(deleteConcept, conceptName)

export default saveDelete
