import Text from '@/components/common/factory/Text'

const ConceptPropertiesEmpty = () => {
  return (
    <Text
      text='None'
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
