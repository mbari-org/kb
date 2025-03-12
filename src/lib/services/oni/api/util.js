import oniMethod from './util/method'
import oniParams from './util/params'
import oniSend from './util/send'
import oniUrl from './util/url'

const oniDelete = oniMethod('DELETE')
const oniGet = oniMethod('GET')
const oniPost = oniMethod('POST')
const oniPut = oniMethod('PUT')

export { oniDelete, oniGet, oniParams, oniPost, oniPut, oniSend, oniUrl }
