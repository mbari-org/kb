import { use } from 'react'
import { Box, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import TemplateActionIcon from '@/components/kb/panels/concepts/concept/change/staged/templates/TemplateActionIcon'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { stagedBorder } from '@/lib/concept/state/staged'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { asText } from '@/lib/model/realization'

const { ADD, DELETE, EDIT } = CONCEPT_STATE.TEMPLATE

const ConceptTemplate = ({ template }) => {
  const theme = useTheme()
  const { concept, isEditing } = use(ConceptContext)

  if (!template) {
    return null
  }

  const border = stagedBorder({
    noActionBorderColor: 'none',
    stagedItem: template,
    theme,
    width: '2px',
  })

  const isEditable =
    isEditing && template.concept === concept.name && template.stateId !== undefined && !template.historyId
  const showEdit = isEditable && template.action !== DELETE
  const showDelete = isEditable && template.action !== ADD

  return (
    <Stack direction='row' spacing={1} sx={{ alignItems: 'center', border, pl: 1 }}>
      <Stack direction='column' spacing={-0.5}>
        {showEdit && <TemplateActionIcon action={EDIT} size={20} templateStateId={template.stateId} />}
        {showDelete && <TemplateActionIcon action={DELETE} size={20} templateStateId={template.stateId} />}
      </Stack>
      <Box sx={{ flex: 1, minWidth: 0 }}>{asText(template)}</Box>
    </Stack>
  )
}

export default ConceptTemplate
