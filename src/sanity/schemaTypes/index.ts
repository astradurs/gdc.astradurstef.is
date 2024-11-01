import { type SchemaTypeDefinition } from 'sanity'
import blockContent from './block-content'
import gdcEvent from './gdc-event'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [gdcEvent,blockContent],
}
