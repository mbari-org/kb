import {
  getConceptChildren as apiChildren,
  getConcept as apiConcept,
  getConceptPhylogenyDown as apiDescendants,
  getConceptNames as apiConceptNames,
  deleteConcept as apiDelete,
  getConceptParent as apiParent,
  normalizeConcept,
} from '@/lib/api/concept'
import { getMedia } from '@/lib/api/media'

import { getNames as apiNames, getRanks as apiRanks, getRoot as apiRoot } from '@/lib/api/taxonomy'

import { createError } from '@/lib/errors'
import { orderedAliases } from '@/lib/model/aliases'
import { filterRanks } from '@/lib/model/rank'

import { treeItem } from '@/components/kb/panels/concepts/sidebar/tree/lib/taxonomyItem'
import { typeMediaItem } from '@/lib/model/media'

const treeNodeCache = new Map()

const buildTree = taxonomy => {
  const buildNode = concept => {
    const children = concept.children?.map(child => buildNode(taxonomy.conceptMap[child])) || []

    const cached = treeNodeCache.get(concept.name)
    if (
      cached &&
      cached.children.length === children.length &&
      cached.children.every((child, index) => child === children[index])
    ) {
      return cached
    }

    const item = treeItem(concept)
    item.children = children
    treeNodeCache.set(concept.name, item)
    return item
  }

  return buildNode(taxonomy.conceptMap[taxonomy.rootName])
}

// Items-array companion to buildTree: because buildTree shares unchanged nodes, the
//  array only needs replacing when the root node identity changes.
let treeItemsCache = { items: null, root: null }

const buildTreeItems = taxonomy => {
  const root = buildTree(taxonomy)
  if (treeItemsCache.root !== root) {
    treeItemsCache = { items: [root], root }
  }
  return treeItemsCache.items
}

const closestConcept = (taxonomy, concept) => {
  const parent = getConcept(taxonomy, concept.parent)

  if (parent.children.length === 1) {
    return parent
  }

  const childIndex = parent.children.indexOf(concept.name)
  if (childIndex === 0) {
    return getConcept(taxonomy, parent.children[1])
  }

  return getConcept(taxonomy, parent.children[childIndex - 1])
}

const deleteConcept = async (taxonomy, concept, apiFns) => {
  if (0 < concept.children.length) {
    throw createError('Delete Validation Error', `Cannot delete Concept "${concept.name}" with children.`, {
      childCount: concept.children.length,
      conceptName: concept.name,
    })
  }

  await apiFns.apiPayload(apiDelete, concept.name)

  const conceptMap = { ...taxonomy.conceptMap }
  delete conceptMap[concept.name]

  let aliasMap
  if (0 < concept.alternateNames.length) {
    aliasMap = { ...taxonomy.aliasMap }
    concept.alternateNames.forEach(alternateName => {
      delete aliasMap[alternateName]
    })
  } else {
    aliasMap = taxonomy.aliasMap
  }

  const parent = { ...getConcept(taxonomy, concept.parent) }

  parent.children = parent.children.filter(child => child !== concept.name)
  insertConcept(parent, conceptMap, aliasMap)

  const names = await apiFns.apiPayload(apiNames)

  const updatedTaxonomy = {
    ...taxonomy,
    aliasMap,
    conceptMap,
    names,
  }

  return { closestConcept: closestConcept(taxonomy, concept), taxonomy: updatedTaxonomy }
}

const descendants = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  if (!concept) return []

  const allDescendants = []
  const processChildren = children => {
    children.forEach(child => {
      const childConcept = getConcept(taxonomy, child)
      allDescendants.push(childConcept)
      if (childConcept.children?.length > 0) {
        processChildren(childConcept.children)
      }
    })
  }

  processChildren(concept.children)
  return allDescendants
}

const filterTaxonomyRanks = (taxonomy, field, otherValue) => filterRanks(taxonomy.ranks, field, otherValue)

const getConcept = (taxonomy, conceptName) => {
  return taxonomy?.conceptMap[conceptName] || taxonomy?.aliasMap[conceptName] || null
}

const getConceptPrimaryName = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  return concept?.name
}

const getNames = taxonomy => taxonomy?.names

const isStructureOnly = concept => Boolean(concept && !concept.aliases)

const isConceptLoaded = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  return Boolean(
    concept &&
    !isStructureOnly(concept) &&
    concept.children &&
    concept.children.every(child => taxonomy.conceptMap[child]?.children) &&
    (concept.name === taxonomy.rootName || concept.parent)
  )
}

