import { deleteConcept } from '@/lib/services/api/oni/concept'

const submitDelete = async (conceptName, apiResult) => apiResult(deleteConcept, conceptName)

export default submitDelete
