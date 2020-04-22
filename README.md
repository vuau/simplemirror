# SimpleMirror
![](https://img.shields.io/npm/dw/simplemirror)

A simple and easy to use WYSIWYWG editor based on ProseMirror

## How to use

Integrate into your project

* `dist/SimpleMirror.cjs.js`
    A CommonJS bundle, suitable for use in Node.js, that `require`s the external dependency.
* `dist/SimpleMirror.esm.js`
    an ES module bundle, suitable for use in other people's libraries and applications, that `import`s the external dependency.
* `dist/SimpleMirror.umd.js`
    a UMD build, suitable for use in any environment (including the browser, as a `<script>` tag), that includes the external dependency. 
* `dist/SimpleMirror.css`
    Essential CSS for the editor

Then create a new editor instance. That's it!

Example 1: http://simplemirror.now.sh
```js
new SimpleMirror({
  selector: '#editor',
  value: 'Please change this text',
  onChange: function(value) {
    console.log(value)
  }
})
```

## Configuration
### selector
  The CSS selector where the editor should be inject to
### value
  The content to show in the editor after initialization. It could be plain text or HTML
### onChange
  The callback function to watch if editor's content has been changed
### config
  Defined commands to be used. If ignored, the editor will show all default commands using Fontawesome icons. You can specify CSS classes for the menu items and/or keyboard shortcuts and/or input rules if you want.
- Customizable commands: `["undo", "redo", "bold", "italic", "strikethrough", "h1", "h2", "h3", "h4", "orderedList", "unorderedList", "indent", "outdent", "quote", ]`. There are more coming in the future :)
- Key names may be strings like "Shift-Ctrl-Enter"—a key identifier prefixed with zero or more modifiers. Key identifiers are based on the strings that can appear in [KeyEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key). Use lowercase letters to refer to letter keys (or uppercase letters if you want shift to be held). You may use "Space" as an alias for the " " name. You can use Mod- as a shorthand for Cmd- on Mac and Ctrl- on other platforms.

Example 2: http://simplemirror.now.sh/custom.html
```js
new SimpleMirror({
  selector: '#editor',
  value: 'Please change this text',
  config: {
    h1: {
      text: 'H1',
      inputRule: /^#\s/
    },
    bold: {
      className: 'material-icons',
      text: 'format_bold',
      shortcuts: ['Mod-b', 'Mod-B']
    },
    italic: {
      className: 'material-icons',
      text: 'format_italic',
      shortcuts: ['Mod-i', 'Mod-I']
    },
    undo: {
      shortcuts: ['Mod-z']
    }
  },
  onChange: function(value) {
    console.log(value)
  }
})
```
## License

[MIT](LICENSE).
