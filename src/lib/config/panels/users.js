import exportData from '@/config/panels/users/export.json'
import panel from '@/config/panels/users/panel.json'
import tooltip from '@/config/panels/users/tooltip.json'
import { BUTTON } from '../button.js'
import { MODALS } from './users/modals.js'

export const USERS = {
  BUTTON: {
    ADD: BUTTON.ADD,
  },
  EXPORT: exportData,
  MODALS,
  PANEL: panel,
  TOOLTIP: tooltip,
}
