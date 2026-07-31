import ConceptSelectAuxiliary from '@/components/common/concept/ConceptSelectAuxiliary'
import KBInfoIcon from '@/components/icon/KBInfoIcon'
import TemplatesConceptAvailableTooltip from '@/components/kb/panels/templates/TemplatesConceptAvailableTooltip'

import CONFIG from '@/lib/config'

const TemplatesConceptSelectAuxiliary = () => {
  const infoIcon = <KBInfoIcon tooltip={<TemplatesConceptAvailableTooltip />} sx={{ mb: 1, ml: -7 }} />

  return <ConceptSelectAuxiliary components={[infoIcon, null]} label={CONFIG.CONCEPT.SELECT.CONCEPT} />
}

export default TemplatesConceptSelectAuxiliary
