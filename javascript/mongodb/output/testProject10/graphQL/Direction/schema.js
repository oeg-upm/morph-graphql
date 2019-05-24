export const type = `
  
  type Direction {
    street: String
    number: Int
  }

  input DirectionInput {
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
    street: Int
    number: Int
  }

  input DirectionFilters {
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
  
  
  
