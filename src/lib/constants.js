export const ACTION = {
  ADD: 'Add',
  DELETE: 'Delete',
  EDIT: 'Edit',
  NONE: 'None',
  RESET: 'Reset',
}

export const CONCEPT_EXPAND = {
  DESCENDANTS: 'descendants',
  OFF: 'off',
  ON: 'on',
  TOGGLE: 'toggle',
}

export const CONCEPT_EXTENT = {
  CHILDREN: 'children',
  CONCEPT: 'concept',
  DESCENDANTS: 'descendants',
}

export const CONCEPT_FIELD = {
  ALIASES: 'aliases',
  AUTHOR: 'author',
  CHILDREN: 'children',
  DELETE: 'delete',
  MEDIA: 'media',
  NAME: 'name',
  PARENT: 'parent',
  RANK: 'rank',
  REALIZATIONS: 'realizations',
}

export const CONCEPT_HISTORY = {
  TYPE: {
    APPROVED: 'approved',
    CONCEPT: 'concept',
    PENDING: 'pending',
  },
}
export const CONCEPT_NAME = {
  VALUE: 'name',
  EXTENT: 'nameExtent',
}

export const CONCEPT_NAME_EXTENT = {
  ASSOCIATED_DATA: 'Associated Data',
  NAME_ONLY: 'Name Only',
}

export const CONCEPT_NAME_TYPES = {
  COMMON: 'Common',
  FORMER: 'Former',
  PRIMARY: 'Primary',
  SYNONYM: 'Synonym',
}

export const CONCEPT_PROPERTY_LIST = {
  ITEMS_PER_PAGE: 5,
}

export const CONCEPT_RANK = {
  LEVEL: 'level',
  NAME: 'name',
}

export const CONCEPT_SELECT = {
  CONCEPT_LABEL: 'Concept',
  LEFT_COMPONENT: {
    INFO_ICON: 'info_icon',
    NONE: 'none',
  },
  RIGHT_COMPONENT: {
    NAV_HISTORY: 'nav',
    NONE: 'none',
    SPECIAL: 'special',
  },
  TO_CONCEPT_LABEL: 'To Concept',
  WIDTH: 350,
}

export const CONCEPT_STATE = {
  CHILD: {
    ADD: 'Add Child',
  },
  ALIAS: {
    ADD: 'Add Alias',
    DELETE: 'Delete Alias',
    EDIT: 'Edit Alias',
  },
  ALIASES: 'Aliases',
  AUTHOR: 'Author',
  CHILDREN: 'Children',
  INITIAL: 'Initial State',
  MEDIA: 'Media',
  MEDIA_ITEM: {
    ADD: 'Add Media',
    DELETE: 'Delete Media',
    EDIT: 'Edit Media',
    INDEX: 'Set Media Index',
  },
  NAME: 'Edit Name',
  NO_ACTION: 'None',
  PARENT: 'Edit Parent',
  RANK: 'Edit Rank',
  REALIZATION: {
    ADD: 'Add Realization',
    DELETE: 'Delete Realization',
    EDIT: 'Edit Realization',
  },
  REALIZATIONS: 'Realizations',
  RESET: {
    CHILDREN: 'Reset Children',
    ALIASES: 'Reset Aliases',
    AUTHOR: 'Reset Author',
    DELETE: 'Reset Delete Concept',
    MEDIA: 'Reset Media',
    NAME: 'Reset Name',
    PARENT: 'Reset Parent',
    RANK: 'Reset Rank',
    REALIZATIONS: 'Reset Realizations',
    TO_INITIAL: 'Reset To Initial',
  },
}

export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export const EXPORT_TYPE = {
  CSV: 'CSV',
  JSON: 'JSON',
}

export const HISTORY_FIELD = {
  ALIAS: 'ConceptName',
  CHILD: 'Concept.child',
  MEDIA: 'Media',
  NAME: 'ConceptName',
  PARENT: 'Concept.parent',
  RANK: 'Rank',
  REALIZATION: 'LinkRealization',
}

