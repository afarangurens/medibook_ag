export const RecordTypeDef = `
  type RecordType {
    id:ID!
    record_type_id:String
    name: String!
    r_type: String!
    created_at: String!
    updated_at: String!
  }
  input RecordTypeInput{
    name: String!
    r_type: String! 
  }`;

export const RecordTypeQueries= `
    allRecordTypes:[RecordType]!
`;
export const RecordTypeMutations = `
    createRecordType(RecordType:RecordTypeInput!): RecordType!
`;

// export const RecordsDef = `
//   type Records {
//     id:ID!
//     record_id:Int!
//     user_id:Int!
//     account_id:Int!
//     category_id:Int!
//     name: String!
//     record_type_id:Int!
//     amount:Int!
//     date: String!
//     created_at: String!
//     updated_at: String!
//   }
//   input RecordsInput{
//     record_id:Int!
//     user_id:Int!
//     account_id:Int!
//     category_id:Int!
//     name: String!
//     record_type_id:Int!
//     amount:Int!
//     date: String!
//   }
// `;

// export const RecordsQueries= `
//     allRecords:[Records]!
// `;

// export const RecordsMutations = `
//     createRecords(Records:RecordsInput!): Records!
// `;

// {
//     "id": 1,
//     "record_type_id": null,
//     "name": "string",
//     "r_type": "string",
//     "created_at": "2023-03-14T07:53:39.950Z",
//     "updated_at": "2023-03-14T07:53:39.950Z"
// },