import {
  inputRules,
  wrappingInputRule,
  textblockTypeInputRule,
  smartQuotes,
  emDash,
  ellipsis
} from 'prosemirror-inputrules'

import schema from './schema'

// Given a blockquote node type, returns an input rule that turns `"> "`
// at the start of a textblock into a blockquote.
export const quoteRule = wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote)

// Given a list node type, returns an input rule that turns a number
// followed by a dot at the start of a textblock into an ordered list.
export const orderedListRule = wrappingInputRule(
  /^(\d+)\.\s$/,
  schema.nodes.ordered_list,
  (match) => ({ order: +match[1] }),
  (match, node) => node.childCount + node.attrs.order === +match[1]
)

// Given a list node type, returns an input rule that turns a bullet
// (dash, plush, or asterisk) at the start of a textblock into a
// bullet list.
export const unorderedListRule = wrappingInputRule(
  /^\s*([-+*])\s$/,
  schema.nodes.bullet_list
)

// Given a code block node type, returns an input rule that turns a
// textblock starting with three backticks into a code block.
export const codeRule = textblockTypeInputRule(/^```$/, schema.nodes.code_block)

// Given a node type and a maximum level, creates an input rule that
// turns up to that number of `#` characters followed by a space at
// the start of a textblock into a heading whose level corresponds to
// the number of `#` signs.
export const headingRule = textblockTypeInputRule(
  new RegExp('^(#{1,' + 6 + '})\\s$'),
  schema.nodes.heading,
  (match) => ({ level: match[1].length })
)

export function createInputRules (customCommands) {
  const customRules = customCommands.map((c) => c.inputRule).filter((c) => c)
  const rules = smartQuotes.concat(ellipsis, emDash, ...[customRules])
  return inputRules({ rules })
}

export default {
  quoteRule,
  orderedListRule,
  unorderedListRule,
  codeRule,
  headingRule
}
