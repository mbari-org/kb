const TOOLTIPS = {
  DELAY: {
    onEnter: 500,
    onLeave: 100,
  },
  EXPORT: {
    HISTORY: {
      APPROVED: 'Export Approved History',
      CONCEPT: 'Export History for selected Concept',
      PENDING: 'Export Pending History',
    },
    REFERENCES: {
      ALL: 'Export All References',
      BY_CONCEPT: 'Export References associated with selected Concept',
    },
    TEMPLATES: {
      ALL: 'Export All Templates',
      CONCEPT: 'Export Templates for selected Concept',
      CONCEPT_TO_CONCEPT: 'Export Templates for selected Concept to selected To Concept',
      TO_CONCEPT: 'Export Templates for selected To Concept',
    },
    USERS: {
      ALL: 'Export All Users',
    },
  },
}

export const { DELAY } = TOOLTIPS
export const { EXPORT } = TOOLTIPS

export default TOOLTIPS
