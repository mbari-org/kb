import ConceptSelectAuxiliary from '@/components/common/concept/ConceptSelectAuxiliary'
import NavHistoryLinks from '@/components/common/NavHistoryLinks'
import ConceptExport from '@/components/kb/panels/concepts/sidebar/select/ConceptExport'
import ConceptScroll from '@/components/kb/panels/concepts/sidebar/select/ConceptScroll'

import CONFIG from '@/text'

const SidebarSelectAuxiliary = ({ concepts, onScrollToConcept }) => {
  const conceptExport = <ConceptExport />
  const conceptScroll = <ConceptScroll onScrollToConcept={onScrollToConcept} />
  const conceptNav = <NavHistoryLinks history={concepts} />

  return (
    <ConceptSelectAuxiliary
      label={CONFIG.CONCEPT.SELECT.CONCEPT}
      components={[conceptExport, conceptScroll, conceptNav]}
    />
  )
}

export default SidebarSelectAuxiliary