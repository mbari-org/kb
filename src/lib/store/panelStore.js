import { createHistoryStore, getHistoryStore } from '@/lib/store/historyStore'

import { STORE } from '@/lib/constants'

const createPanelStore = defaultPanel =>
  createHistoryStore(STORE.PANEL.KEY, STORE.PANEL.MAX_SIZE, defaultPanel)

const getPanelStore = () => getHistoryStore(STORE.PANEL.KEY)

export { createPanelStore, getPanelStore }
