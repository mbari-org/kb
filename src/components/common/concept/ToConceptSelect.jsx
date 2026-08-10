import ConceptSelect from '@/components/common/concept/ConceptSelect'
import ToConceptSelectAuxiliary from '@/components/common/concept/ToConceptSelectAuxiliary'

const ToConceptSelect = ({
  conceptName,
  disabled,
  doConceptSelected,
  onSpecialChange,
  required = true,
  selectables,
  width,
}) => {
  return (
    <ConceptSelect
      conceptName={conceptName}
      disabled={disabled}
      doConceptSelected={doConceptSelected}
      auxiliaryComponent={
        <ToConceptSelectAuxiliary
          disabled={disabled}
          onChange={onSpecialChange || doConceptSelected}
          conceptName={conceptName}
        />
      }
      includeSpecialOptions={true}
      required={required}
      selectables={selectables}
      updateConceptSelected={false}
      width={width}
    />
  )
}

export default ToConceptSelect
