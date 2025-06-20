import { use } from 'react'

import PanelTotalExportSwitch from '@/components/common/panel/PanelTotalExportSwitch'

import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import useReferencesExport from '@/components/kb/panels/references/table/header/useReferencesExport'

import { CONCEPT_SELECT } from '@/lib/constants'

import { REFERENCES } from '@/lib/tooltips'

const { EXPORT, SWITCH } = REFERENCES

const ReferencesTableHeaderLeft = () => {
  const { references } = use(ReferencesContext)
  const { getSelected, select } = use(SelectedContext)

  const selectedConcept = getSelected('concept')
  const byConcept = getSelected('byConcept')
  const byConceptName = byConcept ? selectedConcept : null

  const referencesExport = useReferencesExport()

  const filteredReferences = byConcept
    ? references.filter(reference => reference.concepts.includes(selectedConcept))
    : references

  const total = filteredReferences.length

  const exportToolTip = byConcept ? EXPORT.BY_CONCEPT : EXPORT.ALL
  const switchToolTip = byConcept ? SWITCH.BY_CONCEPT : SWITCH.ALL

  const handleToggleChange = event => {
    const newValue = event.target.checked
    select({ byConcept: newValue })
  }

  return (
    <PanelTotalExportSwitch
      checked={byConcept}
      count={total}
      exportFn={() => referencesExport(filteredReferences, byConceptName)}
      exportToolTip={exportToolTip}
      handleToggleChange={handleToggleChange}
      switchLabel='By Concept'
      switchToolTip={switchToolTip}
      width={CONCEPT_SELECT.WIDTH}
    />
  )
}

export default ReferencesTableHeaderLeft
