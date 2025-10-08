import { oniGet } from '@/lib/services/oni/methods'

const getNames = async config => {
  const { error, payload } = await oniGet({ config, path: ['names'] })
  return { error, payload: payload?.content }
}

const getRanks = async config => {
  const { error, payload: ranks } = await oniGet({ config, path: ['concept', 'ranks'] })
  return {
    error,
    payload: ranks?.map(({ rankName, rankLevel }) => ({
      rankName: rankName || '',
      rankLevel: rankLevel || '',
    })),
  }
}

const getRoot = async config => oniGet({ config, path: ['concept', 'query', 'root'] })

export { getNames, getRanks, getRoot }
