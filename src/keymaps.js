import { keymap } from 'prosemirror-keymap'
import commands from './commands'

export default keymap(commands.filter(c => c.command && c.shortcuts).reduce((mappedCommands, c) => ({
  ...mappedCommands,
  ...c.shortcuts.reduce((mappedShortcut, shortcut) => ({
    ...mappedShortcut,
    [shortcut]: c.command
  }), {})
}), {}))
