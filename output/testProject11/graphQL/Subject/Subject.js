import Teacher from "../Teacher/Teacher";

export default {
  table: "subjects",
  typeName: "Subject",
  fields: {
    _id: "String",
    name: "String",
    credits: "Int",
    type: "String",
    profesor: {
      __isObject: true,
      get type(){ return Teacher; }
    }
  },
  relationships: {

  }
};