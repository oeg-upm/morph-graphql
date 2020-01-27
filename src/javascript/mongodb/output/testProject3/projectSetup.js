import { dataTypes } from "mongo-graphql-starter";
const {
	MongoIdType,
	MongoIdArrayType,
	StringType,
	StringArrayType,
	BoolType,
	IntType,
	IntArrayType,
	FloatType,
	FloatArrayType,
	arrayOf,
	objectOf,
} = dataTypes;

export const Student = {
	table: "students",
	fields: {
		_id: IntType,
		name: StringType,
		age: IntType,
		email: StringType
	}
};

