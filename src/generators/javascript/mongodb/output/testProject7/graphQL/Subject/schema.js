export const type = `
  
  type Subject {
    _id: Int
    name: String
    credits: Int
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
    _id: Int
    name: String
    credits: Int
  }

  input SubjectMutationInput {
    name: String
    credits: Int
    credits_INC: Int
    credits_DEC: Int
  }

  input SubjectSort {
    _id: Int
    name: Int
    credits: Int
  }

  input SubjectFilters {
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
    credits_lt: Int
    credits_lte: Int
    credits_gt: Int
    credits_gte: Int
    credits: Int
    credits_ne: Int
    credits_in: [Int]
    OR: [SubjectFilters]
  }
  
`;
  
  
export const mutation = `

  createSubject (
    Subject: SubjectInput
  ): SubjectMutationResult

  updateSubject (
    _id: Int,
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
    credits_lt: Int,
    credits_lte: Int,
    credits_gt: Int,
    credits_gte: Int,
    credits: Int,
    credits_ne: Int,
    credits_in: [Int],
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
  
