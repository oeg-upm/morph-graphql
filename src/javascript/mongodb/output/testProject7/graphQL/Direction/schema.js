export const type = `
  
  type Direction {
    _id: Int
    street: String
    number: Int
  }

  type DirectionQueryResults {
    Directions: [Direction]
    Meta: QueryResultsMetadata
  }

  type DirectionSingleQueryResult {
    Direction: Direction
  }

  type DirectionMutationResult {
    Direction: Direction
    success: Boolean
    Meta: MutationResultInfo
  }

  type DirectionMutationResultMulti {
    Directions: [Direction]
    success: Boolean
    Meta: MutationResultInfo
  }

  type DirectionBulkMutationResult {
    success: Boolean
    Meta: MutationResultInfo
  }

  input DirectionInput {
    _id: Int
    street: String
    number: Int
  }

  input DirectionMutationInput {
    street: String
    number: Int
    number_INC: Int
    number_DEC: Int
  }

  input DirectionSort {
    _id: Int
    street: Int
    number: Int
  }

  input DirectionFilters {
    _id_lt: Int
    _id_lte: Int
    _id_gt: Int
    _id_gte: Int
    _id: Int
    _id_ne: Int
    _id_in: [Int]
    street_contains: String
    street_startsWith: String
    street_endsWith: String
    street_regex: String
    street: String
    street_ne: String
    street_in: [String]
    number_lt: Int
    number_lte: Int
    number_gt: Int
    number_gte: Int
    number: Int
    number_ne: Int
    number_in: [Int]
    OR: [DirectionFilters]
  }
  
`;
  
  
export const mutation = `

  createDirection (
    Direction: DirectionInput
  ): DirectionMutationResult

  updateDirection (
    _id: Int,
    Updates: DirectionMutationInput
  ): DirectionMutationResult

  updateDirections (
    _ids: [String],
    Updates: DirectionMutationInput
  ): DirectionMutationResultMulti

  updateDirectionsBulk (
    Match: DirectionFilters,
    Updates: DirectionMutationInput
  ): DirectionBulkMutationResult

  deleteDirection (
    _id: String
  ): DeletionResultInfo

`;


export const query = `

  allDirections (
    _id_lt: Int,
    _id_lte: Int,
    _id_gt: Int,
    _id_gte: Int,
    _id: Int,
    _id_ne: Int,
    _id_in: [Int],
    street_contains: String,
    street_startsWith: String,
    street_endsWith: String,
    street_regex: String,
    street: String,
    street_ne: String,
    street_in: [String],
    number_lt: Int,
    number_lte: Int,
    number_gt: Int,
    number_gte: Int,
    number: Int,
    number_ne: Int,
    number_in: [Int],
    OR: [DirectionFilters],
    SORT: DirectionSort,
    SORTS: [DirectionSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): DirectionQueryResults

  getDirection (
    _id: String
  ): DirectionSingleQueryResult

`;
  
