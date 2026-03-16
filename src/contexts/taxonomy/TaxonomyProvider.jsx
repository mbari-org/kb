import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import UserContext from '@/contexts/user/UserContext'
import TaxonomyContext from './TaxonomyContext'

import ConfigContext from '@/contexts/config/ConfigContext'

import { getConcept as apiConcept } from '@/lib/model/concept'

import {
  closestConcept as closestTaxonomyConcept,
  filterTaxonomyRanks,
  getAncestorNames as getTaxonomyAncestorNames,
  getConcept as getTaxonomyConcept,
  getConceptPrimaryName as getTaxonomyConceptPrimaryName,
  getNames as getTaxonomyNames,
  insertConcept,
  isConceptLoaded as isTaxonomyConceptLoaded,
  isDescendant as isDescendantConcept,
  isRoot as isTaxonomyRoot,
  loadTaxonomy,
  loadTaxonomyConcept,
  loadTaxonomyConceptDescendants,
  removeTaxonomyConcept,
} from '@/lib/model/taxonomy'

import useTaxonomyIntegrity from '@/lib/hooks/useTaxonomyIntegrity'

import { isAdmin } from '@/lib/auth/role'

import { isEqual } from '@/lib/utils'

const loadInitialTaxonomy = async apiFns => {
  try {
    const { taxonomy: rootTaxonomy } = await loadTaxonomy(apiFns)
    return loadTaxonomyConcept(rootTaxonomy, rootTaxonomy.rootName, apiFns)
  } catch (error) {
    return { error }
  }
}

const TaxonomyProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()

  const { user } = use(UserContext)
  const { apiFns } = use(ConfigContext)

  const [taxonomy, setTaxonomy] = useState(null)

  const checkIntegrity = useTaxonomyIntegrity()

  const updateTaxonomy = useCallback(
    updatedTaxonomy => {
      try {
        checkIntegrity(updatedTaxonomy)
      } catch (error) {
        showBoundary(error)
        return taxonomy
      }
      setTaxonomy(updatedTaxonomy)
      return updatedTaxonomy
    },
    [checkIntegrity, showBoundary, taxonomy]
  )

  const conceptEditsRefresh = useCallback(
    async (freshConcept, staleConcept) => {
      if (freshConcept === staleConcept) {
        return { concept: freshConcept, taxonomy }
      }

      const aliasMap = { ...taxonomy.aliasMap }
      const conceptMap = { ...taxonomy.conceptMap }
      let names = taxonomy.names

      const aliasesChanged = !isEqual(freshConcept.alternateNames, staleConcept.alternateNames)
      const childrenChanged = !isEqual(freshConcept.children, staleConcept.children)
      const nameChanged = freshConcept.name !== staleConcept.name
      const parentChanged = freshConcept.parent !== staleConcept.parent

      delete conceptMap[staleConcept.name]
      staleConcept.alternateNames.forEach(alternateName => {
        delete aliasMap[alternateName]
      })
      insertConcept(freshConcept, conceptMap, aliasMap)

      if (childrenChanged) {
        const addedChildren = freshConcept.children.filter(name => !staleConcept.children.includes(name))
        const removedChildren = staleConcept.children.filter(name => !freshConcept.children.includes(name))

        await Promise.all(
          addedChildren
            .filter(childName => childName !== staleConcept.name)
            .map(async childName => {
              const existingChild = conceptMap[childName]
              if (existingChild && existingChild.parent === freshConcept.name) {
                return
              }

              const child = await apiConcept(apiFns, childName)
              child.parent = freshConcept.name
              insertConcept(child, conceptMap, aliasMap)
            })
        )

        removedChildren.forEach(childName => {
          const removed = conceptMap[childName]
          if (removed) {
            if (Array.isArray(removed.alternateNames)) {
              removed.alternateNames.forEach(aliasName => {
                delete aliasMap[aliasName]
              })
            }
            delete conceptMap[childName]
          }
        })
      }

      const copyParent = parentName => {
        const parentConcept = conceptMap[parentName]
        if (!parentConcept) {
          throw new Error(`Cannot refresh concept with missing parent in taxonomy: ${parentName}`)
        }

        return {
          ...parentConcept,
          children: [...(parentConcept.children ?? [])],
        }
      }

      if (parentChanged) {
        const freshParent = copyParent(freshConcept.parent)
        if (!freshParent.children.includes(freshConcept.name)) {
          freshParent.children.push(freshConcept.name)
          freshParent.children.sort()
        }
        insertConcept(freshParent, conceptMap, aliasMap)
        const staleParent = copyParent(staleConcept.parent)
        staleParent.children = staleParent.children.filter(
          child => child !== staleConcept.name && child !== freshConcept.name
        )
        insertConcept(staleParent, conceptMap, aliasMap)
      } else if (nameChanged) {
        const parent = copyParent(freshConcept.parent)
        parent.children = parent.children.filter(child => child !== staleConcept.name)
        if (!parent.children.includes(freshConcept.name)) {
          parent.children.push(freshConcept.name)
          parent.children.sort()
        }
        insertConcept(parent, conceptMap, aliasMap)
      }

      if (aliasesChanged || childrenChanged || nameChanged) {
        names = [...Object.keys(conceptMap), ...Object.keys(aliasMap)].sort()
      }

      const updatedTaxonomy = { ...taxonomy, aliasMap, conceptMap, names }

      const committedTaxonomy = updateTaxonomy(updatedTaxonomy)
      if (committedTaxonomy !== updatedTaxonomy) {
        return { concept: staleConcept, taxonomy: committedTaxonomy || taxonomy }
      }

      return { concept: freshConcept, taxonomy: updatedTaxonomy }
    },
    [apiFns, taxonomy, updateTaxonomy]
  )

  const closestConcept = useCallback(
    conceptName => {
      const concept = getTaxonomyConcept(taxonomy, conceptName)
      return closestTaxonomyConcept(taxonomy, concept)
    },
    [taxonomy]
  )

  const filterRanks = useCallback(
    (field, otherValue) => {
      if (!taxonomy) return []
      const taxonomyRanks = filterTaxonomyRanks(taxonomy, field, otherValue)
      if (isAdmin(user)) {
        return taxonomyRanks
      }
      return taxonomyRanks.filter(rank => rank !== '')
    },
    [taxonomy, user]
  )

  const getConcept = useCallback(
    conceptName => {
      if (!taxonomy) return null
      return getTaxonomyConcept(taxonomy, conceptName)
    },
    [taxonomy]
  )

  const getConceptFromTaxonomy = useCallback((conceptTaxonomy, conceptName) => {
    if (!conceptTaxonomy) return null
    return getTaxonomyConcept(conceptTaxonomy, conceptName)
  }, [])

  const getConceptPrimaryName = useCallback(
    conceptName => {
      if (!taxonomy) return null
      return getTaxonomyConceptPrimaryName(taxonomy, conceptName)
    },
    [taxonomy]
  )

  const getAncestorNames = useCallback(
    conceptName => {
      if (!taxonomy) return []
      return getTaxonomyAncestorNames(taxonomy, conceptName)
    },
    [taxonomy]
  )

  const getNames = useCallback(() => {
    if (!taxonomy) return []
    return getTaxonomyNames(taxonomy)
  }, [taxonomy])

  const getRootName = useMemo(() => taxonomy?.rootName, [taxonomy?.rootName])

  const isConceptLoaded = useCallback(
    conceptName => {
      if (!taxonomy) return false
      return isTaxonomyConceptLoaded(taxonomy, conceptName)
    },
    [taxonomy]
  )

  const isDescendant = useCallback(
    (conceptName, descendantName) => {
      if (!taxonomy) return false
      return isDescendantConcept(taxonomy, conceptName, descendantName)
    },
    [taxonomy]
  )

  const isRoot = useCallback(
    concept => {
      if (!taxonomy) return false
      return isTaxonomyRoot(taxonomy, concept)
    },
    [taxonomy]
  )

  const alreadyLoadingConcept = useRef(false)

  const loadConcept = useCallback(
    async (conceptName, force = false) => {
      if (!taxonomy || !apiFns) return null

      if (!force && isConceptLoaded(conceptName)) {
        const loadedConcept = getTaxonomyConcept(taxonomy, conceptName)
        if (!loadedConcept) {
          throw new Error(`Taxonomy reported concept as loaded but lookup failed: ${conceptName}`)
        }
        return loadedConcept
      }

      if (alreadyLoadingConcept.current) {
        return null
      }

      try {
        alreadyLoadingConcept.current = true

        const { taxonomy: updatedTaxonomy } = await loadTaxonomyConcept(taxonomy, conceptName, apiFns)
        const committedTaxonomy = updateTaxonomy(updatedTaxonomy)
        const effectiveTaxonomy = committedTaxonomy || taxonomy

        return getTaxonomyConcept(effectiveTaxonomy, conceptName)
      } catch (error) {
        showBoundary(error)
      } finally {
        alreadyLoadingConcept.current = false
      }
    },
    [apiFns, isConceptLoaded, showBoundary, taxonomy, updateTaxonomy]
  )

  const loadConceptDescendants = useCallback(
    async concept => {
      if (!apiFns || !taxonomy) return null
      try {
        const { taxonomy: updatedTaxonomy } = await loadTaxonomyConceptDescendants(taxonomy, concept, apiFns)
        const committedTaxonomy = updateTaxonomy(updatedTaxonomy)

        return committedTaxonomy || taxonomy
      } catch (error) {
        showBoundary(error)
      }
    },
    [apiFns, showBoundary, taxonomy, updateTaxonomy]
  )

  const removeConcept = useCallback(
    conceptName => {
      const concept = getTaxonomyConcept(taxonomy, conceptName)
      if (!concept) {
        throw new Error(`Cannot remove missing concept from taxonomy: ${conceptName}`)
      }
      const { taxonomy: updatedTaxonomy } = removeTaxonomyConcept(taxonomy, concept)
      const committedTaxonomy = updateTaxonomy(updatedTaxonomy)
      return committedTaxonomy || taxonomy
    },
    [taxonomy, updateTaxonomy]
  )

  useEffect(() => {
    if (!apiFns || taxonomy) return

    loadInitialTaxonomy(apiFns).then(
      ({ error: taxonomyError, taxonomy: initialTaxonomy }) => {
        if (taxonomyError) {
          showBoundary(taxonomyError)
        } else {
          updateTaxonomy(initialTaxonomy)
        }
      },
      error => {
        showBoundary(error)
      }
    )
  }, [apiFns, taxonomy, showBoundary, updateTaxonomy])

  const value = useMemo(
    () => ({
      conceptEditsRefresh,
      closestConcept,
      filterRanks,
      getConcept,
      getConceptFromTaxonomy,
      getConceptPrimaryName,
      getAncestorNames,
      getNames,
      getRootName,
      isConceptLoaded,
      isDescendant,
      isRoot,
      loadConcept,
      loadConceptDescendants,
      removeConcept,
      taxonomy,
      updateTaxonomy,
    }),
    [
      conceptEditsRefresh,
      closestConcept,
      filterRanks,
      getAncestorNames,
      getConcept,
      getConceptFromTaxonomy,
      getConceptPrimaryName,
      getNames,
      getRootName,
      isConceptLoaded,
      isDescendant,
      isRoot,
      loadConcept,
      loadConceptDescendants,
      removeConcept,
      taxonomy,
      updateTaxonomy,
    ]
  )

  // Don't render children until taxonomy is loaded
  if (!taxonomy) {
    return <TaxonomyContext value={value}>{null}</TaxonomyContext>
  }

  return <TaxonomyContext value={value}>{children}</TaxonomyContext>
}

export default TaxonomyProvider
