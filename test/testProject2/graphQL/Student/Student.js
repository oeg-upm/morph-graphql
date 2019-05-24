import Subject from "../Subject/Subject";

export default {
  table: "students",
  typeName: "Student",
  fields: {
    _id: "Int",
    name: "String",
    email: "String",
    age: "Int",
    failer: "Boolean",
    subjects: {
      __isArray: true,
      get type(){ return Subject; }
    }
  },
  relationships: {

  }
};