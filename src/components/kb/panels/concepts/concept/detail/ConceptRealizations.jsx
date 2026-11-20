import { SELECTED } from '@/lib/constants/selected.js'
import { use } from 'react'

import ConceptRealization from '@/components/kb/panels/concepts/concept/detail/realizations/ConceptRealization'
import ConceptPropertyList from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertyList'
import RealizationActionIcon from '@/components/kb/panels/concepts/concept/change/staged/realizations/RealizationActionIcon'
import InspectIcon from '@/components/icon/InspectIcon'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import useGuardedAction from '@/contexts/user/useGuardedAction'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/lib/config'

const RealizationComponent = ({ item }) => <ConceptRealization realization={item} widths={[20, 30, 50]} />

const ConceptRealizations = () => {
  const { isEditing } = use(ConceptContext)
  const { stagedState } = use(ConceptStagedContext)
  const { updateSelected } = use(SelectedContext)
  const { guardPanelChange } = useGuardedAction()

  const realizations = stagedState?.realizations || []

  const linkToRealizations = () => {
    const panel = CONFIG.PANELS.REALIZATIONS.PANEL.NAME
    guardPanelChange({
      onSafe: () => {
        updateSelected({ [SELECTED.PANEL]: panel })
      },
      panel,
    })
  }

  const ActionComponent = () =>
    isEditing ? (
      <RealizationActionIcon action={CONCEPT_STATE.REALIZATION.ADD} />
    ) : (
      <InspectIcon
        asDiv={true}
        iconAction='PANEL_LINK'
        onClick={linkToRealizations}
        tooltip={CONFIG.PANELS.CONCEPTS.REALIZATIONS.VIEW.TOOLTIP}
      />
    )

  return (
    <ConceptPropertyList
      actionComponent={ActionComponent}
      renderComponent={RealizationComponent}
      items={realizations}
      title={CONFIG.PANELS.CONCEPTS.REALIZATIONS.LABEL}
    />
  )
}

export default ConceptRealizations
