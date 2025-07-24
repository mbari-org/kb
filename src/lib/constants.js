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
  RIGHT_COMPONENT: {
    NAV_HISTORY: 'nav',
    NONE: 'none',
    SPECIAL: 'special',
  },
  TO_CONCEPT_LABEL: 'To Concept',
  WIDTH: 350,
}

export const CONCEPT_STATE = {
  ALIAS: {
    ADD: 'Alias Add',
    DELETE: 'Alias Delete',
    EDIT: 'Alias Edit',
  },
  ALIASES: 'Aliases',
  AUTHOR: 'Author',
  CHILDREN: 'Children',
  CONCEPT: {
    ADD_CHILD: 'Add Child',
  },
  INITIAL: 'Initial State',
  MEDIA: 'Media',
  MEDIA_ITEM: {
    ADD: 'Media Add',
    DELETE: 'Media Delete',
    EDIT: 'Media Edit',
  },
  NAME: 'Name',
  NO_ACTION: 'None',
  RANK: 'Rank',
  REALIZATION: {
    ADD: 'Realization Add',
    DELETE: 'Realization Delete',
    EDIT: 'Realization Edit',
  },
  REALIZATIONS: 'Realizations',
  RESET: {
    ADD_CHILD: 'Reset Add Child',
    ADD_CHILDREN: 'Reset Add Children',
    ALIASES: 'Reset Aliases',
    AUTHOR: 'Reset Author',
    DELETE_CONCEPT: 'Reset Delete Concept',
    MEDIA: 'Reset Media',
    NAME: 'Reset Name',
    PARENT: 'Reset Parent',
    RANK: 'Reset Rank',
    REALIZATIONS: 'Reset Realizations',
    TO_INITIAL: 'Reset To Initial',
  },
}

export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

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
  GROUP: {
    ALIASES: 'Aliases',
    ALL: 'All',
    CONCEPT_NAME: 'ConceptName',
    MEDIA: 'Media',
    RANK: 'Rank',
    REALIZATIONS: 'Realizations',
  },
}

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
        APPROVED: 'approved',
        CONCEPT: 'concept',
        PENDING: 'pending',
      },
    },
    REFERENCES: {
      KEY: 'references',
      BY_CONCEPT: 'byConcept',
    },
    TEMPLATES: {
      KEY: 'templates',
      AVAILABLE: 'available',
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

export const STORE = {
  AUTH: {
    KEY: 'kb:auth',
  },
  CONCEPT: {
    KEY: 'kb:concepts',
    MAX_SIZE: 50,
  },
  PANEL: {
    KEY: 'kb:panels',
    MAX_SIZE: 50,
  },
  SETTINGS: {
    KEY: 'kb:settings',
  },
}

export const TO_CONCEPT_SPECIAL_VALUES = ['self', 'nil']

export const USER_ROLES = {
  ADMIN: 'Admin',
  MAINT: 'Maint',
  READ_ONLY: 'ReadOnly',
  USER: 'User',
}
