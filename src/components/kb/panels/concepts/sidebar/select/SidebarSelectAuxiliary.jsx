import { use, useMemo } from 'react'

import ConceptSelectAuxiliary from '@/components/common/concept/ConceptSelectAuxiliary'
import NavHistoryLinks from '@/components/common/NavHistoryLinks'
import ConceptExport from '@/components/kb/panels/concepts/sidebar/select/ConceptExport'
import ConceptScroll from '@/components/kb/panels/concepts/sidebar/select/ConceptScroll'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import CONFIG from '@/lib/config'

const SidebarSelectAuxiliary = ({ concepts, onScrollToConcept }) => {
  const { prepareConceptSwitch } = use(ConceptContext)

  const history = useMemo(() => {
    // Paint the loading overlay first, then navigate on the next frames.
    // After expand-all the tree re-render is heavy; without yielding, the browser
    // never paints the overlay until that work finishes (looks like a multi-second hang).
    const go = fn => (...args) => {
      prepareConceptSwitch()
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fn(...args)
        })
      })
    }

    return {
      ...concepts,
      back: go(concepts.back),
      forward: go(concepts.forward),
      goBack: go(concepts.goBack),
      goForward: go(concepts.goForward),
    }
  }, [concepts, prepareConceptSwitch])

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
