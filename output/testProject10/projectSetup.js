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

export const Direction = {
	fields: {
		street: StringType,
		number: IntType
	}
};

export const Student = {
	table: "students",
	fields: {
		_id: StringType,
		name: StringType,
		email: StringType,
		age: IntType,
		failer: BoolType,
		get location() {
			return objectOf(Direction);
		},
		get subjects() {
			return arrayOf(Subject);
		}
	}
};

export const Subject = {
	fields: {
		name: StringType,
		credits: IntType,
		type: StringType
	}
};

