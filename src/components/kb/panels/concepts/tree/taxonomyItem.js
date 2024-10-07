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

// Walk the tree from root item to find an id as well as the path from root to that id
const findItem = (rootItem, id) => {
  const queue = [{ item: rootItem, path: [] }]

  while (queue.length > 0) {
    const { item, path } = queue.shift()
    if (item.id === id) {
      if (0 < item.children?.length) {
        return { item, path: [...path, id] }
      }
      return { item, path }
    }
    if (item.children && item.children.length > 0) {
      queue.push(
        ...item.children.map(child => ({
          item: child,
          path: [...path, item.id],
        }))
      )
    }
  }
  return null
}

export { createRootItem, findItem }
