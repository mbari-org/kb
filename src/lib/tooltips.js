const TOOLTIPS = {
  DELAY: {
    onEnter: 500,
    onLeave: 0,
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
  USERS: {
    EDIT: 'Edit User details',
    LOCK: 'Lock User to prevent login',
    UNLOCK: 'Unlock User to allow login',
  },
}

export const { DELAY, EXPORT, USERS } = TOOLTIPS

export default TOOLTIPS
