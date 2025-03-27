import { deleteConcept } from '@/lib/services/oni/api/concept'

const submitDelete = async (conceptName, apiResult) => apiResult(deleteConcept, conceptName)

export default submitDelete
