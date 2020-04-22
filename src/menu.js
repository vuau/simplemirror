import { Plugin } from 'prosemirror-state'
import commands from './commands'

class MenuView {
  constructor (items, editorView) {
    this.editorView = editorView

    this.dom = document.createElement('div')
    this.dom.className = 'menubar'

    this.items = items
      .map(({ command, text, className }) => {
        if (text || className) {
          return this.createItem({ command, text, className })
        }
        return null
      })
      .filter((item) => item)

    this.update()
  }

  createItem = ({ text, className, command }) => {
    const span = document.createElement('span')
    span.className = 'menuitem ' + className
    span.title = text || ''
    span.textContent = text
    span.addEventListener('mousedown', (e) => {
      e.preventDefault()
      this.editorView.focus()
      command(this.editorView.state, this.editorView.dispatch, this.editorView)
    })
    const checkActive = () => {
      const active = command(this.editorView.state)
      span.style.display = active ? '' : 'none'
    }
    this.dom.appendChild(span)
    return {
      dom: span,
      checkActive
    }
  }

  update () {
    this.items.forEach(({ checkActive }) => {
      checkActive()
    })
  }

  destroy () {
    this.dom.remove()
  }
}

export function createMenu (config) {
  return new Plugin({
    view (editorView) {
      const items = []
      for (const [key, value] of Object.entries(config)) {
        if (commands[key]) {
          items.push({
            command: commands[key],
            ...value
          })
        }
      }
      const menuView = new MenuView(items, editorView)
      editorView.dom.parentNode.insertBefore(menuView.dom, editorView.dom)
      return menuView
    }
  })
}
