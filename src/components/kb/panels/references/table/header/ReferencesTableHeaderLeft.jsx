import { use } from 'react'

import PanelDataExport from '@/components/common/panel/PanelDataExport'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import useReferencesExport from '@/components/kb/panels/references/table/header/useReferencesExport'

import { CONCEPT_SELECT, SELECTED, TOOLTIPS } from '@/lib/constants/constants'

const { REFERENCES } = SELECTED.SETTINGS
const { EXPORT } = TOOLTIPS.REFERENCES

const ReferencesTableHeaderLeft = () => {
  const { getReferences } = use(PanelDataContext)
  const { getSelected, getSettings } = use(SelectedContext)

  const referencesExport = useReferencesExport()

  const byConcept = getSettings(REFERENCES.KEY, REFERENCES.BY_CONCEPT)
  const selectedConcept = byConcept ? getSelected(SELECTED.CONCEPT) : null
  const references = getReferences(selectedConcept)

  const exportTooltip = byConcept ? EXPORT.BY_CONCEPT : EXPORT.ALL

  return (
    <PanelDataExport
      count={references.length}
      exportFn={referencesExport}
      exportTooltip={exportTooltip}
      width={CONCEPT_SELECT.WIDTH}
    />
  )
}

export default ReferencesTableHeaderLeft
