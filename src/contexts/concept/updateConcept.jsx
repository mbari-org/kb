const updateConcept = async (conceptId, conceptData) => {
  try {
    const response = await axios.put(`/concepts/${conceptId}`, conceptData)
    return response.data
  } catch (error) {
    throw error
  }
}

export default updateConcept
