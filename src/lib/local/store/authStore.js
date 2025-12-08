import { PREFS } from '@/lib/constants/prefs.js'
import localStore from '@/lib/local/store/localStore'

export default localStore(PREFS.AUTH.LOCAL_STORE)
