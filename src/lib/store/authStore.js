import { PREFS } from '@/lib/kb/constants/prefs.js'
import localStore from '@/lib/store/localStore'

export default localStore(PREFS.AUTH.LOCAL_STORE)
