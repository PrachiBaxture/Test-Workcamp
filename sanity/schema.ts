import { type SchemaTypeDefinition } from 'sanity'
import post from './schemaTypes/post'
import author from './schemaTypes/author'
import blockContent from './schemaTypes/blockContent'
import category from './schemaTypes/category'
// import { post } from './schemas/post'
// import { tag } from './schemas/tag'
// import { comment } from './schemas/comment'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, author, blockContent, category],
}
