// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Item, Todo } = initSchema(schema);

export {
  Item,
  Todo
};