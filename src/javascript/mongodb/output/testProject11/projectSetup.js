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
	table: "directions",
	fields: {
		_id: StringType,
		street: StringType,
		number: IntType
	}
};

export const Teacher = {
	table: "teachers",
	fields: {
		_id: StringType,
		name: StringType
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
	table: "subjects",
	fields: {
		_id: StringType,
		name: StringType,
		credits: IntType,
		type: StringType,
		get profesor() {
			return arrayOf(Teacher);
		},
		get profesor() {
			return objectOf(Teacher);
		}
	}
};

