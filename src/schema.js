import { Schema } from 'prosemirror-model'
import { marks, schema as baseSchema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'

const strikethrough = {
  parseDOM: [
    { tag: 'strike' },
    { tag: 'del' },
    { tag: 's' },
    { style: 'text-decoration:line-through' },
    { style: 'text-decoration-line:line-through' }
  ],
  toDOM: () => [
    's'
  ]
}

const schema = new Schema({
  nodes: addListNodes(baseSchema.spec.nodes, 'paragraph block*', 'block'),
  marks: {
    ...marks,
    strikethrough
  }
})

export default schema
