import { STORE } from '@/lib/constants'
import localStore from '@/lib/store/localStore'

export default localStore(STORE.AUTH.KEY)
