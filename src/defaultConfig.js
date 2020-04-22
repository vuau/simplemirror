export default {
  undo: {
    className: 'fas fa-undo',
    shortcut: ['Mod-z']
  },
  redo: {
    className: 'fas fa-redo',
    shortcuts: ['Shift-Mod-z']
  },
  bold: {
    className: 'fas fa-bold',
    shortcuts: ['Mod-b']
  },
  italic: {
    className: 'fas fa-italic',
    shortcuts: ['Mod-i']
  },
  strikethrough: {
    className: 'fas fa-strikethrough',
    shortcuts: ['Mod-s']
  },
  h1: {
    text: 'H1',
    className: 'avenir',
    inputRule: /^#\s/
  },
  h2: {
    text: 'H2',
    className: 'avenir',
    inputRule: /^##\s/
  },
  h3: {
    text: 'H3',
    className: 'avenir',
    inputRule: /^###\s/
  },
  h4: {
    text: 'H4',
    className: 'avenir',
    inputRule: /^####\s/
  },
  orderedList: {
    className: 'fas fa-list-ol',
    inputRule: /^(\d+)\.\s$/
  },
  unorderedList: {
    className: 'fas fa-list-ul',
    inputRule: /^\s*([-+*])\s$/
  },
  indent: {
    className: 'fas fa-indent',
    shortcuts: ['Tab']
  },
  outdent: {
    className: 'fas fa-outdent',
    shortcuts: ['Shift-Tab']
  },
  quote: {
    className: 'fas fa-quote-left',
    inputRule: /^\s*>\s$/
  },
  code: {
    className: 'fas fa-code',
    inputRule: /^```$/
  }
}