const areConceptChildrenLoaded = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  return Boolean(concept?.children?.every(child => taxonomy.conceptMap[child]?.children))
}

const isDescendant = (taxonomy, conceptName, descendantName) => {
  const concept = getConcept(taxonomy, conceptName)
  if (!concept) {
    return false
  }
  if (concept.name === descendantName) {
    return true
  }
  return concept.children.some(child => isDescendant(taxonomy, child, descendantName))
}

const isRoot = (taxonomy, concept) => concept.name === taxonomy.rootName

const getConceptPath = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  if (!concept) return null
  if (isRoot(taxonomy, concept)) return [concept.name]

  const ancestors = getAncestorNames(taxonomy, conceptName)
  if (ancestors.at(-1) !== taxonomy.rootName) return null

  return [...ancestors.reverse(), concept.name]
}

const getAncestorNames = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  if (!concept) return []

  const ancestors = []
  let currentConcept = concept

  while (currentConcept.parent && !isRoot(taxonomy, currentConcept)) {
    const parent = getConcept(taxonomy, currentConcept.parent)
    if (parent) {
      ancestors.push(parent.name)
      currentConcept = parent
    } else {
      break
    }
  }

  return ancestors
}

const loadTaxonomy = async apiFns => {
  treeNodeCache.clear()

  const [root, names, ranks] = await Promise.all([
    apiFns.apiPayload(apiRoot),
    apiFns.apiPayload(apiNames),
    apiFns.apiPayload(apiRanks),
  ])

  const rootConcept = await apiFns.apiPayload(apiConcept, root.name)
  await normalizeConcept(apiFns, rootConcept)

  const rootConceptNames = await apiFns.apiPayload(apiConceptNames, rootConcept.name)
  rootConcept.aliases = orderedAliases(rootConceptNames)

  const aliasMap = rootConcept.aliases.reduce((acc, alias) => {
    acc[alias.name] = rootConcept
    return acc
  }, {})
  const conceptMap = { [rootConcept.name]: rootConcept }

  const taxonomy = {
    aliasMap,
    conceptMap,
    names,
    ranks,
    rootName: rootConcept.name,
  }

  return { taxonomy }
}

// Taxonomy concepts are look-ahead loaded for tree display.
const loadTaxonomyConcept = async (taxonomy, conceptName, apiFns) => {
  const updatedTaxonomy = {
    ...taxonomy,
    conceptMap: { ...taxonomy.conceptMap },
    aliasMap: { ...taxonomy.aliasMap },
  }

  const conceptMap = updatedTaxonomy.conceptMap
  const aliasMap = updatedTaxonomy.aliasMap

  const taxonomyConcept = getConcept(taxonomy, conceptName)
  const structureChildren = taxonomyConcept?.children
  const structureParent = taxonomyConcept?.parent

  let concept
  if (!taxonomyConcept || isStructureOnly(taxonomyConcept)) {
    concept = await apiFns.apiPayload(apiConcept, conceptName)
    await normalizeConcept(apiFns, concept)
    if (structureChildren) {
      concept.children = structureChildren
    }
    if (structureParent !== undefined) {
      concept.parent = structureParent
    }
  } else {
    concept = { ...taxonomyConcept }
  }

  if (concept.name !== taxonomy.rootName && !concept.parent) {
    const parent = await apiFns.apiPayload(apiParent, concept.name)
    concept.parent = parent.name
  }

  if (!concept.aliases) {
    const conceptNames = await apiFns.apiPayload(apiConceptNames, concept.name)
    concept.aliases = orderedAliases(conceptNames)
  }

  // If the concept already has children, we only need to load the concept's grand children. This
  //  typically happens when a child concept is selected, or after phylogeny structure expand.
  if (concept?.children) {
    await Promise.all(concept.children.map(child => loadTaxonomyConceptChildren(updatedTaxonomy, child, apiFns)))
    insertConcept(concept, conceptMap, aliasMap)
    return { concept: concept, taxonomy: updatedTaxonomy }
  }

  const children = await apiFns.apiPayload(apiChildren, concept.name)
  concept.children = children.map(child => child.name)
  children.forEach(child => {
    child.parent = concept.name
    insertConcept(child, conceptMap, aliasMap)
  })

  await Promise.all(concept.children.map(child => loadTaxonomyConceptChildren(updatedTaxonomy, child, apiFns)))

  if (isRoot(taxonomy, concept)) {
    insertConcept(concept, conceptMap, aliasMap)
    return { concept: concept, taxonomy: updatedTaxonomy }
  }

  // We're loading a concept the taxonomy knows nothing about (from either a name search or an
  //  initial loading of saved state). To load and connect the concept into the tree, build a chain
  //  of concept names from the concept to the root. For concepts in the chain but not in the
  //  taxonomy, fetch the parent to get the necessary name. Then walk the chain from the top and
  //  load each concept, children and grandchildren not already loaded.

  let nextAncestor = await apiFns.apiPayload(apiParent, concept.name)
  concept.parent = nextAncestor.name
  const conceptAncestry = [concept.name]

  while (!updatedTaxonomy.conceptMap[nextAncestor.name]) {
    conceptAncestry.push(nextAncestor.name)
    nextAncestor = await apiFns.apiPayload(apiParent, nextAncestor.name)
  }
  conceptAncestry.push(nextAncestor.name)

  while (!isRoot(taxonomy, nextAncestor)) {
    const parent = await apiFns.apiPayload(apiParent, nextAncestor.name)
    nextAncestor = updatedTaxonomy.conceptMap[parent.name]
    conceptAncestry.push(nextAncestor.name)
  }
  conceptAncestry.reverse()

  for (const name of conceptAncestry) {
    const children = await loadTaxonomyConceptChildren(updatedTaxonomy, name, apiFns)
    await Promise.all(children.map(child => loadTaxonomyConceptChildren(updatedTaxonomy, child, apiFns)))
  }

  // Wait until here to map the primary loaded concept (by conceptName) since the above processing
  // may have loaded that concept as a child of its parent and we would lose the "extra" data
  // (aliases, etc) that we already loaded for it.
  insertConcept(concept, conceptMap, aliasMap)

  return { concept: concept, taxonomy: updatedTaxonomy }
}

