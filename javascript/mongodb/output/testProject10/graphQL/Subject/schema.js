export const type = `
  
  type Subject {
    name: String
    credits: Int
    type: String
  }

  input SubjectInput {
    name: String
    credits: Int
    type: String
  }

  input SubjectMutationInput {
    name: String
    credits: Int
    credits_INC: Int
    credits_DEC: Int
    type: String
  }

  input SubjectArrayMutationInput {
    index: Int
    Updates: SubjectMutationInput
  }

  input SubjectSort {
    name: Int
    credits: Int
    type: Int
  }

  input SubjectFilters {
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
    OR: [SubjectFilters]
  }
  
`;
  
  
  
