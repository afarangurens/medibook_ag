import { generalRequest } from '../../utilities';
import { url, port, entryPoint } from './server';

const URL = `https://${url}:${port}`;

const resolvers = {
  Query: {},
  Mutation: {
    createUser: (_, { user }) =>
      generalRequest(`${URL}/signup`, 'POST', { user }),
    loginUser: (_, { user }) =>
      generalRequest(`${URL}/login`, 'POST', { user }),
  }
};

export default resolvers;