const loadTaxonomyConceptChildren = async (updatableTaxonomy, conceptName, apiFns) => {
  const concept = getConcept(updatableTaxonomy, conceptName)

  // if (!concept) return []

  const conceptMap = updatableTaxonomy.conceptMap
  const aliasMap = updatableTaxonomy.aliasMap

  if (concept && !concept.children) {
    const updatedConcept = { ...concept }
    const children = await apiFns.apiPayload(apiChildren, concept.name)
    updatedConcept.children = children.map(child => child.name)
    children.forEach(child => {
      child.parent = concept.name
      insertConcept(child, conceptMap, aliasMap)
    })
    insertConcept(updatedConcept, conceptMap, aliasMap)
    return updatedConcept.children
  }

  return concept.children
}

const loadTaxonomyConceptGrandchildren = async (taxonomy, conceptName, apiFns) => {
  const updatedTaxonomy = {
    ...taxonomy,
    conceptMap: { ...taxonomy.conceptMap },
    aliasMap: { ...taxonomy.aliasMap },
  }

  const concept = getConcept(taxonomy, conceptName)
  await Promise.all(concept.children.map(child => loadTaxonomyConceptChildren(updatedTaxonomy, child, apiFns)))

  return { taxonomy: updatedTaxonomy }
}

const rebindAliases = (concept, aliasMap) => {
  concept.alternateNames.forEach(alternateName => {
    aliasMap[alternateName] = concept
  })
}

const MEDIA_FETCH_BATCH_SIZE = 6
const MEDIA_FETCH_ATTEMPTS = 2

const chunkNames = (names, size) => {
  const batches = []
  for (let index = 0; index < names.length; index += size) {
    batches.push(names.slice(index, index + size))
  }
  return batches
}

const applyConceptMedia = (conceptMap, aliasMap, name, media) => {
  const mapped = conceptMap[name]
  if (!mapped) return

  const updated = {
    ...mapped,
    media: media.map(typeMediaItem),
  }
  conceptMap[name] = updated
  rebindAliases(updated, aliasMap)
}

const fetchMediaBatch = async (names, apiFns) => {
  const succeeded = []
  const failed = []

  await Promise.all(
    names.map(async name => {
      const media = await apiFns.apiPayload(getMedia, name, true)
      if (media) {
        succeeded.push([name, media])
        return
      }
      failed.push(name)
    })
  )

  return { failed, succeeded }
}

