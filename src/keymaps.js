import { keymap } from 'prosemirror-keymap'
import commands from './commands'

export function createKeymaps (config) {
  const keys = {}
  for (const [key, { shortcuts }] of Object.entries(config)) {
    if (shortcuts) {
      shortcuts.forEach((shortcut) => {
        keys[shortcut] = commands[key]
      })
    }
  }
  return keymap(keys)
}
