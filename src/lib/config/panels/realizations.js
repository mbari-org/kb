import exportData from '@/config/panels/realizations/export.json'
import panel from '@/config/panels/realizations/panel.json'
import tooltip from '@/config/panels/realizations/tooltip.json'
import { BUTTON } from '../button.js'

export const REALIZATIONS = {
  BUTTON: {
    CLEAR_FILTERS: BUTTON.CLEAR_FILTERS,
  },
  EXPORT: exportData,
  PANEL: panel,
  TOOLTIP: tooltip,
}
