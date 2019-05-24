import GraphQLJSON from 'graphql-type-json';

import Direccion, { Direccion as DireccionRest } from './Direccion/resolver';
import Student, { Student as StudentRest } from './Student/resolver';
import Subject, { Subject as SubjectRest } from './Subject/resolver';

const { Query: DireccionQuery, Mutation: DireccionMutation } = Direccion;
const { Query: StudentQuery, Mutation: StudentMutation } = Student;
const { Query: SubjectQuery, Mutation: SubjectMutation } = Subject;

export default {
  JSON: GraphQLJSON,
  Query: Object.assign(
    {},
    DireccionQuery,
    StudentQuery,
    SubjectQuery
  ),
  Mutation: Object.assign({},
    DireccionMutation,
    StudentMutation,
    SubjectMutation
  ),
  Direccion: {
    ...DireccionRest
  },
  Student: {
    ...StudentRest
  },
  Subject: {
    ...SubjectRest
  }
};

