import StagedItem from '@/components/kb/panels/concepts/concept/change/staged/StagedItem'
import StagedItemReset from '@/components/kb/panels/concepts/concept/change/staged/reset/StagedItemReset'

import StagedTemplateDetail from '@/components/kb/panels/concepts/concept/change/staged/templates/StagedTemplateDetail'
import StagedTemplateHeader from '@/components/kb/panels/concepts/concept/change/staged/templates/StagedTemplateHeader'

import { CONCEPT } from '@/lib/constants'

const StagedTemplate = ({ initialItem, resetting, stagedItem }) => {
  const group = CONCEPT.FIELD.TEMPLATES

  const itemDetail = () => <StagedTemplateDetail initialTemplate={initialItem} stagedTemplate={stagedItem} />

  const itemHeader = () => <StagedTemplateHeader initialTemplate={initialItem} stagedTemplate={stagedItem} />

  const itemReset = () => <StagedItemReset group={group} resetting={resetting} stagedItem={stagedItem} />

  return <StagedItem ItemDetail={itemDetail} ItemHeader={itemHeader} ItemReset={itemReset} resetting={resetting} />
}

export default StagedTemplate
