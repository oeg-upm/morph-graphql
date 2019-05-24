import Direction from "../Direction/Direction";
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
    location_id: "IntArray",
    subjects_id: "IntArray"
  },
  relationships: {
    location: {
      get type(){ return Direction; },
      fkField: "location_id",
      keyField: "_id",
      manyToMany: true,
      __isArray: true,
      __isObject: false
    },
    subjects: {
      get type(){ return Subject; },
      fkField: "subjects_id",
      keyField: "_id",
      manyToMany: true,
      __isArray: true,
      __isObject: false
    }
  }
};