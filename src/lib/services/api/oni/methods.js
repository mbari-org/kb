import request from '@/lib/services/api/request'

const oni = method => request('oni', method)

const oniDelete = oni('DELETE')
const oniGet = oni('GET')
const oniPost = oni('POST')
const oniPut = oni('PUT')

export { oniDelete, oniGet, oniPost, oniPut }
