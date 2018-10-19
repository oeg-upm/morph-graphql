import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql'

import Person from './Person'

export default new GraphQLObjectType({
  description: 'A post from a user',
  name: 'SocialMediaPosting',
  // another table in SQL to map to 
  sqlTable: 'comentarios',
  uniqueKey: 'id',
  //interfaces: () => [ Authored ],
  fields: () => ({
    id: {
      // SQL column assumed to be "id"
      type: GraphQLInt
    },
    comment: {
      description: 'The content of the post',
      // assumed to be "body"
      type: GraphQLString,
      sqlColumn: 'mensaje'
    },
    author: {
      description: 'The user that created the post',
      // a back reference to its User
      type: Person,
      // this is a one-to-one
      sqlJoin: (socialMediaPostingTable, personTable) => `${socialMediaPostingTable}.usuario = lower(substr(${personTable}.nombre,1,1) || ${personTable}.apellido)`
    }
  })
})
