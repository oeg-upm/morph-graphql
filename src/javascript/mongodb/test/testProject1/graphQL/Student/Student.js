import Direction from "../Direction/Direction";
import Student from "../Student/Student";

export default {
  table: "students",
  typeName: "Student",
  fields: {
    _id: "Int",
    name: "String",
    email: "String",
    age: "Int",
    failer: "Boolean",
    location: {
      __isObject: true,
      get type(){ return Direction; }
    },
    subjects: {
      __isArray: true,
      get type(){ return Student; }
    }
  },
  relationships: {

  }
};