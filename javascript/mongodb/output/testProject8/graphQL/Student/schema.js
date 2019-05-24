export const type = `
  
  type Student {
    _id: Int
    name: String
    email: String
    age: Int
    failer: Boolean
    location_id: [Int]
    subjects_id: [Int]
    location(SORT: DirectionSort, SORTS: [DirectionSort]): [Direction]
    subjects(SORT: SubjectSort, SORTS: [SubjectSort]): [Subject]
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
    _id: Int
    name: String
    email: String
    age: Int
    failer: Boolean
    location_id: [Int]
    subjects_id: [Int]
    location: [DirectionInput]
    subjects: [SubjectInput]
  }

  input StudentMutationInput {
    name: String
    email: String
    age: Int
    age_INC: Int
    age_DEC: Int
    failer: Boolean
    location_id: [Int]
    location_id_PUSH: Int
    location_id_CONCAT: [Int]
    location_id_UPDATE: IntArrayUpdate
    location_id_UPDATES: [IntArrayUpdate]
    location_id_PULL: [Int]
    location_id_ADDTOSET: [Int]
    subjects_id: [Int]
    subjects_id_PUSH: Int
    subjects_id_CONCAT: [Int]
    subjects_id_UPDATE: IntArrayUpdate
    subjects_id_UPDATES: [IntArrayUpdate]
    subjects_id_PULL: [Int]
    subjects_id_ADDTOSET: [Int]
    location_ADD: [DirectionInput]
    subjects_ADD: [SubjectInput]
  }

  input StudentSort {
    _id: Int
    name: Int
    email: Int
    age: Int
    failer: Int
    location_id: Int
    subjects_id: Int
  }

  input StudentFilters {
    _id_lt: Int
    _id_lte: Int
    _id_gt: Int
    _id_gte: Int
    _id: Int
    _id_ne: Int
    _id_in: [Int]
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
    location_id_count: Int
    location_id_lt: Int
    location_id_lte: Int
    location_id_gt: Int
    location_id_gte: Int
    location_id_emlt: Int
    location_id_emlte: Int
    location_id_emgt: Int
    location_id_emgte: Int
    location_id: [Int]
    location_id_in: [[Int]]
    location_id_contains: Int
    location_id_containsAny: [Int]
    location_id_ne: [Int]
    subjects_id_count: Int
    subjects_id_lt: Int
    subjects_id_lte: Int
    subjects_id_gt: Int
    subjects_id_gte: Int
    subjects_id_emlt: Int
    subjects_id_emlte: Int
    subjects_id_emgt: Int
    subjects_id_emgte: Int
    subjects_id: [Int]
    subjects_id_in: [[Int]]
    subjects_id_contains: Int
    subjects_id_containsAny: [Int]
    subjects_id_ne: [Int]
    OR: [StudentFilters]
  }
  
`;
  
  
export const mutation = `

  createStudent (
    Student: StudentInput
  ): StudentMutationResult

  updateStudent (
    _id: Int,
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
    _id_lt: Int,
    _id_lte: Int,
    _id_gt: Int,
    _id_gte: Int,
    _id: Int,
    _id_ne: Int,
    _id_in: [Int],
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
    location_id_count: Int,
    location_id_lt: Int,
    location_id_lte: Int,
    location_id_gt: Int,
    location_id_gte: Int,
    location_id_emlt: Int,
    location_id_emlte: Int,
    location_id_emgt: Int,
    location_id_emgte: Int,
    location_id: [Int],
    location_id_in: [[Int]],
    location_id_contains: Int,
    location_id_containsAny: [Int],
    location_id_ne: [Int],
    subjects_id_count: Int,
    subjects_id_lt: Int,
    subjects_id_lte: Int,
    subjects_id_gt: Int,
    subjects_id_gte: Int,
    subjects_id_emlt: Int,
    subjects_id_emlte: Int,
    subjects_id_emgt: Int,
    subjects_id_emgte: Int,
    subjects_id: [Int],
    subjects_id_in: [[Int]],
    subjects_id_contains: Int,
    subjects_id_containsAny: [Int],
    subjects_id_ne: [Int],
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
  
