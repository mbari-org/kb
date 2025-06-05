import panels from '@/components/kb/panels/panels'
import historyStore from '@/lib/store/historyStore'

import { STORE } from '@/lib/constants'

const defaultPanel = panels[0].name

export default historyStore(STORE.PANEL.KEY, STORE.PANEL.MAX_SIZE, defaultPanel)
