const itemLabel = concept => {
  if (concept.alternateNames.length === 0) {
    return concept.name
  } else {
    return `${concept.name} (${concept.alternateNames.join(", ")})`
  }
}

const treeItem = (taxonomy, name, parent) => {
  const concept = taxonomy[name]
  const label = itemLabel(concept)
  const children = concept.children?.map(child => {
    return treeItem(taxonomy, child, name)
  })

  return { id: concept.name, label, parent, children }
}

const createRootItem = taxonomy => treeItem(taxonomy, taxonomy._root_)

const findItem = (rootItem, id) => {
  const queue = [rootItem]
  while (queue.length > 0) {
    const item = queue.shift()
    if (item.id === id) {
      return item
    }
    if (item.children && item.children.length > 0) {
      queue.push(...item.children)
    }
  }
  return null
}

export { findItem, createRootItem }
