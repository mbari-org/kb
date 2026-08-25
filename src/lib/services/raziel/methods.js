import request from '@/lib/services/request'

const raziel = method => request('raziel', method)

const razielDelete = raziel('DELETE')
const razielGet = raziel('GET')
const razielPost = raziel('POST')
const razielPut = raziel('PUT')

export { razielDelete, razielGet, razielPost, razielPut }
