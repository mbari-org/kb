import { primaryName } from '@/lib/model/aliases'

const applyAuthorResults = ({ concept, result }) => {
  concept.author = primaryName(result.response).author
}

export default applyAuthorResults
