import {
  InputRule,
  inputRules,
  wrappingInputRule,
  textblockTypeInputRule,
  smartQuotes,
  emDash,
  ellipsis
} from 'prosemirror-inputrules'

import schema from './schema'

// Taken from: https://discuss.prosemirror.net/t/input-rules-for-wrapping-marks/537/10
// Usage: markInputRule(/_(\S(?:|.*?\S))_$/, schema.marks.em) then we can type _text_ to have <em>text</em> for example
function markInputRule (regexp, markType, getAttrs) {
  return new InputRule(regexp, (state, match, start, end) => {
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs
    const tr = state.tr
    if (match[1]) {
      const textStart = start + match[0].indexOf(match[1])
      const textEnd = textStart + match[1].length
      if (textEnd < end) tr.delete(textEnd, end)
      if (textStart > start) tr.delete(start, textStart)
      end = start + match[1].length
    }
    tr.addMark(start, end, markType.create(attrs))
    tr.removeStoredMark(markType) // Do not continue with mark.
    return tr
  })
}

// Given a blockquote node type, returns an input rule that turns `"> "`
// at the start of a textblock into a blockquote.
export const quoteRule = rule =>
  wrappingInputRule(rule, schema.nodes.blockquote)

// Given a list node type, returns an input rule that turns a number
// followed by a dot at the start of a textblock into an ordered list.
export const orderedListRule = rule =>
  wrappingInputRule(
    rule,
    schema.nodes.ordered_list,
    match => ({ order: +match[1] }),
    (match, node) => node.childCount + node.attrs.order === +match[1]
  )

// Given a list node type, returns an input rule that turns a bullet
// (dash, plush, or asterisk) at the start of a textblock into a
// bullet list.
export const unorderedListRule = rule =>
  wrappingInputRule(rule, schema.nodes.bullet_list)

// Given a code block node type, returns an input rule that turns a
// textblock starting with three backticks into a code block.
export const codeBlockRule = rule =>
  textblockTypeInputRule(rule, schema.nodes.code_block)

export const codeRule = rule => markInputRule(rule, schema.marks.code)

// Given a node type and a maximum level, creates an input rule that
// turns up to that number of `#` characters followed by a space at
// the start of a textblock into a heading whose level corresponds to
// the number of `#` signs.
export const h1Rule = rule =>
  textblockTypeInputRule(rule, schema.nodes.heading, () => ({ level: 1 }))
export const h2Rule = rule =>
  textblockTypeInputRule(rule, schema.nodes.heading, () => ({ level: 2 }))
export const h3Rule = rule =>
  textblockTypeInputRule(rule, schema.nodes.heading, () => ({ level: 3 }))
export const h4Rule = rule =>
  textblockTypeInputRule(rule, schema.nodes.heading, () => ({ level: 4 }))

const supportRules = {
  quote: quoteRule,
  orderedList: orderedListRule,
  unorderedList: unorderedListRule,
  codeBlock: codeBlockRule,
  code: codeRule,
  h1: h1Rule,
  h2: h2Rule,
  h3: h3Rule,
  h4: h4Rule
}

export function createInputRules (config) {
  const rules = []
  for (const [key, { inputRule }] of Object.entries(config)) {
    if (inputRule) {
      rules.push(supportRules[key](inputRule))
    }
  }
  return inputRules({
    rules: smartQuotes.concat(ellipsis, emDash, ...[rules])
  })
}
