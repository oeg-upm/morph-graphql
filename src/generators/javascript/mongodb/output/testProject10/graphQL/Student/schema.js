export const type = `
  
  type Student {
    _id: String
    name: String
    email: String
    age: Int
    failer: Boolean
    location: Direction
    subjects: [Subject]
  }

  type StudentQueryResults {
    Students: [Student]
    Meta: QueryResultsMetadata
  }

  type StudentSingleQueryResult {
    Student: Student
  }

  type StudentMutationResult {
    Student: Student
    success: Boolean
    Meta: MutationResultInfo
  }

  type StudentMutationResultMulti {
    Students: [Student]
    success: Boolean
    Meta: MutationResultInfo
  }

  type StudentBulkMutationResult {
    success: Boolean
    Meta: MutationResultInfo
  }

  input StudentInput {
    _id: String
    name: String
    email: String
    age: Int
    failer: Boolean
    location: DirectionInput
    subjects: [SubjectInput]
  }

  input StudentMutationInput {
    name: String
    email: String
    age: Int
    age_INC: Int
    age_DEC: Int
    failer: Boolean
    location: DirectionInput
    location_UPDATE: DirectionMutationInput
    subjects: [SubjectInput]
    subjects_PUSH: SubjectInput
    subjects_CONCAT: [SubjectInput]
    subjects_UPDATE: SubjectArrayMutationInput
    subjects_UPDATES: [SubjectArrayMutationInput]
    subjects_PULL: SubjectFilters
  }

  input StudentSort {
    _id: Int
    name: Int
    email: Int
    age: Int
    failer: Int
    location: Int
    subjects: Int
  }

  input StudentFilters {
    _id_contains: String
    _id_startsWith: String
    _id_endsWith: String
    _id_regex: String
    _id: String
    _id_ne: String
    _id_in: [String]
    name_contains: String
    name_startsWith: String
    name_endsWith: String
    name_regex: String
    name: String
    name_ne: String
    name_in: [String]
    email_contains: String
    email_startsWith: String
    email_endsWith: String
    email_regex: String
    email: String
    email_ne: String
    email_in: [String]
    age_lt: Int
    age_lte: Int
    age_gt: Int
    age_gte: Int
    age: Int
    age_ne: Int
    age_in: [Int]
    failer: Boolean
    failer_ne: Boolean
    failer_in: [Boolean]
    location_count: Int
    location: DirectionFilters
    subjects_count: Int
    subjects: SubjectFilters
    OR: [StudentFilters]
  }
  
`;
  
  
export const mutation = `

  createStudent (
    Student: StudentInput
  ): StudentMutationResult

  updateStudent (
    _id: String,
    Updates: StudentMutationInput
  ): StudentMutationResult

  updateStudents (
    _ids: [String],
    Updates: StudentMutationInput
  ): StudentMutationResultMulti

  updateStudentsBulk (
    Match: StudentFilters,
    Updates: StudentMutationInput
  ): StudentBulkMutationResult

  deleteStudent (
    _id: String
  ): DeletionResultInfo

`;


export const query = `

  allStudents (
    _id_contains: String,
    _id_startsWith: String,
    _id_endsWith: String,
    _id_regex: String,
    _id: String,
    _id_ne: String,
    _id_in: [String],
    name_contains: String,
    name_startsWith: String,
    name_endsWith: String,
    name_regex: String,
    name: String,
    name_ne: String,
    name_in: [String],
    email_contains: String,
    email_startsWith: String,
    email_endsWith: String,
    email_regex: String,
    email: String,
    email_ne: String,
    email_in: [String],
    age_lt: Int,
    age_lte: Int,
    age_gt: Int,
    age_gte: Int,
    age: Int,
    age_ne: Int,
    age_in: [Int],
    failer: Boolean,
    failer_ne: Boolean,
    failer_in: [Boolean],
    location_count: Int,
    location: DirectionFilters,
    subjects_count: Int,
    subjects: SubjectFilters,
    OR: [StudentFilters],
    SORT: StudentSort,
    SORTS: [StudentSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): StudentQueryResults

  getStudent (
    _id: String
  ): StudentSingleQueryResult

`;
  
