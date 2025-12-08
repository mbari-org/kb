import { use } from 'react'

import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'

import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/constants/selected.js'

const { REFERENCES } = SELECTED.SETTINGS

const ReferencesHeaderTitle = () => {
  const { getSettings } = use(SelectedContext)
  const byConcept = getSettings(REFERENCES.KEY, REFERENCES.BY_CONCEPT)

  const title = byConcept ? 'Concept References' : 'All References'

  return <PanelHeaderTitle title={title} />
}

export default ReferencesHeaderTitle