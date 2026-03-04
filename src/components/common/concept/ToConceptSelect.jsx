import ConceptSelect from '@/components/common/concept/ConceptSelect'
import ToConceptSelectAuxiliary from '@/components/common/concept/ToConceptSelectAuxiliary'

const ToConceptSelect = ({
  conceptName,
  disabled,
  doConceptSelected,
  onSpecialChange,
  required = true,
  width,
}) => {
  return (
    <ConceptSelect
      conceptName={conceptName}
      disabled={disabled}
      doConceptSelected={doConceptSelected}
      auxiliaryComponent={<ToConceptSelectAuxiliary disabled={disabled} onChange={onSpecialChange || doConceptSelected} />}
      includeSpecialOptions={true}
      required={required}
      updateConceptSelected={false}
      width={width}
    />
  )
}

export default ToConceptSelect
