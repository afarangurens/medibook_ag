export const authTypeDef = `
    type User {
        email: String!
        password: String!
    }

    type Status {
        code: Int!
        message: String!
    }

    input UserInput {
        email: String!
        password: String!
    }

    type CreateUserResponse {
        status: Status!
    }

    type UserLogin {
        id: Int!
        email: String!
    }
    type Data {
        user: UserLogin!
        token: String!
    }

    type LoginStatus {
        code: Int!
        message: String!
        data: Data!
    }

    type AuthResponse {
        status: LoginStatus!
    }
    
`;

export const authQueries = `
    getUser(email: String!): User
  `;

export const authMutations = `
    createUser(user: UserInput!): CreateUserResponse
    loginUser(user: UserInput!): AuthResponse
`;
