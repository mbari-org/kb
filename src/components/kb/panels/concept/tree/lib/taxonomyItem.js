import { pendingChild } from '@/lib/kb/model/history'
import { getConcept, getPendingHistory } from '@/lib/kb/model/taxonomy'
// conceptItem is for display needs. It is passed to the ConceptTreeItem component and contains
//  necessary fields for custom tree item display.
const conceptItem = (taxonomy, itemId) => {
  const concept = getConcept(taxonomy, itemId)
  const conceptPending = getPendingHistory(taxonomy, concept.name)
  const parentPending = getPendingHistory(taxonomy, concept.parent)
  const hasPending = 0 < conceptPending.length || !!pendingChild(parentPending, concept.name)

  return {
    id: treeItemId(concept),
    label: itemLabel(concept),
    hasPending,
    mediaCount: concept.media?.length || 0,
    parent: concept.parent,
  }
}

const treeItemId = concept => concept.name

const itemLabel = concept =>
  concept.alternateNames.length === 0
    ? concept.name
    : `${concept.name} (${concept.alternateNames.join(', ')})`

const itemPath = (taxonomy, concept, path = []) => {
  if (!concept) {
    return null
  }

  if (concept.parent) {
    return itemPath(taxonomy, getConcept(taxonomy, concept.parent), [concept.name, ...path])
  }

  return [concept.name, ...path]
}

// treeItem is for RichTreeView structural needs. The necessary children field is constructed when
//  the tree is built. It is not provided to the ConceptTreeItem component so we can't put display
//  needs in it.
const treeItem = concept => {
  return {
    id: treeItemId(concept),
    label: itemLabel(concept),
  }
}

export { conceptItem, itemPath, treeItem }
