import { oniGet } from '@/lib/services/oni/methods'

const getConceptPath = async (config, conceptName) =>
  oniGet(config, ['phylogeny', 'up', conceptName])

const getConceptTaxa = async (config, conceptName) =>
  oniGet(config, ['phylogeny', 'taxa', conceptName])

const getNames = async config => {
  const { error, payload } = await oniGet(config, ['names'])
  return { error, payload: payload?.content }
}

const getRanks = async config => {
  const { error, payload: ranks } = await oniGet(config, ['concept', 'ranks'])
  return {
    error,
    payload: ranks?.map(({ rankName, rankLevel }) => ({
      rankName: rankName || '',
      rankLevel: rankLevel || '',
    })),
  }
}

const getRoot = async config => oniGet(config, ['concept', 'query', 'root'])

export { getConceptPath, getConceptTaxa, getNames, getRanks, getRoot }
