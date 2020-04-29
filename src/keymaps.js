import { keymap } from 'prosemirror-keymap'
import commands from './commands'

const predefinedKeymaps = {
  'Mod-z': commands.undo,
  'Shift-Mod-z': commands.redo,
  Tab: commands.indent,
  'Shift-Tab': commands.outdent,
  Enter: commands.enter,
  'Mod-Enter': commands.break,
  'Shift-Enter': commands.break,
  'Ctrl-Enter': commands.break,
  Backspace: commands.backspace,
  'Mod-Backspace': commands.backspace,
  Delete: commands.delete,
  'Mod-Delete': commands.delete,
  'Mod-a': commands.selectAll
}

export function createKeymaps (config) {
  const keys = predefinedKeymaps
  for (const [key, { shortcuts }] of Object.entries(config)) {
    if (shortcuts) {
      shortcuts.forEach((shortcut) => {
        keys[shortcut] = commands[key]
      })
    }
  }
  return keymap(keys)
}
