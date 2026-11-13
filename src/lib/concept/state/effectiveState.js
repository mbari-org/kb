import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const cloneItems = items => items.map(item => ({ ...item }))

const createEffectiveState = (initialState, { applyImmediately }) => {
  const state = {
    aliases: cloneItems(initialState.aliases),
    author: initialState.author.value,
    children: cloneItems(initialState.children),
    media: cloneItems(initialState.media),
    name: initialState.name.value,
    parent: initialState.parent.value,
    rank: {
      level: initialState.rank.level,
      name: initialState.rank.name,
    },
    realizations: cloneItems(initialState.realizations),
  }

  const findAlias = item => {
    if (item.id != null) {
      return state.aliases.find(alias => alias.id === item.id)
    }
    return state.aliases.find(alias => alias.name === item.name)
  }

  const findMedia = item => {
    if (item.stateId != null) {
      return state.media.find(media => media.stateId === item.stateId)
    }
    if (item.id != null) {
      return state.media.find(media => media.id === item.id)
    }
    return undefined
  }

  const findRealization = item => {
    if (item.stateId != null) {
      return state.realizations.find(realization => realization.stateId === item.stateId)
    }
    if (item.id != null) {
      return state.realizations.find(realization => realization.id === item.id)
    }
    return undefined
  }

  const replaceWhere = (list, predicate, next) => {
    const index = list.findIndex(predicate)
    if (index < 0) return list
    return list.toSpliced(index, 1, next)
  }

  const apply = op => {
    if (op.field === CONCEPT.FIELD.NAME) {
      state.name = op.item.value
      return
    }

    if (!applyImmediately) return

    switch (op.field) {
      case CONCEPT.FIELD.AUTHOR:
        state.author = op.item.value
        break

      case CONCEPT.FIELD.PARENT:
        state.parent = op.item.value
        break

      case CONCEPT.FIELD.RANK:
        state.rank = {
          level: op.item.level,
          name: op.item.name,
        }
        break

      case CONCEPT.FIELD.ALIASES: {
        switch (op.action) {
          case CONCEPT_STATE.ALIAS.ADD:
            state.aliases = [...state.aliases, { ...op.item }]
            break
          case CONCEPT_STATE.ALIAS.DELETE: {
            const target = findAlias(op.item)
            state.aliases = state.aliases.filter(alias => alias !== target)
            break
          }
          case CONCEPT_STATE.ALIAS.EDIT: {
            const prior = findAlias(op.item)
            if (!prior) break
            state.aliases = replaceWhere(state.aliases, alias => alias === prior, {
              ...prior,
              ...op.item,
            })
            break
          }
          default:
            break
        }
        break
      }

      case CONCEPT.FIELD.CHILDREN:
        if (op.action === CONCEPT_STATE.CHILD.ADD) {
          state.children = [...state.children, { ...op.item }]
        }
        break

      case CONCEPT.FIELD.MEDIA: {
        switch (op.action) {
          case CONCEPT_STATE.MEDIA_ITEM.ADD:
            state.media = [...state.media, { ...op.item }]
            break
          case CONCEPT_STATE.MEDIA_ITEM.DELETE: {
            const target = findMedia(op.item)
            state.media = state.media.filter(media => media !== target)
            break
          }
          case CONCEPT_STATE.MEDIA_ITEM.EDIT: {
            const prior = findMedia(op.item)
            if (!prior) break
            state.media = replaceWhere(state.media, media => media === prior, {
              ...prior,
              ...op.item,
            })
            break
          }
          default:
            break
        }
        break
      }

      case CONCEPT.FIELD.REALIZATIONS: {
        switch (op.action) {
          case CONCEPT_STATE.REALIZATION.ADD:
            state.realizations = [...state.realizations, { ...op.item }]
            break
          case CONCEPT_STATE.REALIZATION.DELETE: {
            const target = findRealization(op.item)
            state.realizations = state.realizations.filter(realization => realization !== target)
            break
          }
          case CONCEPT_STATE.REALIZATION.EDIT: {
            const prior = findRealization(op.item)
            if (!prior) break
            state.realizations = replaceWhere(
              state.realizations,
              realization => realization === prior,
              { ...prior, ...op.item }
            )
            break
          }
          default:
            break
        }
        break
      }

      default:
        break
    }
  }

  return {
    apply,
    findAlias,
    findMedia,
    findRealization,
    get state() {
      return state
    },
  }
}

export { createEffectiveState }