export const LABELS = {
  BUTTON: {
    APPROVE: 'Approve',
    APPROVE_ALL: 'Approve All',
    BACK_TO_EDIT: 'Back to Editing',
    CANCEL: 'Cancel',
    CLOSE: 'Close',
    CONFIRM: 'Confirm',
    CONFIRM_DISCARD: 'Discard',
    CONTINUE: 'Continue',
    DEFER: 'Defer',
    DELETE: 'Delete',
    DISCARD: 'Discard',
    DISCARD_ALL: 'Discard All',
    LOCK: 'Lock',
    REJECT: 'Reject',
    REJECT_ALL: 'Reject All',
    REJECT_DISCARD: 'Keep',
    SAVE: 'Save',
    STAGE: 'Stage',
    UNLOCK: 'Unlock',
  },
  CONCEPT: {
    ACTION: {
      CANCEL: 'Cancel',
      DEFER: 'Defer',
      DELETE: 'Delete Concept',
      DISCARD: 'Discard',
      EDIT: 'Edit',
      PENDING: 'Pending',
      REJECT: 'Reject',
      REJECT_ALL: 'Reject All',
      SAVE: 'Save',
      STAGED: 'Staged',
    },
    CHANGE_NAME: {
      ASSOCIATED_DATA: 'Associated Data',
      NAME_ONLY: 'Name Only',
    },
  },
}

export const PAGINATION = {
  HISTORY: {
    DEFAULT_LIMIT: 50,
    EXPORT_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  },
  REFERENCES: {
    DEFAULT_LIMIT: 50,
    EXPORT_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  },
  TEMPLATES: {
    DEFAULT_LIMIT: 50,
    EXPORT_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  },
  USERS: {
    DEFAULT_LIMIT: 25,
    EXPORT_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  },
}

export const PENDING = {
  APPROVAL: {
    ACCEPT: 'approve',
    OTHER: 'other',
    REJECT: 'reject',
  },
  DATA: {
    CONCEPT: 'concept',
    CONFIRM: 'confirm',
    PARENT: 'parent',
  },
  GROUP: {
    ALIASES: 'Aliases',
    ALL: 'All',
    CHILDREN: 'Children',
    MEDIA: 'Media',
    NAME: 'Name',
    PARENT: 'Parent',
    RANK: 'Rank',
    REALIZATIONS: 'Realizations',
  },
}

export const PREFS_AUTOSAVE_MILLIS = 15_000

export const PROCESSING = {
  DELETING: 'Deleting...',
  LOADING: 'Loading...',
  LOADING_DELAY: 333,
  SAVING: 'Saving...',
  UPDATING: 'Updating...',
}

export const RESETTING = {
  CONFIRMED: {
    NO: 'Discard Reset',
    YES: 'Perform Reset',
  },
  EXTENT: {
    ME: 'Me',
    NONE: 'None',
    OTHER: 'Other',
  },
  ALIASES: 'Aliases',
  AUTHOR: 'Author',
  CHILDREN: 'Children',
  MEDIA: 'Media',
  NAME: 'Name',
  PARENT: 'Parent',
  RANK: 'Rank',
  REALIZATIONS: 'Realizations',
}

export const SELECTED = {
  CONCEPT: 'concept',
  PANEL: 'panel',
  PANELS: {
    CONCEPTS: 'Concepts',
    REFERENCES: 'References',
    TEMPLATES: 'Templates',
  },
  SETTINGS: {
    HISTORY: {
      KEY: 'history',
      TYPE: 'type',
      TYPES: {
        APPROVED: CONCEPT_HISTORY.TYPE.APPROVED,
        CONCEPT: CONCEPT_HISTORY.TYPE.CONCEPT,
        PENDING: CONCEPT_HISTORY.TYPE.PENDING,
      },
    },
    REFERENCES: {
      KEY: 'references',
      BY_CONCEPT: 'byConcept',
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
  },
}

export const LOCAL_STORE = {
  AUTH: {
    KEY: 'kb:auth',
  },
}

export const TO_CONCEPT_SPECIAL = ['self', 'nil']

export const TOOLTIPS = {
  DELAY: {
    onEnter: 500,
    onLeave: 0,
  },
  FONT: {
    SIZE: '1em',
    FAMILY: 'Arial, sans-serif',
  },
  HISTORY: {
    EXPORT: {
      APPROVED: 'Export Approved History',
      CONCEPT: 'Export History for selected Concept',
      PENDING: 'Export Pending History',
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
  TEMPLATES: {
    EXPORT: {
      ALL: 'Export All Templates',
      CONCEPT: 'Export Templates for selected Concept',
      CONCEPT_TO_CONCEPT: 'Export Templates for selected Concept to selected To Concept',
      TO_CONCEPT: 'Export Templates for selected To Concept',
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

export const { DELAY, FONT, HISTORY, TEMPLATES, REFERENCES, USERS } = TOOLTIPS

export const UNSAFE_ACTION = {
  CONCEPT: 'concept',
  PANEL: 'panel',
  LOGOUT: 'logout',
  REFRESH: 'refresh',
}

export const USER_ROLES = {
  ADMIN: 'Admin',
  MAINT: 'Maint',
  READ_ONLY: 'ReadOnly',
  USER: 'User',
}
