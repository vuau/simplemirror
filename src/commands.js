import schema from './schema'
import {
  toggleMark, setBlockType, wrapIn, chainCommands, lift, joinUp,
  exitCode,
  newlineInCode,
  createParagraphNear,
  liftEmptyBlock,
  splitBlock,
  deleteSelection,
  joinBackward,
  selectNodeBackward,
  joinForward,
  selectNodeForward,
  selectAll
} from 'prosemirror-commands'
import {
  splitListItem,
  wrapInList, liftListItem, sinkListItem
} from 'prosemirror-schema-list'
import { undo, redo } from 'prosemirror-history'

const backspace = chainCommands(deleteSelection, joinBackward, selectNodeBackward)

const del = chainCommands(deleteSelection, joinForward, selectNodeForward)

const createPragraph = (state, dispatch, view) => {
  splitBlock(state, dispatch, view)
  wrapIn(schema.nodes.paragraph)(state, dispatch, view)
  return true
}

const handleEnter = (state, dispatch, view) => {
  const { $from } = state.selection
  const grandParent = $from.node(-1)
  let command
  if (grandParent.type !== schema.nodes.list_item) {
    // not in a list
    if (grandParent.type !== schema.nodes.table_cell) {
      command = chainCommands(
        newlineInCode,
        createParagraphNear,
        liftEmptyBlock,
        splitBlock
      )
    } else {
      command = createPragraph
    }
  } else {
    if (grandParent.textContent) {
      command = splitListItem(schema.nodes.list_item)
    } else {
      // is in list but without text
      command = liftListItem(schema.nodes.list_item)
    }
  }
  if (command) return command(state, dispatch, view)
  return false
}

export const createHardBreak = (state, dispatch) => {
  if (dispatch) {
    dispatch(
      state.tr
        .replaceSelectionWith(schema.nodes.hard_break.create())
        .scrollIntoView()
    )
  }
  return true
}

export default {
  undo: {
    command: undo,
    shortcuts: ['Mod-z'],
    className: 'fas fa-undo'
  },
  redo: {
    command: redo,
    shortcuts: ['Shift-Mod-Z'],
    className: 'fas fa-redo'
  },
  bold: {
    command: toggleMark(schema.marks.strong),
    className: 'fas fa-bold',
    shortcuts: ['Mod-b', 'Mod-B']
  },
  italic: {
    command: toggleMark(schema.marks.em),
    mark: schema.marks.em,
    className: 'fas fa-italic',
    shortcuts: ['Mod-i', 'Mod-I']
  },
  strikethrough: {
    command: toggleMark(schema.marks.strikethrough),
    className: 'fas fa-strikethrough',
    shortcuts: ['Mod-s', 'Mod-S']
  },
  h1: {
    command: setBlockType(schema.nodes.heading, { level: 1 }),
    text: 'H1',
    className: 'avenir'
  },
  h2: {
    command: setBlockType(schema.nodes.heading, { level: 2 }),
    text: 'H2',
    className: 'avenir'
  },
  h3: {
    command: setBlockType(schema.nodes.heading, { level: 3 }),
    text: 'H3',
    className: 'avenir'
  },
  h4: {
    command: setBlockType(schema.nodes.heading, { level: 4 }),
    text: 'H4',
    className: 'avenir'
  },
  orderedList: {
    command: wrapInList(schema.nodes.ordered_list),
    className: 'fas fa-list-ol'
  },
  unorderedList: {
    command: wrapInList(schema.nodes.bullet_list),
    className: 'fas fa-list-ul'
  },
  indent: {
    command: chainCommands(sinkListItem(schema.nodes.list_item), joinUp),
    className: 'fas fa-indent',
    shortcuts: ['Tab']
  },
  outdent: {
    command: chainCommands(liftListItem(schema.nodes.list_item), lift),
    className: 'fas fa-outdent',
    shortcuts: ['Shift-Tab']
  },
  quote: {
    command: wrapIn(schema.nodes.blockquote),
    className: 'fas fa-quote-left'
  },
  enter: {
    command: handleEnter,
    shortcuts: ['Enter']
  },
  break: {
    command: createHardBreak,
    shortcuts: ['Shift-Enter', 'Ctrl-Enter']
  },
  exit: {
    command: exitCode,
    shortcuts: ['Mod-Enter']
  },
  backspace: {
    command: backspace,
    shortcuts: ['Backspace', 'Mod-Backspace']
  },
  delete: {
    command: del,
    shortcuts: ['Delete', 'Mod-Delete']
  },
  selectAll: {
    command: selectAll,
    shortcuts: ['Mod-a']
  }
}
