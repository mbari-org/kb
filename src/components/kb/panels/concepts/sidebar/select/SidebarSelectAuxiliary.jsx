import { use, useMemo } from 'react'

import ConceptSelectAuxiliary from '@/components/common/concept/ConceptSelectAuxiliary'
import NavHistoryLinks from '@/components/common/NavHistoryLinks'
import ConceptExport from '@/components/kb/panels/concepts/sidebar/select/ConceptExport'
import ConceptScroll from '@/components/kb/panels/concepts/sidebar/select/ConceptScroll'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import CONFIG from '@/lib/config'

const SidebarSelectAuxiliary = ({ concepts, onScrollToConcept }) => {
  const { concept, prepareConceptSwitch } = use(ConceptContext)

  const history = useMemo(() => {
    const go =
      (fn, items, index) =>
      (...args) => {
        if (items()[index(...args)] === concept.name) {
          fn(...args)
          return
        }

        prepareConceptSwitch()
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            fn(...args)
          })
        })
      }

    return {
      ...concepts,
      back: go(concepts.back, concepts.backItems, () => 0),
      forward: go(concepts.forward, concepts.forwardItems, () => 0),
      goBack: go(concepts.goBack, concepts.backItems, delta => delta - 1),
      goForward: go(concepts.goForward, concepts.forwardItems, delta => delta - 1),
    }
  }, [concept, concepts, prepareConceptSwitch])

  const conceptExport = <ConceptExport />
  const conceptScroll = <ConceptScroll onScrollToConcept={onScrollToConcept} />
  const conceptNav = <NavHistoryLinks history={history} />

  return (
    <ConceptSelectAuxiliary
      label={CONFIG.CONCEPT.SELECT.CONCEPT}
      components={[conceptExport, conceptScroll, conceptNav]}
    />
  )
}

export default SidebarSelectAuxiliary
