import { keymap } from 'prosemirror-keymap'

export function createKeymaps (customCommands) {
  return keymap(
    customCommands
      .filter((c) => c.command && c.shortcuts)
      .reduce(
        (mappedCommands, c) => ({
          ...mappedCommands,
          ...c.shortcuts.reduce(
            (mappedShortcut, shortcut) => ({
              ...mappedShortcut,
              [shortcut]: c.command
            }),
            {}
          )
        }),
        {}
      )
  )
}
