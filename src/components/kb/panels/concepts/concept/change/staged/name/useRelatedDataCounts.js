import { use, useEffect, useMemo, useState } from 'react'

import { getConceptAnnotationsCount } from '@/lib/kb/api/annotations'
import { getToConceptAssociationsCount } from '@/lib/kb/api/associations'
import {
  getConceptTemplateCount,
  getToConceptTemplateCount,
} from '@/lib/kb/api/templates'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

export const RELATED_DATA_COUNTS = {
  ANNOTATIONS: 'Concept Annotations / Observations',
  ASSOCIATIONS: 'Associations To Concept',
  REALIZATIONS: 'Concept Link Realizations',
  TEMPLATES_DEFINED: 'Templates defined for Concept',
  TEMPLATES_TO: 'Templates To Concept',
  REFERENCES: 'References To Concept',
}

const useRelatedDataCounts = () => {
  const { concept } = use(ConceptContext)
  const { apiFns } = use(ConfigContext)
  const { getReferences } = use(PanelDataContext)

  const [dataCounts, setDataCounts] = useState(null)

  const relatedCounts = useMemo(
    () => {
      const config = [
        {
          title: RELATED_DATA_COUNTS.ASSOCIATIONS,
          apiCountFn: getToConceptAssociationsCount,
        },
        {
          title: RELATED_DATA_COUNTS.ANNOTATIONS,
          apiCountFn: getConceptAnnotationsCount,
        },
        {
          title: RELATED_DATA_COUNTS.REALIZATIONS,
          localCountFn: () => concept.realizations.length,
        },
        {
          title: RELATED_DATA_COUNTS.TEMPLATES_DEFINED,
          apiCountFn: getConceptTemplateCount,
        },
        {
          title: RELATED_DATA_COUNTS.TEMPLATES_TO,
          apiCountFn: getToConceptTemplateCount,
        },
        {
          title: RELATED_DATA_COUNTS.REFERENCES,
          localCountFn: conceptName => getReferences(conceptName).length,
        },
      ]

      return config.map(({ title, apiCountFn, localCountFn }) => {
        const countFn = apiCountFn
          ? () => apiFns?.apiResult(apiCountFn, concept.name)
          : () => localCountFn(concept.name)

        return { countFn, title }
      })
    },
    [apiFns, concept.name, concept.realizations, getReferences]
  )

  useEffect(() => {
    if (!relatedCounts) return

    // isMounted prevents React state updates if this component unmounts during an async count call
    let isMounted = true

    const determineCounts = async () => {
      try {
        const counts = []
        for (const { title, countFn, reassignFn } of relatedCounts) {
          const value = await countFn()
          counts.push({
            title,
            value,
            reassignFn,
          })
        }

        if (isMounted) {
          setDataCounts(counts)
        }
      } catch (error) {
        if (isMounted) {
          throw error
        }
      }
    }
    determineCounts()

    return () => {
      isMounted = false
    }
  }, [relatedCounts])

  return dataCounts
}

export default useRelatedDataCounts
