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
  const taxonomyRef = useRef(null)
  const taxonomyTransactionRef = useRef(Promise.resolve())

  const checkIntegrity = useTaxonomyIntegrity()

  const updateTaxonomy = useCallback(
    updatedTaxonomy => {

      if (updatedTaxonomy === undefined) {
        showBoundary(new Error('Taxonomy update failed: updated taxonomy is undefined'))
        return taxonomyRef.current
      }

      try {
        checkIntegrity(updatedTaxonomy)
      } catch (error) {
        showBoundary(error)
        return taxonomyRef.current
      }

      taxonomyRef.current = updatedTaxonomy
      setTaxonomy(updatedTaxonomy)
      return updatedTaxonomy
    },
    [checkIntegrity, showBoundary]
  )

  const runTaxonomyTransaction = useCallback(
    async transactionFn => {
      const run = async () => {
        const currentTaxonomy = taxonomyRef.current
        const updatedTaxonomy = await transactionFn(currentTaxonomy)
        if (updatedTaxonomy === undefined) {
          throw new Error('Taxonomy transaction failed: transaction returned undefined taxonomy')
        }
        return updateTaxonomy(updatedTaxonomy)
      }

      const pendingTransaction = taxonomyTransactionRef.current.then(run, run)
      taxonomyTransactionRef.current = pendingTransaction.then(() => null, () => null)
      return pendingTransaction
    },
    [updateTaxonomy]
  )

  const conceptEditsRefresh = useCallback(
    async (freshConcept, staleConcept) => {
      if (freshConcept === staleConcept) {
        return { concept: freshConcept, taxonomy: taxonomyRef.current }
      }

      const updatedTaxonomy = await runTaxonomyTransaction(async currentTaxonomy => {
        if (!currentTaxonomy) {
          throw new Error(
            `Cannot refresh taxonomy edits for concept "${freshConcept?.name || staleConcept?.name}": taxonomy is not loaded`
          )
        }

        const aliasMap = { ...currentTaxonomy.aliasMap }
        const conceptMap = { ...currentTaxonomy.conceptMap }
        let names = currentTaxonomy.names

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

        const hasRenamed = freshConcept.name !== staleConcept.name
        const hasReparented = freshConcept.parent !== staleConcept.parent

        if (hasRenamed) {
          names = names.filter(name => name !== staleConcept.name)
          names.push(freshConcept.name)
          names.sort()
        }

        if (hasRenamed || hasReparented) {
          const nextParentName = freshConcept.parent
          const priorParentName = staleConcept.parent
          const nextParent = conceptMap[nextParentName]
          const priorParent = conceptMap[priorParentName]

          if (!nextParent) {
            throw new Error(
              `Cannot refresh taxonomy edits for "${freshConcept.name}": new parent "${nextParentName}" is missing`
            )
          }
          if (!priorParent) {
            throw new Error(
              `Cannot refresh taxonomy edits for "${freshConcept.name}": prior parent "${priorParentName}" is missing`
            )
          }

          if (nextParentName === priorParentName) {
            const updatedParent = { ...nextParent }
            const replacedChildren = (updatedParent.children || []).map(child =>
              child === staleConcept.name ? freshConcept.name : child
            )
            updatedParent.children = Array.from(new Set(replacedChildren)).sort()
            insertConcept(updatedParent, conceptMap, aliasMap)
          } else {
            const updatedNextParent = { ...nextParent }
            const nextChildren = (updatedNextParent.children || []).filter(
              child => child !== staleConcept.name
            )
            nextChildren.push(freshConcept.name)
            updatedNextParent.children = Array.from(new Set(nextChildren)).sort()
            insertConcept(updatedNextParent, conceptMap, aliasMap)

            const updatedPriorParent = { ...priorParent }
            updatedPriorParent.children = (updatedPriorParent.children || []).filter(
              child => child !== staleConcept.name && child !== freshConcept.name
            )
            insertConcept(updatedPriorParent, conceptMap, aliasMap)
          }
        }

        return { ...currentTaxonomy, aliasMap, conceptMap, names }
      })

      return { concept: freshConcept, taxonomy: updatedTaxonomy }
    },
    [apiFns, runTaxonomyTransaction]
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
      if (!apiFns || !taxonomyRef.current) return null

      if (alreadyLoadingConcept.current) {
        return null
      }

      try {
        alreadyLoadingConcept.current = true

        const updatedTaxonomy = await runTaxonomyTransaction(async currentTaxonomy => {
          if (!currentTaxonomy) {
            throw new Error(`Cannot load concept "${conceptName}" because taxonomy is not loaded`)
          }
          if (!force && isTaxonomyConceptLoaded(currentTaxonomy, conceptName)) {
            return currentTaxonomy
          }

          const { taxonomy: loadedTaxonomy } = await loadTaxonomyConcept(
            currentTaxonomy,
            conceptName,
            apiFns
          )
          return loadedTaxonomy
        })

        return getTaxonomyConcept(updatedTaxonomy, conceptName)
      } catch (error) {
        showBoundary(error)
      } finally {
        alreadyLoadingConcept.current = false
      }
    },
    [apiFns, runTaxonomyTransaction, showBoundary]
  )

  const loadConceptDescendants = useCallback(
    async concept => {
      if (!apiFns || !taxonomyRef.current) return null
      try {
        const updatedTaxonomy = await runTaxonomyTransaction(async currentTaxonomy => {
          if (!currentTaxonomy) {
            throw new Error(
              `Cannot load concept descendants for "${concept?.name}": taxonomy is not loaded`
            )
          }
          const { taxonomy: loadedTaxonomy } = await loadTaxonomyConceptDescendants(
            currentTaxonomy,
            concept,
            apiFns
          )
          return loadedTaxonomy
        })

        return updatedTaxonomy
      } catch (error) {
        showBoundary(error)
      }
    },
    [apiFns, runTaxonomyTransaction, showBoundary]
  )

  const removeConcept = useCallback(
    async conceptName => {
      return runTaxonomyTransaction(async currentTaxonomy => {
        if (!currentTaxonomy) {
          throw new Error(`Cannot remove concept "${conceptName}" before taxonomy is loaded`)
        }

        const concept = getTaxonomyConcept(currentTaxonomy, conceptName)
        if (!concept) {
          throw new Error(`Cannot remove missing concept from taxonomy: ${conceptName}`)
        }

        const { taxonomy: updatedTaxonomy } = removeTaxonomyConcept(currentTaxonomy, concept)
        return updatedTaxonomy
      })
    },
    [runTaxonomyTransaction]
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
