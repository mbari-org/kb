import oniMethod from './util/method'
import oniParams from './util/params'
import oniSend from './util/send'
import oniUrl from './util/url'

const oniGet = oniMethod('GET')
const oniPut = oniMethod('PUT')

export { oniGet, oniParams, oniPut, oniSend, oniUrl }
