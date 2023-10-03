import { generalRequest, getRequest } from '../../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;


const resolvers = {
	Query: {
		allRecordTypes: (_) =>
			getRequest(URL, '')

	},
	Mutation: {
		createRecordType: (_, { recordtype }) =>
			generalRequest(`${URL}/`, 'POST', recordtype)

	}
};


export default resolvers;
