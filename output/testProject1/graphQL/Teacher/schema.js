export const type = `
  
  type Teacher {
    _id: String
    name: String
  }

  type TeacherQueryResults {
    Teachers: [Teacher]
    Meta: QueryResultsMetadata
  }

  type TeacherSingleQueryResult {
    Teacher: Teacher
  }

  type TeacherMutationResult {
    Teacher: Teacher
    success: Boolean
    Meta: MutationResultInfo
  }

  type TeacherMutationResultMulti {
    Teachers: [Teacher]
    success: Boolean
    Meta: MutationResultInfo
  }

  type TeacherBulkMutationResult {
    success: Boolean
    Meta: MutationResultInfo
  }

  input TeacherInput {
    _id: String
    name: String
  }

  input TeacherMutationInput {
    name: String
  }

  input TeacherSort {
    _id: Int
    name: Int
  }

  input TeacherFilters {
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
    OR: [TeacherFilters]
  }
  
`;
  
  
export const mutation = `

  createTeacher (
    Teacher: TeacherInput
  ): TeacherMutationResult

  updateTeacher (
    _id: String,
    Updates: TeacherMutationInput
  ): TeacherMutationResult

  updateTeachers (
    _ids: [String],
    Updates: TeacherMutationInput
  ): TeacherMutationResultMulti

  updateTeachersBulk (
    Match: TeacherFilters,
    Updates: TeacherMutationInput
  ): TeacherBulkMutationResult

  deleteTeacher (
    _id: String
  ): DeletionResultInfo

`;


export const query = `

  allTeachers (
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
    OR: [TeacherFilters],
    SORT: TeacherSort,
    SORTS: [TeacherSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): TeacherQueryResults

  getTeacher (
    _id: String
  ): TeacherSingleQueryResult

`;
  
