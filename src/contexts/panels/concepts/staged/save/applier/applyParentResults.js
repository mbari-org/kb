const applyParentResults = ({ concept, result }) => {
  concept.parent = result.update.parentName
}

export default applyParentResults
