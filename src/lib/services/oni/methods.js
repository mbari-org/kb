import request from '@/lib/services/request'

const oni = method => request('oni', method)

const oniDelete = oni('DELETE')
const oniGet = oni('GET')
const oniPost = oni('POST')
const oniPut = oni('PUT')
const oniUserDelete = request('oni', 'DELETE', 'user')
const oniUserPost = request('oni', 'POST', 'user')
const oniUserPut = request('oni', 'PUT', 'user')

export { oniDelete, oniGet, oniPost, oniPut, oniUserDelete, oniUserPost, oniUserPut }
