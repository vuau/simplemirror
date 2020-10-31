import schema from './schema'
import {
  toggleMark,
  setBlockType,
  wrapIn,
  chainCommands,
  lift,
  joinUp,
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
  wrapInList,
  liftListItem,
  sinkListItem,
  splitListItem
} from 'prosemirror-schema-list'
import { undo, redo } from 'prosemirror-history'
import { loadScript, showUploadWidget, injectFileToView } from './utils'

const backspace = chainCommands(
  deleteSelection,
  joinBackward,
  selectNodeBackward
)

const del = chainCommands(deleteSelection, joinForward, selectNodeForward)

const createPragraph = (state, dispatch, view) => {
  splitBlock(state, dispatch, view)
  wrapIn(schema.nodes.paragraph)(state, dispatch, view)
  return true
}

const createCodeBlock = setBlockType(schema.nodes.code_block)

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
      if ($from.node().type === schema.nodes.code_block) {
        command = newlineInCode
      } else {
        command = splitListItem(schema.nodes.list_item)
      }
    } else {
      // is in list but without text
      command = liftListItem(schema.nodes.list_item)
    }
  }
  if (command) return command(state, dispatch, view)
  return false
}

export const createHardBreak = chainCommands(exitCode, (state, dispatch) => {
  if (dispatch) {
    dispatch(
      state.tr
        .replaceSelectionWith(schema.nodes.hard_break.create())
        .scrollIntoView()
    )
  }
  return true
})

export const insertImage = (state, dispatch, view, options) => {
  if (dispatch) {
    if (!navigator.onLine || !options || !options.cloudinary) {
      console.log('You need to be online to upload file')
      const url = prompt('Input image URL')
      if (url) {
        injectFileToView(view, url)
      } else {
        view.focus()
      }
    } else {
      if (window.cloudinary) {
        showUploadWidget(options.cloudinary).then(url => injectFileToView(view, url))
      } else {
        loadScript('https://widget.cloudinary.com/v2.0/global/all.js')
          .then(() => showUploadWidget(options.cloudinary))
          .then(url => injectFileToView(view, url))
          .catch(() => view.focus())
      }
    }
  }
  return true
}

export default {
  undo: undo,
  redo: redo,
  bold: toggleMark(schema.marks.strong),
  italic: toggleMark(schema.marks.em),
  strikethrough: toggleMark(schema.marks.strikethrough),
  h1: setBlockType(schema.nodes.heading, { level: 1 }),
  h2: setBlockType(schema.nodes.heading, { level: 2 }),
  h3: setBlockType(schema.nodes.heading, { level: 3 }),
  h4: setBlockType(schema.nodes.heading, { level: 4 }),
  h5: setBlockType(schema.nodes.heading, { level: 5 }),
  h6: setBlockType(schema.nodes.heading, { level: 6 }),
  orderedList: wrapInList(schema.nodes.ordered_list),
  unorderedList: wrapInList(schema.nodes.bullet_list),
  indent: chainCommands(sinkListItem(schema.nodes.list_item), joinUp),
  outdent: chainCommands(liftListItem(schema.nodes.list_item), lift),
  quote: wrapIn(schema.nodes.blockquote),
  code: createCodeBlock,
  enter: handleEnter,
  break: createHardBreak,
  exit: exitCode,
  backspace: backspace,
  delete: del,
  selectAll: selectAll,
  insertImage: insertImage
}
