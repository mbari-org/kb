import ConceptSelectAuxiliary from '@/components/common/concept/ConceptSelectAuxiliary'
import KBInfoIcon from '@/components/icon/KBInfoIcon'
import TemplatesConceptAvailableTooltip from '@/components/kb/panels/templates/TemplatesConceptAvailableTooltip'

import CONFIG from '@/text'

const TemplatesConceptSelectAuxiliary = () => {
  const infoIcon = (
    <KBInfoIcon
      tooltip={<TemplatesConceptAvailableTooltip />}
      placement='top'
      size={16}
      sx={{ mb: 1 }}
    />
  )

  return (
    <ConceptSelectAuxiliary
      label={CONFIG.CONCEPT.SELECT.CONCEPT}
      left={infoIcon}
    />
  )
}

export default TemplatesConceptSelectAuxiliary