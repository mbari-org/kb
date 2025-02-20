import { getPrimary } from '@/lib/kb/concept/media'

import { CONCEPT } from '@/contexts/concept/lib/conceptStateReducer'

const namesState = names => {
  if (!names) {
    return []
  }
  return names.map(alias => ({
    ...alias,
    action: CONCEPT.NONE,
  }))
}

const mediaState = media => {
  const primaryMedia = getPrimary(media)
  const otherMedia = media.filter(mediaItem => mediaItem.url !== primaryMedia?.url)
  const orderedMedia = primaryMedia ? [primaryMedia, ...otherMedia] : otherMedia

  return orderedMedia.map(mediaItem => ({
    ...mediaItem,
    action: CONCEPT.NONE,
  }))
}

const editingStateForConcept = concept => {
  return {
    author: concept.author || 'unknown',
    name: concept.name,
    names: namesState(concept.names),
    namesIndex: 0,
    media: mediaState(concept.media),
    mediaIndex: 0,
    parentName: concept.parent?.name,
    rankLevel: concept.rankLevel || '',
    rankName: concept.rankName || '',
  }
}

export default editingStateForConcept
