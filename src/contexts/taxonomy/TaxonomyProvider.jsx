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
        return
      }
      setTaxonomy(updatedTaxonomy)
    },
    [checkIntegrity, showBoundary]
  )

  const conceptEditsRefresh = useCallback(
    async (freshConcept, staleConcept) => {
      if (freshConcept === staleConcept) {
        return { concept: freshConcept, taxonomy }
      }

      const aliasMap = { ...taxonomy.aliasMap }
      const conceptMap = { ...taxonomy.conceptMap }
      let names = taxonomy.names

      delete conceptMap[staleConcept.name]
      staleConcept.alternateNames.forEach(alternateName => {
        delete aliasMap[alternateName]
      })
      insertConcept(freshConcept, conceptMap, aliasMap)

      if (!isEqual(freshConcept.alternateNames, staleConcept.alternateNames)) {
        names = names.filter(name => !staleConcept.alternateNames.includes(name))
        names.push(...freshConcept.alternateNames)
        names.sort()
      }

      if (!isEqual(freshConcept.children, staleConcept.children)) {
        const addedChildren = freshConcept.children.filter(
          name => !staleConcept.children.includes(name)
        )
        const removedChildren = staleConcept.children.filter(
          name => !freshConcept.children.includes(name)
        )

        await Promise.all(
          addedChildren
            .filter(childName => childName !== staleConcept.name)
            .map(async childName => {
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

        if (addedChildren.length > 0 || removedChildren.length > 0) {
          names = names
            .filter(name => !removedChildren.includes(name))
            .concat(addedChildren)
            .sort()
        }
      }

      if (freshConcept.name !== staleConcept.name) {
        const freshParent = { ...conceptMap[freshConcept.parent] }
        freshParent.children = freshParent.children.filter(child => child !== staleConcept.name)
        freshParent.children.push(freshConcept.name)
        freshParent.children.sort()
        insertConcept(freshParent, conceptMap, aliasMap)

        names = names.filter(name => name !== staleConcept.name)
        names.push(freshConcept.name)
        names.sort()
      }

      if (freshConcept.parent !== staleConcept.parent) {
        const freshParent = { ...conceptMap[freshConcept.parent] }
        freshParent.children.push(freshConcept.name)
        freshParent.children.sort()
        insertConcept(freshParent, conceptMap, aliasMap)

        const staleParent = { ...conceptMap[staleConcept.parent] }
        staleParent.children = staleParent.children.filter(child => child !== staleConcept.name)
        insertConcept(staleParent, conceptMap, aliasMap)
      }

      const updatedTaxonomy = { ...taxonomy, aliasMap, conceptMap, names }

      updateTaxonomy(updatedTaxonomy)

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
        return getConcept(conceptName)
      }

      if (alreadyLoadingConcept.current) {
        return null
      }

      try {
        alreadyLoadingConcept.current = true

        const { taxonomy: updatedTaxonomy } = await loadTaxonomyConcept(
          taxonomy,
          conceptName,
          apiFns
        )

        updateTaxonomy(updatedTaxonomy)

        return getTaxonomyConcept(updatedTaxonomy, conceptName)
      } catch (error) {
        showBoundary(error)
      } finally {
        alreadyLoadingConcept.current = false
      }
    },
    [apiFns, getConcept, isConceptLoaded, showBoundary, taxonomy, updateTaxonomy]
  )

  const loadConceptDescendants = useCallback(
    async concept => {
      if (!apiFns || !taxonomy) return null
      try {
        const { taxonomy: updatedTaxonomy } = await loadTaxonomyConceptDescendants(
          taxonomy,
          concept,
          apiFns
        )
        updateTaxonomy(updatedTaxonomy)

        return updatedTaxonomy
      } catch (error) {
        showBoundary(error)
      }
    },
    [apiFns, showBoundary, taxonomy, updateTaxonomy]
  )

  const removeConcept = useCallback(
    conceptName => {
      const concept = getConcept(conceptName)
      const { taxonomy: updatedTaxonomy } = removeTaxonomyConcept(taxonomy, concept)
      updateTaxonomy(updatedTaxonomy)
      return updatedTaxonomy
    },
    [getConcept, taxonomy, updateTaxonomy]
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
