import { LOCAL_STORE } from '@/lib/constants'
import localStore from '@/lib/store/localStore'

export default localStore(LOCAL_STORE.AUTH.KEY)
