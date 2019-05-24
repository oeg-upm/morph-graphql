import GraphQLJSON from 'graphql-type-json';

import Direction, { Direction as DirectionRest } from './Direction/resolver';
import Student, { Student as StudentRest } from './Student/resolver';
import Subject, { Subject as SubjectRest } from './Subject/resolver';
import Teacher, { Teacher as TeacherRest } from './Teacher/resolver';

const { Query: DirectionQuery, Mutation: DirectionMutation } = Direction;
const { Query: StudentQuery, Mutation: StudentMutation } = Student;
const { Query: SubjectQuery, Mutation: SubjectMutation } = Subject;
const { Query: TeacherQuery, Mutation: TeacherMutation } = Teacher;

export default {
  JSON: GraphQLJSON,
  Query: Object.assign(
    {},
    DirectionQuery,
    StudentQuery,
    SubjectQuery,
    TeacherQuery
  ),
  Mutation: Object.assign({},
    DirectionMutation,
    StudentMutation,
    SubjectMutation,
    TeacherMutation
  ),
  Direction: {
    ...DirectionRest
  },
  Student: {
    ...StudentRest
  },
  Subject: {
    ...SubjectRest
  },
  Teacher: {
    ...TeacherRest
  }
};

