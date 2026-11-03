
// treeItem is for RichTreeView structural needs. The label is the immutable primary name;
//  display data (aliases, media, pending) is rendered by ConceptTreeLabel from contexts,
//  keeping item objects shareable across non-structural taxonomy updates.
const treeItem = concept => {
  return {
    id: concept.name,
    label: concept.name,
  }
}

export { treeItem }
