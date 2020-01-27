export const type = `
  
  type Direccion {
    _id: String
    id: Int
    street: String
  }

  type DireccionQueryResults {
    Direccions: [Direccion]
    Meta: QueryResultsMetadata
  }

  type DireccionSingleQueryResult {
    Direccion: Direccion
  }

  type DireccionMutationResult {
    Direccion: Direccion
    success: Boolean
    Meta: MutationResultInfo
  }

  type DireccionMutationResultMulti {
    Direccions: [Direccion]
    success: Boolean
    Meta: MutationResultInfo
  }

  type DireccionBulkMutationResult {
    success: Boolean
    Meta: MutationResultInfo
  }

  input DireccionInput {
    _id: String
    id: Int
    street: String
  }

  input DireccionMutationInput {
    id: Int
    id_INC: Int
    id_DEC: Int
    street: String
  }

  input DireccionSort {
    _id: Int
    id: Int
    street: Int
  }

  input DireccionFilters {
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
    street_contains: String
    street_startsWith: String
    street_endsWith: String
    street_regex: String
    street: String
    street_ne: String
    street_in: [String]
    OR: [DireccionFilters]
  }
  
`;
  
  
export const mutation = `

  createDireccion (
    Direccion: DireccionInput
  ): DireccionMutationResult

  updateDireccion (
    _id: String,
    Updates: DireccionMutationInput
  ): DireccionMutationResult

  updateDireccions (
    _ids: [String],
    Updates: DireccionMutationInput
  ): DireccionMutationResultMulti

  updateDireccionsBulk (
    Match: DireccionFilters,
    Updates: DireccionMutationInput
  ): DireccionBulkMutationResult

  deleteDireccion (
    _id: String
  ): DeletionResultInfo

`;


export const query = `

  allDireccions (
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
    street_contains: String,
    street_startsWith: String,
    street_endsWith: String,
    street_regex: String,
    street: String,
    street_ne: String,
    street_in: [String],
    OR: [DireccionFilters],
    SORT: DireccionSort,
    SORTS: [DireccionSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): DireccionQueryResults

  getDireccion (
    _id: String
  ): DireccionSingleQueryResult

`;
  
