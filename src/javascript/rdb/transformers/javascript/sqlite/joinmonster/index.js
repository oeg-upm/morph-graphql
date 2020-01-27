import { GraphQLSchema } from 'graphql'

import QueryRoot from './QueryRoot'

export default new GraphQLSchema({
  description: 'GraphQL Schema',
  query: QueryRoot
})