// Paced batches keep the API/browser from collapsing; never write media:[] on failure.
// Results stream out via onBatch so callers commit incrementally; unresolved names are
//  left with media undefined (icon absent) and refetched on a later expand.
const loadConceptMediaIncremental = async (conceptNames, apiFns, onBatch) => {
  let pending = [...conceptNames]

  for (let attempt = 1; attempt <= MEDIA_FETCH_ATTEMPTS && pending.length > 0; attempt += 1) {
    const stillFailed = []

    for (const batch of chunkNames(pending, MEDIA_FETCH_BATCH_SIZE)) {
      const { failed, succeeded } = await fetchMediaBatch(batch, apiFns)
      if (succeeded.length > 0) {
        onBatch(succeeded)
      }
      stillFailed.push(...failed)
    }

    pending = stillFailed
  }
}

// Expand-all / export: one phylogeny/down call, structure-only stubs for unloaded nodes.
// Returns mediaNames for the caller to fill asynchronously (tree icons); full concept
//  payloads load on select.
const loadTaxonomyConceptDescendants = async (taxonomy, concept, apiFns) => {
  const phylogeny = await apiFns.apiPayload(apiDescendants, concept.name)

  const updatedTaxonomy = {
    ...taxonomy,
    conceptMap: { ...taxonomy.conceptMap },
    aliasMap: { ...taxonomy.aliasMap },
  }
  const conceptMap = updatedTaxonomy.conceptMap
  const aliasMap = updatedTaxonomy.aliasMap
  const descendantNames = []

  const mergeNode = (node, parentName) => {
    const childNames = (node.children || []).map(child => child.name)
    const existing = conceptMap[node.name]

    if (existing) {
      const updated = {
        ...existing,
        children: childNames,
      }
      if (parentName !== undefined && updated.name !== taxonomy.rootName) {
        updated.parent = parentName
      }
      conceptMap[node.name] = updated
      rebindAliases(updated, aliasMap)
    } else {
      insertConcept(
        {
          alternateNames: node.alternativeNames || [],
          children: childNames,
          name: node.name,
          parent: parentName,
        },
        conceptMap,
        aliasMap
      )
    }

    if (0 < childNames.length) {
      descendantNames.push(node.name)
    }

    ;(node.children || []).forEach(child => mergeNode(child, node.name))
  }

  mergeNode(phylogeny, concept.parent)

  const mediaNames = []
  const queue = [phylogeny]
  while (queue.length > 0) {
    const node = queue.shift()
    if (conceptMap[node.name]?.media === undefined) {
      mediaNames.push(node.name)
    }
    queue.push(...(node.children || []))
  }

  return { descendantNames, mediaNames, taxonomy: updatedTaxonomy }
}

const insertConcept = (concept, conceptMap, aliasMap) => {
  // Absent media means "not fetched yet"; an array gets canonical mediaType items.
  concept.media = concept.media?.map(typeMediaItem)

  delete concept.linkRealizations

  conceptMap[concept.name] = concept
  concept.alternateNames.forEach(alternateName => {
    aliasMap[alternateName] = concept
  })
}

const removeTaxonomyConcept = (taxonomy, concept) => {
  if (concept.children.length > 0) {
    throw createError('Delete Validation Error', `Cannot delete concept "${concept.name}" because it has children`, {
      conceptName: concept.name,
      childCount: concept.children.length,
    })
  }

  const conceptMap = { ...taxonomy.conceptMap }
  delete conceptMap[concept.name]

  const aliasMap = { ...taxonomy.aliasMap }
  concept.alternateNames.forEach(alternateName => {
    delete aliasMap[alternateName]
  })

  const parentConcept = { ...conceptMap[concept.parent] }
  parentConcept.children = parentConcept.children.filter(child => child !== concept.name)
  insertConcept(parentConcept, conceptMap, aliasMap)

  const updatedTaxonomy = {
    ...taxonomy,
    conceptMap,
    aliasMap,
  }

  return { taxonomy: updatedTaxonomy }
}

export {
  applyConceptMedia,
  areConceptChildrenLoaded,
  buildTree,
  buildTreeItems,
  closestConcept,
  deleteConcept,
  descendants,
  filterTaxonomyRanks,
  getAncestorNames,
  getConcept,
  getConceptPath,
  getConceptPrimaryName,
  getNames,
  insertConcept,
  isConceptLoaded,
  isDescendant,
  isRoot,
  isStructureOnly,
  loadConceptMediaIncremental,
  loadTaxonomy,
  loadTaxonomyConcept,
  loadTaxonomyConceptDescendants,
  loadTaxonomyConceptGrandchildren,
  removeTaxonomyConcept,
}
