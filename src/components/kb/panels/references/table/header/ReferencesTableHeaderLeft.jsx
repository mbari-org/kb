import { use } from 'react'

import PanelDataExport from '@/components/common/panel/PanelDataExport'

import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import useReferencesExport from '@/components/kb/panels/references/table/header/useReferencesExport'

import { CONCEPT_SELECT, SELECTED } from '@/lib/constants'

import { REFERENCES as REFERENCES_TOOLTIPS } from '@/lib/constants'

const { EXPORT, SWITCH } = REFERENCES_TOOLTIPS

const { CONCEPT } = SELECTED
const { REFERENCES } = SELECTED.SETTINGS

const ReferencesTableHeaderLeft = () => {
  const { references } = use(ReferencesContext)
  const { getSelected, getSettings, updateSettings } = use(SelectedContext)

  const selectedConcept = getSelected(CONCEPT)
  const byConcept = getSettings(REFERENCES.KEY, REFERENCES.BY_CONCEPT)

  const referencesExport = useReferencesExport()

  const total = byConcept
    ? references.filter(reference => reference.concepts.includes(selectedConcept)).length
    : references.length

  const exportToolTip = byConcept ? EXPORT.BY_CONCEPT : EXPORT.ALL
  const switchToolTip = byConcept ? SWITCH.BY_CONCEPT : SWITCH.ALL

  const switchFn = event => {
    const newValue = event.target.checked
    updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: newValue } })
  }

  return (
    <PanelDataExport
      checked={byConcept}
      count={total}
      exportFn={referencesExport}
      exportToolTip={exportToolTip}
      switchFn={switchFn}
      switchLabel='By Concept'
      switchToolTip={switchToolTip}
      width={CONCEPT_SELECT.WIDTH}
    />
  )
}

export default ReferencesTableHeaderLeft
