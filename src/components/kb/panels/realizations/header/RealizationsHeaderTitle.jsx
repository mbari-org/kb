import { use } from 'react'
import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'

import CONFIG from '@/lib/config'
import { SELECTED } from '@/lib/constants/selected.js'
import useFilterTooltip from '@/lib/hooks/useFilterTooltip'

const PANEL = CONFIG.PANELS.REALIZATIONS.PANEL

const RealizationsHeaderTitle = () => {
  const { filterString, filters } = use(RealizationsContext)
  const { REALIZATIONS } = SELECTED.SETTINGS

  const title = PANEL.NAME

  const filterRealization = {
    concept: filters[REALIZATIONS.FILTERS.CONCEPT],
    linkName: filters[REALIZATIONS.FILTERS.LINK_NAME],
    toConcept: filters[REALIZATIONS.FILTERS.TO_CONCEPT],
    linkValue: filters[REALIZATIONS.FILTERS.LINK_VALUE],
  }

  const subtitle = filterString(filterRealization)
  const subtitleTooltip = useFilterTooltip(filterRealization)

  return <PanelHeaderTitle subtitle={subtitle} subtitleTooltip={subtitleTooltip} title={title} />
}

export default RealizationsHeaderTitle
