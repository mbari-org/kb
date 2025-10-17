import { use, useCallback, useMemo } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

const useAvailableLinkTemplates = () => {
  const { concept } = use(ConceptContext)
  const { templates } = use(PanelDataContext)
  const { getAncestorNames } = use(TaxonomyContext)

  const conceptNames = useMemo(() => {
    return concept ? [concept.name, ...getAncestorNames(concept.name)] : []
  }, [concept, getAncestorNames])

  const getAvailableLinkTemplates = useCallback(
    linkName => {
      if (!templates || !conceptNames.length) return []

      if (!linkName) {
        return filterTemplates(templates, {
          concepts: conceptNames,
        })
      }

      return filterTemplates(templates, {
        concepts: conceptNames,
        linkName: linkName,
      })
    },
    [templates, conceptNames]
  )

  return getAvailableLinkTemplates
}

export default useAvailableLinkTemplates
