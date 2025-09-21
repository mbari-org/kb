
const treeItemId = concept => concept.name

const itemLabel = concept =>
  concept.alternateNames.length === 0
    ? concept.name
    : `${concept.name} (${concept.alternateNames.join(', ')})`

// treeItem is for RichTreeView structural needs. The necessary children field is constructed when
//  the tree is built. It is not provided to the ConceptTreeItem component so we can't put display
//  needs in it.
const treeItem = concept => {
  return {
    id: treeItemId(concept),
    label: itemLabel(concept),
  }
}

export { treeItem }
