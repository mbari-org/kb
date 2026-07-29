import exportData from '@/config/panels/references/export.json'
import panel from '@/config/panels/references/panel.json'
import tooltip from '@/config/panels/references/tooltip.json'
import { BUTTON } from '../button.js'
import { MODALS } from './references/modals.js'

export const REFERENCES = {
  BUTTON: {
    ADD: BUTTON.ADD,
  },
  EXPORT: exportData,
  MODALS,
  PANEL: panel,
  TOOLTIP: tooltip,
}
