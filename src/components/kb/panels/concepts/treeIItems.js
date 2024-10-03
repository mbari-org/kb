const itemLabel = concept => {
  if (concept.alternateNames.length === 0) {
    return concept.name
  } else {
    return `${concept.name} (${concept.alternateNames.join(", ")})`
  }
}

const treeItem = (taxonomy, name) => {
  const concept = taxonomy[name]
  const label = itemLabel(concept)
  const children = concept.children?.map(child => {
    return treeItem(taxonomy, child)
  })

  return {
    id: concept.name,
    label,
    children,
  }
}

const treeItems = taxonomy => {
  const treeItems = [treeItem(taxonomy, taxonomy._root_)]

  return treeItems
}

export default treeItems
