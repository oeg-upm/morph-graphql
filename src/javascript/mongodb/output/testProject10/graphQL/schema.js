import { query as StudentQuery, mutation as StudentMutation, type as StudentType } from './Student/schema';
import { type as DirectionType } from './Direction/schema';
import { type as SubjectType } from './Subject/schema';
    
export default `
  scalar JSON

  type DeletionResultInfo {
    success: Boolean,
    Meta: MutationResultInfo
  }

  type MutationResultInfo {
    transaction: Boolean,
    elapsedTime: Int
  }

  type QueryResultsMetadata {
    count: Int
  }

  input StringArrayUpdate {
    index: Int,
    value: String
  }

  input IntArrayUpdate {
    index: Int,
    value: Int
  }

  input FloatArrayUpdate {
    index: Int,
    value: Float
  }

  ${DirectionType}

  ${StudentType}

  ${SubjectType}

  type Query {
    ${StudentQuery}
  }

  type Mutation {
    ${StudentMutation}
  }

`