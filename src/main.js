import { DOMParser, DOMSerializer } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { history } from 'prosemirror-history'

import schema from './schema'
import keymaps from './keymaps'
import menu from './menu'

import 'prosemirror-view/style/prosemirror.css'
import './main.css'

class SimpleMirror {
  constructor (config) {
    const { selector, value, onChange } = config

    if (!selector) {
      throw new Error('you need to specify a selector to init SimpleMirror')
    }

    this.editorDOM = document.querySelector(selector)
    this.editor = new EditorView(this.editorDOM, {
      dispatchTransaction: this.dispatchTransaction,
      state: this.createState(value)
    })

    this.prosemirrorDOM = this.editorDOM.querySelector('.ProseMirror')
    this.prosemirrorDOM.addEventListener('scroll', this.saveLastScroll)

    this.onChange = onChange

    document.execCommand('enableObjectResizing', false, false)
    document.execCommand('enableInlineTableEditing', false, false)
  }

  dispatchTransaction = (tr) => {
    const nextState = this.editor.state.apply(tr)
    this.editor.updateState(nextState)
    if (tr.docChanged) {
      const fragment = DOMSerializer.fromSchema(schema).serializeFragment(
        tr.doc.content
      )
      const tmp = document.createElement('div')
      tmp.appendChild(fragment)
      this.onChange(tmp.innerHTML)
    }
  }

  saveLastScroll = () => {
    this.lastScrollPosition = this.prosemirrorDOM.scrollTop
  }

  createState = value => {
    const node = document.createElement('div')
    node.innerHTML = value

    const state = EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(node),
      plugins: [
        menu,
        keymaps,
        history()
      ]
    })
    return state
  }

  update = () => {
    this.prosemirrorDOM.scrollTop = this.lastScrollPosition
  }

  remove = () => {
    this.prosemirrorDOM.removeEventListener('scroll', this.saveLastScroll)
    this.editor.destroy()
  }
}

export default SimpleMirror
