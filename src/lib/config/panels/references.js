import columns from '@/config/panels/references/columns.json'
import exportConfig from '@/config/panels/references/export.json'
import form from '@/config/panels/references/form.json'
import panel from '@/config/panels/references/panel.json'
import { BUTTON } from '../button.js'
import { MODALS } from './references/modals.js'

export const REFERENCES = {
  BUTTON: {
    ADD: BUTTON.ADD,
  },
  COLUMNS: columns,
  EXPORT: exportConfig,
  FORM: form,
  MODALS,
  PANEL: panel,
}
