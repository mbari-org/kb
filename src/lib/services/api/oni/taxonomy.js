import { oniGet } from './methods'

const fetchNames = async config => {
  const { error, payload } = await oniGet(config, ['names'])
  return { error, payload: payload?.content }
}

const fetchRanks = async config => {
  const { error, payload: ranks } = await oniGet(config, ['concept', 'ranks'])
  return {
    error,
    payload: ranks?.map(({ rankName, rankLevel }) => ({
      rankName: rankName || '',
      rankLevel: rankLevel || '',
    })),
  }
}

const fetchRoot = async config => oniGet(config, ['concept', 'query', 'root'])

export { fetchNames, fetchRanks, fetchRoot }
