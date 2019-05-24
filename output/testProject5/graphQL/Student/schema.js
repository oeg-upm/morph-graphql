export const type = `
  
  type Student {
    _id: String
    id: Int
    name: String
    email: String
    age: Int
    location: String
    subjects: String
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
    id: Int
    name: String
    email: String
    age: Int
    location: String
    subjects: String
  }

  input StudentMutationInput {
    id: Int
    id_INC: Int
    id_DEC: Int
    name: String
    email: String
    age: Int
    age_INC: Int
    age_DEC: Int
    location: String
    subjects: String
  }

  input StudentSort {
    _id: Int
    id: Int
    name: Int
    email: Int
    age: Int
    location: Int
    subjects: Int
  }

  input StudentFilters {
    _id: String
    _id_ne: String
    _id_in: [String]
    id_lt: Int
    id_lte: Int
    id_gt: Int
    id_gte: Int
    id: Int
    id_ne: Int
    id_in: [Int]
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
    location_contains: String
    location_startsWith: String
    location_endsWith: String
    location_regex: String
    location: String
    location_ne: String
    location_in: [String]
    subjects_contains: String
    subjects_startsWith: String
    subjects_endsWith: String
    subjects_regex: String
    subjects: String
    subjects_ne: String
    subjects_in: [String]
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
    _id: String,
    _id_ne: String,
    _id_in: [String],
    id_lt: Int,
    id_lte: Int,
    id_gt: Int,
    id_gte: Int,
    id: Int,
    id_ne: Int,
    id_in: [Int],
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
    location_contains: String,
    location_startsWith: String,
    location_endsWith: String,
    location_regex: String,
    location: String,
    location_ne: String,
    location_in: [String],
    subjects_contains: String,
    subjects_startsWith: String,
    subjects_endsWith: String,
    subjects_regex: String,
    subjects: String,
    subjects_ne: String,
    subjects_in: [String],
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
  
