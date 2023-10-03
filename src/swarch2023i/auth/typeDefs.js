export const authTypeDef = `
    type User {
        _id: ID!
        username: String!
        password: String!
    }
    input UserInput {
        _id: ID!
        username: String!
        password: String!
    }
    type Session {
        userId: String!
        username: String!
        token: String!
    }`;

export const authenticationQueries = `
    userById(id: ID!): User!
    validateToken(token: String!): Boolean!
`;

export const authenticationMutations = `
    createUser(user: UserInput!): User!
    deleteUser(id: ID!): User!
    updateUser(id: ID!, user: UserInput!): User!

    signIn(username: String!, password: String!): Session!
    signOut(token: String!): Session!
`;