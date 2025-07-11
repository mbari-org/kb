import authStore from '@/lib/store/authStore'
import { getConceptStore } from '@/lib/store/conceptStore'
import { getPanelStore } from '@/lib/store/panelStore'
import selectedStore from '@/lib/store/settingsStore'

/**
 * Clears all application stores during logout
 * This is shared between normal logout and forced logout scenarios
 */
export const clearStores = () => {
  authStore.remove()
  getConceptStore().remove()
  getPanelStore().remove()
  selectedStore.remove()
}
