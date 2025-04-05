import request from '@/lib/services/request'

const annosaurus = method => request('annosaurus', method)

const annosaurusDelete = annosaurus('DELETE')
const annosaurusGet = annosaurus('GET')
const annosaurusPost = annosaurus('POST')
const annosaurusPut = annosaurus('PUT')

export { annosaurusDelete, annosaurusGet, annosaurusPost, annosaurusPut }
