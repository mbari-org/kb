import { CONCEPT } from './concept.js'

export const SELECTED = {
  CONCEPT: 'concept',
  PANEL: 'panel',
  PANELS: {
    CONCEPTS: 'Concepts',
    REALIZATIONS: 'Realizations',
    REFERENCES: 'References',
    TEMPLATES: 'Templates',
  },
  SETTINGS: {
    HISTORY: {
      KEY: 'history',
      TYPE: 'type',
      TYPES: {
        APPROVED: CONCEPT.HISTORY.TYPE.APPROVED,
        CONCEPT: CONCEPT.HISTORY.TYPE.CONCEPT,
        PENDING: CONCEPT.HISTORY.TYPE.PENDING,
      },
    },
    REFERENCES: {
      KEY: 'references',
      BY_CONCEPT: 'byConcept',
      FILTERS: {
        KEY: 'filters',
        CITATION: 'citation',
        CONCEPT: 'concept',
        CONCEPTS: 'concepts',
        EXTENT: 'extent',
      },
    },
    TEMPLATES: {
      KEY: 'templates',
      BY_AVAILABLE: 'byAvailable',
      FILTERS: {
        KEY: 'filters',
        CONCEPT: 'concept',
        TO_CONCEPT: 'toConcept',
        LINK_NAME: 'linkName',
        LINK_VALUE: 'linkValue',
      },
    },
    REALIZATIONS: {
      KEY: 'realizations',
      FILTERS: {
        KEY: 'filters',
        CONCEPT: 'concept',
        TO_CONCEPT: 'toConcept',
        LINK_NAME: 'linkName',
        LINK_VALUE: 'linkValue',
      },
    },
  },
}

