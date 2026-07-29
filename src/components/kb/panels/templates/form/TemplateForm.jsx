import { use, useEffect, useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'

import ActionsAlert from '@/components/modal/actions/ActionsAlert'
import LinkNameInput from '@/components/kb/panels/templates/form/LinkNameInput'
import LinkValueInput from '@/components/kb/panels/templates/form/LinkValueInput'
import ModalActionText from '@/components/common/ModalActionText'
import ToConceptSelect from '@/components/common/concept/ToConceptSelect'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import useTemplateForm from '@/components/kb/panels/templates/form/useTemplateForm'
import useDebounce from '@/lib/hooks/useDebounce'

import { duplicateTemplateAlert, isDuplicateTemplate } from '@/components/kb/panels/templates/form/templateModalUtils'

import CONFIG from '@/lib/config'

const { ADD, EDIT } = CONFIG.PANELS.TEMPLATES.MODALS
const TO_NIL = 'nil'
const DUPLICATE_CHECK_DEBOUNCE_MS = 300

const TemplateForm = ({ alert = null, isEdit = false, onChange, onDuplicateChange, original, template }) => {
  const { handleChange, updateTemplate } = useTemplateForm({ onChange, template, original })
  const { templates: allTemplates } = use(PanelDataContext)

  const [debouncedFields, setDebouncedFields] = useState({
    linkName: template.linkName,
    toConcept: template.toConcept,
    linkValue: template.linkValue,
  })
  const setDebouncedTemplateFields = useDebounce(setDebouncedFields, DUPLICATE_CHECK_DEBOUNCE_MS)

  useEffect(() => {
    setDebouncedTemplateFields({
      linkName: template.linkName,
      toConcept: template.toConcept,
      linkValue: template.linkValue,
    })
  }, [template.linkName, template.toConcept, template.linkValue, setDebouncedTemplateFields])

  const { linkName: debouncedLinkName, toConcept: debouncedToConcept, linkValue: debouncedLinkValue } = debouncedFields
  const isToConceptValid = template.toConcept !== ''
  const isLinkValueDisabled = !isToConceptValid

  const isDuplicate = useMemo(() => {
    if (debouncedLinkName.trim() === '' || debouncedToConcept === '' || debouncedLinkValue.trim() === '') return false

    const candidate = {
      ...template,
      linkName: debouncedLinkName,
      toConcept: debouncedToConcept,
      linkValue: debouncedLinkValue,
    }

    return isDuplicateTemplate(allTemplates, candidate, isEdit ? original?.id : undefined)
  }, [allTemplates, debouncedLinkName, debouncedToConcept, debouncedLinkValue, isEdit, original?.id, template])
  useEffect(() => {
    onDuplicateChange(isDuplicate)
  }, [isDuplicate, onDuplicateChange])

  const effectiveAlert = isDuplicate ? duplicateTemplateAlert() : alert

  const handleToConceptChange = nextToConcept => {
    updateTemplate(currentTemplate => ({
      ...currentTemplate,
      toConcept: nextToConcept,
      linkValue: currentTemplate.linkValue !== TO_NIL ? '' : currentTemplate.linkValue,
    }))
  }

  const handleToConceptSelect = newValue => {
    handleToConceptChange(newValue)
  }

  const handleToConceptSpecial = value => {
    handleToConceptChange(value === null ? '' : value)
  }

  return (
    <Stack spacing={2}>
      <ModalActionText text={isEdit ? EDIT.CONTENT.HEADER : ADD.CONTENT.HEADER} />
      <LinkNameInput onChange={handleChange('linkName')} value={template.linkName} />
      <ToConceptSelect
        conceptName={template.toConcept}
        doConceptSelected={handleToConceptSelect}
        onSpecialChange={handleToConceptSpecial}
        width='100%'
      />
      <LinkValueInput disabled={isLinkValueDisabled} onChange={handleChange('linkValue')} value={template.linkValue} />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          height: 60,
          justifyContent: 'center',
          pt: effectiveAlert ? 0.5 : 0,
        }}
      >
        {effectiveAlert ? (
          <ActionsAlert lines={effectiveAlert.lines} severity={effectiveAlert.severity || 'info'} />
        ) : null}
      </Box>
    </Stack>
  )
}

export default TemplateForm
