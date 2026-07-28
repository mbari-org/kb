export const PREFS = {
  USER: {
    AUTOSAVE_MILLIS: 15_000,
    KEY: {
      CONCEPTS: 'concepts',
      PANELS: 'panels',
      SETTINGS: 'settings',
    },
    MAX_LENGTH: 255,
    PREFIX: 'kb-ui/',
  },
  APP: {
    DSG: {
      CONCEPT_URL: {
        DEFAULT: '',
        KEY: 'dsg-concept-url',
      },
    },
    MEDIA: {
      BASE_URL: {
        DEFAULT: '',
        KEY: 'media-base-url',
      },
    },
    PHYLOGENY: {
      ROOT: {
        DEFAULT: 'marine organism',
        KEY: 'phylogeny-root',
      },
    },
    PREFIX: 'kb-app',
  },
  AUTH: {
    LOCAL_STORE: 'kb:auth',
  },
}
