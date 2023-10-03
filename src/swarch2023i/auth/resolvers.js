import { generalRequest, getRequest } from '../../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}`;

const resolvers = {
    Query: {
        userById: (_, {id} ) =>
            generalRequest(`${URL}/${_id}`, 'GET')
    },
    Mutation: {
        signIn: async (_, {username, password} ) => {
            console.log(`${URL}/login`);
            let user = await generalRequest(
                `${URL}/login`,
                'POST',
                { username, password }
            );
            //if (user.statusCode !== 200) 
            return user;


        }
    }
};

export default resolvers