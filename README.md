# SimpleMirror

A simple and easy to use WYSIWYWG editor based on ProseMirror

## How to use

Integrate it into your project

* `dist/SimpleMirror.cjs.js`
    A CommonJS bundle, suitable for use in Node.js, that `require`s the external dependency.
* `dist/SimpleMirror.esm.js`
    an ES module bundle, suitable for use in other people's libraries and applications, that `import`s the external dependency.
* `dist/SimpleMirror.umd.js`
    a UMD build, suitable for use in any environment (including the browser, as a `<script>` tag), that includes the external dependency. 
    
Then create a new editor instance
```js
new SimpleMirror({
  selector: '#editor',
  value: 'Please change this text',
  onChange: function(value) {
    console.log(value)
  }
})
```
## License

[MIT](LICENSE).
