import Text from '@/components/common/factory/Text'
import { CONFIG } from '@/config/js'

const { CONCEPT } = CONFIG

const ConceptPropertiesEmpty = () => {
  return (
    <Text
      text={CONCEPT.NO_ITEMS}
      sx={{
        color: 'text.secondary',
        fontSize: '1rem',
        fontStyle: 'italic',
        py: 2,
        textAlign: 'center',
      }}
    />
  )
}

export default ConceptPropertiesEmpty
