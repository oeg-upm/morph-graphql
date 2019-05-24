import GraphQLJSON from 'graphql-type-json';

import Student, { Student as StudentRest } from './Student/resolver';

const { Query: StudentQuery, Mutation: StudentMutation } = Student;

export default {
  JSON: GraphQLJSON,
  Query: Object.assign(
    {},
    StudentQuery
  ),
  Mutation: Object.assign({},
    StudentMutation
  ),
  Student: {
    ...StudentRest
  }
};

