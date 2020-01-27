export const type = `
  
  type Subject {
    _id: String
    name: String
    credits: Int
    type: String
    profesor: Teacher
  }

  type SubjectQueryResults {
    Subjects: [Subject]
    Meta: QueryResultsMetadata
  }

  type SubjectSingleQueryResult {
    Subject: Subject
  }

  type SubjectMutationResult {
    Subject: Subject
    success: Boolean
    Meta: MutationResultInfo
  }

  type SubjectMutationResultMulti {
    Subjects: [Subject]
    success: Boolean
    Meta: MutationResultInfo
  }

  type SubjectBulkMutationResult {
    success: Boolean
    Meta: MutationResultInfo
  }

  input SubjectInput {
    _id: String
    name: String
    credits: Int
    type: String
    profesor: TeacherInput
  }

  input SubjectMutationInput {
    name: String
    credits: Int
    credits_INC: Int
    credits_DEC: Int
    type: String
    profesor: TeacherInput
    profesor_UPDATE: TeacherMutationInput
  }

  input SubjectArrayMutationInput {
    index: Int
    Updates: SubjectMutationInput
  }

  input SubjectSort {
    _id: Int
    name: Int
    credits: Int
    type: Int
    profesor: Int
  }

  input SubjectFilters {
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
    credits_lt: Int
    credits_lte: Int
    credits_gt: Int
    credits_gte: Int
    credits: Int
    credits_ne: Int
    credits_in: [Int]
    type_contains: String
    type_startsWith: String
    type_endsWith: String
    type_regex: String
    type: String
    type_ne: String
    type_in: [String]
    profesor_count: Int
    profesor: TeacherFilters
    OR: [SubjectFilters]
  }
  
`;
  
  
export const mutation = `

  createSubject (
    Subject: SubjectInput
  ): SubjectMutationResult

  updateSubject (
    _id: String,
    Updates: SubjectMutationInput
  ): SubjectMutationResult

  updateSubjects (
    _ids: [String],
    Updates: SubjectMutationInput
  ): SubjectMutationResultMulti

  updateSubjectsBulk (
    Match: SubjectFilters,
    Updates: SubjectMutationInput
  ): SubjectBulkMutationResult

  deleteSubject (
    _id: String
  ): DeletionResultInfo

`;


export const query = `

  allSubjects (
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
    credits_lt: Int,
    credits_lte: Int,
    credits_gt: Int,
    credits_gte: Int,
    credits: Int,
    credits_ne: Int,
    credits_in: [Int],
    type_contains: String,
    type_startsWith: String,
    type_endsWith: String,
    type_regex: String,
    type: String,
    type_ne: String,
    type_in: [String],
    profesor_count: Int,
    profesor: TeacherFilters,
    OR: [SubjectFilters],
    SORT: SubjectSort,
    SORTS: [SubjectSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): SubjectQueryResults

  getSubject (
    _id: String
  ): SubjectSingleQueryResult

`;
  
