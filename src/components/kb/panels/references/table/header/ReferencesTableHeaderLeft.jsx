import { use } from 'react'

import PanelTotalExportSwitch from '@/components/common/panel/PanelTotalExportSwitch'

import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import useReferencesExport from '@/components/kb/panels/references/table/header/useReferencesExport'

import { CONCEPT_SELECT, SELECTED } from '@/lib/constants'

import { REFERENCES as REFERENCES_TOOLTIPS } from '@/lib/tooltips'

const { EXPORT, SWITCH } = REFERENCES_TOOLTIPS

const { CONCEPT } = SELECTED
const { REFERENCES } = SELECTED.SETTINGS

const ReferencesTableHeaderLeft = () => {
  const { references } = use(ReferencesContext)
  const { getSelected, select } = use(SelectedContext)

  const selectedConcept = getSelected(CONCEPT)
  const byConcept = getSelected(REFERENCES.BY_CONCEPT)
  const byConceptName = byConcept ? selectedConcept : null

  const referencesExport = useReferencesExport()

  const filteredReferences = byConcept
    ? references.filter(reference => reference.concepts.includes(selectedConcept))
    : references

  const total = filteredReferences.length

  const exportToolTip = byConcept ? EXPORT.BY_CONCEPT : EXPORT.ALL
  const switchToolTip = byConcept ? SWITCH.BY_CONCEPT : SWITCH.ALL

  const switchFn = event => {
    const newValue = event.target.checked
    select({ references: { [REFERENCES.BY_CONCEPT]: newValue } })
  }

  const exportFn = () => {
    referencesExport(filteredReferences, byConceptName)
  }

  return (
    <PanelTotalExportSwitch
      checked={byConcept}
      count={total}
      exportFn={exportFn}
      exportToolTip={exportToolTip}
      switchFn={switchFn}
      switchLabel='By Concept'
      switchToolTip={switchToolTip}
      width={CONCEPT_SELECT.WIDTH}
    />
  )
}

export default ReferencesTableHeaderLeft
