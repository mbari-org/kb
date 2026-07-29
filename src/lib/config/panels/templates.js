import exportData from '@/config/panels/templates/export.json'
import panel from '@/config/panels/templates/panel.json'
import tooltip from '@/config/panels/templates/tooltip.json'
import { BUTTON } from '../button.js'

import { MODALS } from './templates/modals.js'

export const TEMPLATES = {
  BUTTON: {
    ADD: BUTTON.ADD,
    CLEAR_FILTERS: BUTTON.CLEAR_FILTERS,
  },
  EXPORT: exportData,
  MODALS,
  PANEL: panel,
  TOOLTIP: tooltip,
}
