const TOOLTIPS = {
  DELAY: {
    onEnter: 500,
    onLeave: 0,
  },
  HISTORY: {
    EXPORT: {
      APPROVED: 'Export Approved History',
      CONCEPT: 'Export History for selected Concept',
      PENDING: 'Export Pending History',
    },
  },
  TEMPLATES: {
    EXPORT: {
      ALL: 'Export All Templates',
      CONCEPT: 'Export Templates for selected Concept',
      CONCEPT_TO_CONCEPT: 'Export Templates for selected Concept to selected To Concept',
      TO_CONCEPT: 'Export Templates for selected To Concept',
    },
  },
  REFERENCES: {
    EXPORT: {
      BY_CONCEPT: 'Export References associated with selected Concept',
      ALL: 'Export All References',
    },
    SWITCH: {
      BY_CONCEPT: 'References associated with selected Concept',
      ALL: 'All References',
    },
  },
  USERS: {
    EDIT: 'Edit User details',
    EXPORT: {
      ALL: 'Export All Users',
    },
    LOCK: 'Lock User to prevent login',
    UNLOCK: 'Unlock User to allow login',
  },
}

export const { DELAY, HISTORY, TEMPLATES, REFERENCES, USERS } = TOOLTIPS

export default TOOLTIPS
