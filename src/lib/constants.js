export const CONCEPT_FIELDS = {
  ALIASES: 'aliases',
  MEDIA: 'media',
  PARENT: 'parent',
  PRIMARY: {
    AUTHOR: 'author',
    NAME: 'name',
  },
  RANK: {
    LEVEL: 'level',
    NAME: 'name',
  },
  STRUCTURE: {
    CHILD: 'child',
    CONCEPT: 'concept',
    NAME: 'name',
    PARENT: 'parent',
  },
}

export const CONCEPT_NAME_TYPES = {
  COMMON: 'Common',
  FORMER: 'Former',
  PRIMARY: 'Primary',
  SYNONYM: 'Synonym',
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
  FIELD: {
    SET: 'Field Set',
  },
  INITIAL: 'Initial State',
  MEDIA: {
    ADD: 'Media Add',
    DELETE: 'Media Delete',
    EDIT: 'Media Edit',
  },
  NO_ACTION: 'None',
  RESET: {
    ADD_CHILD: 'Reset Add Child',
    ADD_CHILDREN: 'Reset Add Children',
    ALIAS: 'Reset Alias',
    ALIASES: 'Reset Aliases',
    CHANGE_NAME: 'Reset Change Name',
    CHANGE_PARENT: 'Reset Change Parent',
    CONFIRMED: {
      NO: 'Discard Reset',
      YES: 'Perform Reset',
    },
    DELETE_CONCEPT: 'Reset Delete Concept',
    FIELD: 'Reset Field',
    MEDIA: 'Reset Media',
    MEDIA_ITEM: 'Reset Media Item',
    TO_INITIAL: 'Reset To Initial',
  },
  STRUCTURE: {
    ADD_CHILD: 'Add Child',
    CHANGE_NAME: 'Change Name',
    CHANGE_PARENT: 'Change Parent',
    DELETE_CONCEPT: 'Delete Concept',
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
    CONFIRM_DISCARD: 'Confirm',
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
      SHOW: 'Staged',
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
  },
}

export const PROCESSING = {
  DELETING: 'Deleting...',
  LOADING: 'Loading...',
  LOADING_DELAY: 333,
  SAVING: 'Saving...',
  UPDATING: 'Updating...',
}

export const RANK = {
  LEVEL: 'rankLevel',
  NAME: 'rankName',
}

export const RESETTING = {
  ME: 'Me',
  NONE: 'None',
  OTHER: 'Other',
}

export const SELECTED = {
  CONCEPT: 'concept',
  PANEL: 'panel',
  PANELS: {
    CONCEPTS: 'Concepts',
    REFERENCES: 'References',
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
