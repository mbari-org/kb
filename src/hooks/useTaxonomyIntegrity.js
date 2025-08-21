import { useCallback } from 'react'

const useTaxonomyIntegrity = () => {
  const checkIntegrity = useCallback(taxonomy => {
    if (!taxonomy) return

    const errors = []
    const addError = msg => errors.push(msg)

    const { conceptMap, aliasMap, rootName } = taxonomy

    if (!conceptMap || typeof conceptMap !== 'object') {
      throw new Error('taxonomy.conceptMap is missing or invalid')
    }
    if (!aliasMap || typeof aliasMap !== 'object') {
      throw new Error('taxonomy.aliasMap is missing or invalid')
    }
    if (!rootName || !conceptMap[rootName]) {
      addError(`Root concept "${rootName}" is missing from conceptMap`)
    }

    const conceptNames = Object.keys(conceptMap)

    // CxNote due to the caching on ONI we cannot depend on this validation
    // if (!Array.isArray(taxonomy.names)) {
    //   addError('taxonomy.names is missing or not an array')
    // } else {
    //   const expected = new Set([...Object.keys(conceptMap), ...Object.keys(aliasMap)])
    //   const actual = new Set(taxonomy.names)

    //   const missingInNames = [...expected].filter(n => !actual.has(n))
    //   if (missingInNames.length > 0) {
    //     addError(`taxonomy.names is missing entries: ${missingInNames.join(', ')}`)
    //   }
    //   // Extra entries in taxonomy.names are allowed.
    // }

    // Per-concept validation
    conceptNames.forEach(name => {
      const concept = conceptMap[name]
      if (!concept) {
        addError(`Concept map entry for key "${name}" is falsy`)
        return
      }

      if (concept.name !== name) {
        addError(`Concept map key "${name}" does not match concept.name "${concept.name}"`)
      }

      // Invariants: children may be undefined (lazy load); if defined, must be an array
      if (concept.children !== undefined && !Array.isArray(concept.children)) {
        addError(`Concept "${name}" has invalid children; expected an array or undefined`)
      }
      // alternateNames must always be an array
      if (!Array.isArray(concept.alternateNames)) {
        addError(`Concept "${name}" has invalid alternateNames; expected an array`)
      }

      // Parent invariants
      if (name === rootName) {
        if (concept.parent !== undefined) {
          addError(
            `Root concept "${name}" must have parent === undefined, found ${JSON.stringify(
              concept.parent
            )}`
          )
        }
      } else {
        if (typeof concept.parent !== 'string' || concept.parent.length === 0) {
          addError(
            `Concept "${name}" must have a parent string; found ${JSON.stringify(concept.parent)}`
          )
        } else if (!conceptMap[concept.parent]) {
          addError(`Concept "${name}" references missing parent "${concept.parent}"`)
        } else {
          const parent = conceptMap[concept.parent]
          if (parent.children !== undefined && !Array.isArray(parent.children)) {
            addError(`Parent "${parent.name}" has invalid children; expected an array or undefined`)
          } else if (Array.isArray(parent.children) && !parent.children.includes(name)) {
            addError(`Parent "${parent.name}" children does not include child "${name}"`)
          }
        }
      }

      // Children integrity
      if (Array.isArray(concept.children)) {
        const seen = new Set()
        concept.children.forEach(childName => {
          if (childName === name) {
            addError(`Concept "${name}" lists itself as a child`)
            return
          }
          if (seen.has(childName)) {
            addError(`Concept "${name}" has duplicate child reference "${childName}"`)
            return
          }
          seen.add(childName)

          const child = conceptMap[childName]
          if (!child) {
            addError(`Concept "${name}" has child "${childName}" not present in conceptMap`)
            return
          }
          if (child.parent !== name) {
            addError(`Child "${childName}" has parent "${child.parent}" but expected "${name}"`)
          }
        })
      }
      // Prevent self-aliasing
      if (concept.alternateNames.includes(name)) {
        addError(`Concept "${name}" lists its own primary name in alternateNames`)
      }

      // Alias forward mapping
      concept.alternateNames.forEach(alternateName => {
        const owner = aliasMap[alternateName]
        if (!owner) {
          addError(`Concept "${name}" has alias "${alternateName}" missing from aliasMap`)
          return
        }
        if (owner !== concept) {
          addError(
            `Alias "${alternateName}" in aliasMap points to a different concept than conceptMap["${name}"]`
          )
        }
      })
    })

    // Alias inverse mapping
    Object.keys(aliasMap).forEach(alias => {
      const owner = aliasMap[alias]
      if (!owner) {
        addError(`aliasMap entry for alias "${alias}" is falsy`)
        return
      }
      const ownerByName = conceptMap[owner.name]
      if (!ownerByName) {
        addError(
          `aliasMap alias "${alias}" points to concept "${owner?.name}" not found in conceptMap`
        )
        return
      }
      if (ownerByName !== owner) {
        addError(
          `aliasMap alias "${alias}" points to a concept object that differs from conceptMap["${owner.name}"]`
        )
      }
      const hasAlias = Array.isArray(owner.alternateNames)
        ? owner.alternateNames.includes(alias)
        : false
      if (!hasAlias) {
        addError(
          `aliasMap contains alias "${alias}" for concept "${owner.name}" not present in that concept's alternateNames`
        )
      }

      const nameConflict = conceptMap[alias]
      if (nameConflict) {
        addError(`alias "${alias}" duplicates a concept primary name "${nameConflict.name}"`)
      }
    })

    // Reachability and cycle detection
    if (rootName && conceptMap[rootName]) {
      const visited = new Set()
      const visiting = new Set()

      const dfs = name => {
        if (visiting.has(name)) {
          addError(`Cycle detected involving concept "${name}"`)
          return
        }
        if (visited.has(name)) return

        visiting.add(name)
        visited.add(name)

        const concept = conceptMap[name]
        const children = concept?.children
        if (children === undefined) {
          // no children loaded, treat as empty but do not mutate or coerce
          visiting.delete(name)
          return
        }
        if (!Array.isArray(children)) {
          addError(`Concept "${name}" has invalid children; expected an array or undefined`)
          visiting.delete(name)
          return
        }
        children.forEach(childName => {
          if (!conceptMap[childName]) {
            addError(`Concept "${name}" has child "${childName}" not present in conceptMap`)
            return
          }
          dfs(childName)
        })

        visiting.delete(name)
      }

      dfs(rootName)

      conceptNames.forEach(name => {
        if (!visited.has(name)) {
          addError(`Concept "${name}" is unreachable from root "${rootName}"`)
        }
      })
    }

    if (errors.length > 0) {
      const message = `Taxonomy integrity check failed (found ${errors.length} issue${
        errors.length === 1 ? '' : 's'
      }):\n- ${errors.join('\n- ')}`
      throw new Error(message)
    }
  }, [])

  return checkIntegrity
}

export default useTaxonomyIntegrity
