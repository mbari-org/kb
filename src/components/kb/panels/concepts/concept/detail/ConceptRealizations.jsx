import { SELECTED } from '@/lib/constants/selected.js'
import { use } from 'react'
import { Stack } from '@mui/material'

import ConceptRealization from '@/components/kb/panels/concepts/concept/detail/realizations/ConceptRealization'
import ConceptPropertyList from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertyList'
import RealizationActionIcon from '@/components/kb/panels/concepts/concept/change/staged/realizations/RealizationActionIcon'
import InspectIcon from '@/components/icon/InspectIcon'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import useGuardedAction from '@/contexts/user/useGuardedAction'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/text'

const ConceptRealizations = () => {
  const { isEditing, stagedState } = use(ConceptContext)
  const { updateSelected } = use(SelectedContext)
  const { guardPanelChange } = useGuardedAction()

  const realizations = stagedState?.realizations || []

  const IconComponent = () => (
    <RealizationActionIcon action={CONCEPT_STATE.REALIZATION.ADD} realizationIndex={realizations.length} />
  )
  const linkToRealizations = () => {
    const panel = CONFIG.PANELS.REALIZATIONS.PANEL.NAME
    guardPanelChange({
      onSafe: () => {
        updateSelected({ [SELECTED.PANEL]: panel })
      },
      panel,
    })
  }

  const ActionComponent = () => (
    <Stack direction='row' spacing={2}>
      <InspectIcon
        asDiv={true}
        onClick={linkToRealizations}
        tooltip={CONFIG.PANELS.CONCEPTS.REALIZATIONS.VIEW.TOOLTIP}
      />
      {isEditing ? <IconComponent /> : null}
    </Stack>
  )
  const RealizationComponent = ({ item }) => (
    <ConceptRealization realization={item} rowSx={{ ml: -1, mr: '30px' }} widths={[20, 30, 50]} />
  )

  return (
    <ConceptPropertyList
      actionComponent={ActionComponent}
      renderComponent={RealizationComponent}
      items={realizations}
      title='Realizations'
    />
  )
}

export default ConceptRealizations
