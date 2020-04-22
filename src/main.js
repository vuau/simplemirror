import { DOMParser, DOMSerializer } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { history } from 'prosemirror-history'

import schema from './schema'
import defaultConfig from './defaultConfig'
import { createMenu } from './menu'

import 'prosemirror-view/style/prosemirror.css'
import './main.css'

class SimpleMirror {
  constructor ({ selector, value, onChange, config }) {
    if (!selector) {
      throw new Error('you need to specify a selector to init SimpleMirror')
    }

    this.config = config || defaultConfig
    this.onChange = onChange
    this.menuPlugin = createMenu(this.config)
    this.view = new EditorView(document.querySelector(selector), {
      dispatchTransaction: this.dispatchTransaction.bind(this),
      state: this.createState(value)
    })
  }

  dispatchTransaction (tr) {
    const nextState = this.view.state.apply(tr)
    this.view.updateState(nextState)
    if (tr.docChanged) {
      const fragment = DOMSerializer.fromSchema(schema).serializeFragment(
        tr.doc.content
      )
      const tmp = document.createElement('div')
      tmp.appendChild(fragment)
      this.onChange(tmp.innerHTML)
    }
  }

  createState (value) {
    const node = document.createElement('div')
    node.innerHTML = value

    const state = EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(node),
      plugins: [this.menuPlugin, history()]
    })
    return state
  }

  remove () {
    this.view.destroy()
  }
}

export default SimpleMirror
