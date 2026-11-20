// User-visible strings must come from src/config so a locale can be produced from one source.
// Identifier strings (src/lib/constants, CONFIG.FIELDS) are intentionally out of scope.
const UI_PROPS = new Set([
  'alt',
  'aria-label',
  'countLabel',
  'description',
  'headerName',
  'helperText',
  'label',
  'lines',
  'message',
  'placeholder',
  'subTitle',
  'subtitle',
  'switchLabel',
  'title',
  'tooltip',
])

const HAS_LETTER = /[A-Za-z]/
const EXEMPT = /ui-text-exempt/

const hasExemptComment = (context, node) => {
  const line = node.loc.start.line
  return context.sourceCode
    .getAllComments()
    .some(comment => EXEMPT.test(comment.value) && comment.loc.end.line >= line - 1 && comment.loc.end.line <= line)
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hard-coded user-visible strings; source UI text from src/config.',
    },
    schema: [],
    messages: {
      jsxText: 'Hard-coded UI text. Source user-visible strings from src/config.',
      prop: 'Hard-coded UI string for "{{name}}". Source user-visible strings from src/config.',
    },
  },

  create(context) {
    const report = (node, messageId, data) => {
      if (hasExemptComment(context, node)) return
      context.report({ node, messageId, data })
    }

    const isUiString = value => typeof value === 'string' && HAS_LETTER.test(value)

    const checkPropertyName = node => {
      const key = node.key
      const name = key?.type === 'Identifier' ? key.name : key?.type === 'Literal' ? String(key.value) : null
      if (UI_PROPS.has(name) && node.value?.type === 'Literal' && isUiString(node.value.value)) {
        report(node.value, 'prop', { name })
      }
    }

    return {
      JSXText(node) {
        if (HAS_LETTER.test(node.value)) {
          report(node, 'jsxText')
        }
      },

      JSXAttribute(node) {
        const name = node.name?.name
        if (!UI_PROPS.has(name)) return
        if (node.value?.type === 'Literal' && isUiString(node.value.value)) {
          report(node.value, 'prop', { name })
        }
      },

      Property: checkPropertyName,
      PropertyDefinition: checkPropertyName,
    }
  },
}
