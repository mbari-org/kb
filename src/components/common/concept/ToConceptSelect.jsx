import ConceptSelect from '@/components/common/concept/ConceptSelect'
import ToConceptSelectAuxiliary from '@/components/common/concept/ToConceptSelectAuxiliary'

const ToConceptSelect = ({ conceptName, doConceptSelected, onSpecialChange, required = true, selectables, selectorTooltip, width }) => {
  return (
    <ConceptSelect
      conceptName={conceptName}
      doConceptSelected={doConceptSelected}
      auxiliaryComponent={
        <ToConceptSelectAuxiliary onChange={onSpecialChange || doConceptSelected} conceptName={conceptName} />
      }
      includeSpecialOptions={true}
      required={required}
      selectables={selectables}
      selectorTooltip={selectorTooltip}
      updateConceptSelected={false}
      width={width}
    />
  )
}

export default ToConceptSelect
