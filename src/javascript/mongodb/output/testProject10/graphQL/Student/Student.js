import Direction from "../Direction/Direction";
import Subject from "../Subject/Subject";

export default {
  table: "students",
  typeName: "Student",
  fields: {
    _id: "String",
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
      get type(){ return Subject; }
    }
  },
  relationships: {

  }
};